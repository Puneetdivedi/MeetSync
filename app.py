import streamlit as st
import os
from config import GROQ_API_KEY
from transcriber import transcribe_audio
from diarizer import diarize_audio, merge_transcription_and_diarization
from chains import process_meeting
from exporter import export_docx, export_pdf

st.set_page_config(page_title="MeetSync", page_icon="🎙️", layout="wide")

st.title("MeetSync 🎙️")
st.markdown("AI-powered meeting intelligence web application. Upload an audio recording and let AI transcribe, extract insights, and draft emails for you.")

# Initialize session state for transcript and results
if 'transcript' not in st.session_state:
    st.session_state['transcript'] = ""
if 'results' not in st.session_state:
    st.session_state['results'] = {}

# Sidebar settings
with st.sidebar:
    st.header("Settings")
    use_diarization = st.checkbox("Enable Speaker Diarization", help="Requires Hugging Face token.")

tab1, tab2 = st.tabs(["Upload & Process", "Results"])

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
                    with st.status("Transcribing audio..."):
                        t_result = transcribe_audio(temp_path)
                    
                    if use_diarization:
                        with st.status("Performing speaker diarization..."):
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
                with st.status("Generating insights with Llama-3..."):
                    results = process_meeting(transcript)
                    st.session_state['results'] = results
                st.success("Analysis complete!")

with tab2:
    if st.session_state['results']:
        results = st.session_state['results']
        
        st.header("Executive Summary")
        st.write(results['summary'])
        
        st.divider()
        st.header("Action Items")
        st.write(results['action_items'])
        
        st.divider()
        st.header("Key Decisions")
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
                docx_path = export_docx(results)
                with open(docx_path, "rb") as d:
                    st.download_button("Download DOCX", d, file_name="MeetSync_Report.docx")
            except Exception as e:
                st.warning(f"Could not generate DOCX: {e}")
                
        with col2:
            try:
                pdf_path = export_pdf(results)
                with open(pdf_path, "rb") as p:
                    st.download_button("Download PDF", p, file_name="MeetSync_Report.pdf")
            except Exception as e:
                st.warning(f"Could not generate PDF: {e}")
    else:
        st.info("Upload an audio file or paste a transcript to see results.")
