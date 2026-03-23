from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import tempfile
import uuid
import os
import pypdf
import docx
import pandas as pd

from transcriber import transcribe_audio
from diarizer import diarize_audio, merge_transcription_and_diarization
from chains import process_meeting, setup_rag, ask_meeting, ask_meeting_stream

app = FastAPI(title="MeetSync Core API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow development frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for RAG sessions (In production use Redis or persistent DB)
sessions = {}

@app.post("/api/process")
async def process_audio(
    file: UploadFile = File(None),
    transcript_text: str = Form(""),
    use_diarization: bool = Form(False)
):
    if not file and not transcript_text.strip():
        raise HTTPException(status_code=400, detail="Must provide either an audio file or a raw transcript.")
    
    transcript = ""
    if transcript_text.strip():
        transcript = transcript_text
    elif file:
        file_ext = os.path.splitext(file.filename)[1].lower() if file.filename else ".mp3"
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
            tmp_file.write(await file.read())
            temp_path = tmp_file.name
            
        try:
            if file_ext in [".mp3", ".wav", ".m4a"]:
                t_result = transcribe_audio(temp_path)
                if use_diarization:
                    d_result = diarize_audio(temp_path)
                    transcript = merge_transcription_and_diarization(t_result['segments'], d_result)
                else:
                    transcript = t_result['text']
            elif file_ext == ".pdf":
                reader = pypdf.PdfReader(temp_path)
                transcript = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
            elif file_ext == ".docx":
                doc = docx.Document(temp_path)
                transcript = "\n".join([p.text for p in doc.paragraphs])
            elif file_ext == ".txt":
                with open(temp_path, "r", encoding="utf-8", errors="ignore") as f:
                    transcript = f.read()
            elif file_ext in [".xlsx", ".csv"]:
                if file_ext == ".csv":
                    df = pd.read_csv(temp_path)
                else:
                    df = pd.read_excel(temp_path)
                transcript = df.to_string()
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported file format: {file_ext}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    if not transcript:
        raise HTTPException(status_code=500, detail="Failed to extract transcript.")
        
    # Process through LLM Chains
    results = process_meeting(transcript)
    
    # Setup RAG session
    session_id = str(uuid.uuid4())
    vectorstore = setup_rag(transcript)
    sessions[session_id] = vectorstore
    
    # Safely extract Pydantic arrays
    actions = []
    if "action_items_raw" in results and "items" in results["action_items_raw"]:
        actions = results["action_items_raw"]["items"]
        
    decisions = []
    if "decisions_raw" in results and "decisions" in results["decisions_raw"]:
        decisions = results["decisions_raw"]["decisions"]
    
    return {
        "session_id": session_id,
        "results": {
            "summary": results["summary"],
            "action_items": actions,
            "decisions": decisions,
            "email_draft": results["email_draft"],
            "transcript": transcript
        }
    }

class ChatRequest(BaseModel):
    session_id: str
    question: str

@app.post("/api/chat")
async def chat_with_meeting(req: ChatRequest):
    if req.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found or expired.")
    
    answer = ask_meeting(sessions[req.session_id], req.question)
    return {"answer": answer}

@app.post("/api/chat/stream")
async def chat_with_meeting_stream(req: ChatRequest):
    if req.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found or expired.")
    
    def generate():
        for chunk in ask_meeting_stream(sessions[req.session_id], req.question):
            yield chunk
            
    return StreamingResponse(generate(), media_type="text/plain")
