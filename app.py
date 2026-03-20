import streamlit as st
import os
import pandas as pd
from config import GROQ_API_KEY
from transcriber import transcribe_audio
from diarizer import diarize_audio, merge_transcription_and_diarization
from chains import process_meeting, setup_rag, ask_meeting, ask_meeting_stream
from exporter import export_docx, export_pdf

st.set_page_config(page_title="MeetSync GenAI Server", page_icon="🎙️", layout="wide")

st.title("MeetSync 🎙️ [GenAI Edition]")
st.markdown("Industry-ready meeting intelligence utilizing **LangChain RunnableParallel**, **Pydantic Structured Outputs**, and **Conversational Semantic Search** via `FAISS` and `sentence-transformers`.")

# Initialize session state for transcript, results, and RAG vectorstore
if 'transcript' not in st.session_state:
    st.session_state['transcript'] = ""
if 'results' not in st.session_state:
    st.session_state['results'] = {}
if 'vectorstore' not in st.session_state:
    st.session_state['vectorstore'] = None
if 'chat_history' not in st.session_state:
    st.session_state['chat_history'] = []

# Sidebar settings
with st.sidebar:
    st.header("Settings")
    use_diarization = st.checkbox("Enable Speaker Diarization", help="Requires Hugging Face token.")

tab1, tab2, tab3 = st.tabs(["1. Upload & Process", "2. Intelligence Report", "3. Chat with Meeting"])

with tab1:
    uploaded_file = st.file_uploader("Upload Meeting Audio", type=["mp3", "wav", "m4a", "mp4"])
    pasted_transcript = st.text_area("Or Paste Transcript Here", height=200)

    if st.button("Analyze Meeting"):
        if not GROQ_API_KEY:
            st.error("GROQ API Key is missing. Please check your .env file.")
            st.stop()
            
        with st.spinner("Processing... this might take a minute."):
            transcript = ""
            if pasted_transcript.strip():
                transcript = pasted_transcript
            elif uploaded_file:
                # Save file temporarily
                temp_path = f"temp_{uploaded_file.name}"
                with open(temp_path, "wb") as f:
                    f.write(uploaded_file.getbuffer())
                
                try:
                    # Transcribe
                    with st.status("Transcribing audio (Whisper)..."):
                        t_result = transcribe_audio(temp_path)
                    
                    if use_diarization:
                        with st.status("Performing speaker diarization (Pyannote)..."):
                            d_result = diarize_audio(temp_path)
                        transcript = merge_transcription_and_diarization(t_result['segments'], d_result)
                    else:
                        transcript = t_result['text']
                        
                except Exception as e:
                    st.error(f"Error during audio processing: {e}")
                finally:
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
            
            if transcript:
                st.session_state['transcript'] = transcript
                with st.status("Parallel LLM generation acting on Structured Outputs (Llama-3-70b)..."):
                    results = process_meeting(transcript)
                    st.session_state['results'] = results
                    st.session_state['vectorstore'] = setup_rag(transcript)
                    st.session_state['chat_history'] = [] # Reset chat
                st.success("Analysis complete! Lightning fast concurrency executed.")

with tab2:
    if st.session_state['results']:
        results = st.session_state['results']
        
        st.header("Executive Summary")
        st.write(results['summary'])
        
        st.divider()
        st.header("Action Items")
        # Display as a structured DataFrame
        if results.get("action_items_raw") and "items" in results["action_items_raw"]:
            df_actions = pd.DataFrame(results["action_items_raw"]["items"])
            if not df_actions.empty:
                st.dataframe(df_actions, use_container_width=True, hide_index=True)
            else:
                st.write("No action items identified.")
        else:
            st.write(results['action_items'])
        
        st.divider()
        st.header("Key Decisions")
        # Display as a structured DataFrame
        if results.get("decisions_raw") and "decisions" in results["decisions_raw"]:
            df_decisions = pd.DataFrame(results["decisions_raw"]["decisions"])
            if not df_decisions.empty:
                st.dataframe(df_decisions, use_container_width=True, hide_index=True)
            else:
                st.write("No key decisions identified.")
        else:
            st.write(results['decisions'])
        
        st.divider()
        st.header("Follow-up Email")
        st.text_area("Copy your email draft:", results['email_draft'], height=200)
        
        st.divider()
        with st.expander("Show Full Transcript"):
            st.text(st.session_state['transcript'])
            
        # Exports
        st.header("Export Reports")
        col1, col2 = st.columns(2)
        with col1:
            try:
                docx_path = export_docx(results, filename="MeetSync_GenAI_Report.docx")
                with open(docx_path, "rb") as d:
                    st.download_button("Download DOCX", d, file_name="MeetSync_GenAI_Report.docx")
            except Exception as e:
                st.warning(f"Could not generate DOCX: {e}")
                
        with col2:
            try:
                pdf_path = export_pdf(results, filename="MeetSync_GenAI_Report.pdf")
                with open(pdf_path, "rb") as p:
                    st.download_button("Download PDF", p, file_name="MeetSync_GenAI_Report.pdf")
            except Exception as e:
                st.warning(f"Could not generate PDF: {e}")
    else:
        st.info("Upload an audio file or paste a transcript in Tab 1 to see results.")

with tab3:
    if st.session_state['vectorstore']:
        st.header("Semantic File Search - Talk with your Meeting")
        st.markdown("Ask anything about what was discussed, answered accurately via FAISS-guided retrieval.")
        
        # Display chat history
        for message in st.session_state['chat_history']:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
                
        # Chat input
        if prompt := st.chat_input("E.g., What did we decide regarding the Q3 budget?"):
            st.session_state['chat_history'].append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)
                
            with st.chat_message("assistant"):
                response_stream = ask_meeting_stream(st.session_state['vectorstore'], prompt)
                answer = st.write_stream(response_stream)
            st.session_state['chat_history'].append({"role": "assistant", "content": answer})
            
        # Export Chat History
        if st.session_state['chat_history']:
            st.divider()
            chat_text = "MeetSync Chat History\n\n"
            for msg in st.session_state['chat_history']:
                role_name = "You" if msg['role'] == 'user' else "AI"
                chat_text += f"{role_name}: {msg['content']}\n\n"
            st.download_button("Export Chat History", data=chat_text, file_name="MeetSync_Chat_History.txt")
    else:
        st.info("Please process a meeting first to activate the Q&A agent.")
