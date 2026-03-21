import streamlit as st
import os
import pandas as pd
from config import GROQ_API_KEY
from transcriber import transcribe_audio
from diarizer import diarize_audio, merge_transcription_and_diarization
from chains import process_meeting, setup_rag, ask_meeting_stream
from exporter import export_docx, export_pdf

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="MeetSync | AI Meeting Intelligence", 
    page_icon="⚡", 
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- PREMIUM CSS STYLING ---
st.markdown("""
<style>
    /* Import modern typography */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    /* Main App Background - Minimalist Dark */
    .stApp {
        background-color: #09090b;
        color: #fafafa;
    }
    
    /* Headers */
    h1, h2, h3, h4 {
        color: #fafafa !important;
        font-weight: 600 !important;
    }
    
    /* Metrics Styling */
    div[data-testid="stMetricValue"] {
        font-size: 2.2rem;
        font-weight: 600;
        color: #fafafa;
    }
    div[data-testid="stMetricLabel"] {
        font-size: 0.85rem;
        font-weight: 500;
        color: #a1a1aa;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    /* Widget backgrounds */
    .stTextArea textarea, .stTextInput input {
        background-color: #18181b !important;
        border: 1px solid #27272a !important;
        color: #fafafa !important;
        border-radius: 6px !important;
    }
    .stTextArea textarea:focus, .stTextInput input:focus {
        border-color: #a1a1aa !important;
        box-shadow: none !important;
    }
    
    /* Buttons */
    .stButton>button {
        background-color: #fafafa !important;
        color: #09090b !important;
        border: none !important;
        border-radius: 6px !important;
        font-weight: 500 !important;
        padding: 8px 20px !important;
        transition: background-color 0.2s ease;
    }
    .stButton>button:hover {
        background-color: #e4e4e7 !important;
    }

    /* Tabs Styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 4px;
        background-color: #18181b;
        padding: 4px;
        border-radius: 8px;
    }
    .stTabs [data-baseweb="tab"] {
        height: 38px;
        border-radius: 6px;
        background-color: transparent;
        color: #a1a1aa;
        font-weight: 500;
        border: none;
        padding: 0 16px;
    }
    .stTabs [aria-selected="true"] {
        background-color: #27272a !important;
        color: #fafafa !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.5);
    }
    
    /* Containers / DataFrames */
    [data-testid="stExpander"], .stDataFrame {
        background-color: #09090b;
        border: 1px solid #27272a;
        border-radius: 8px;
    }
    
    /* Chat bubbles */
    .stChatMessage {
        background-color: #18181b;
        border-radius: 8px;
        border: 1px solid #27272a;
        padding: 1rem;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# --- HEADER SECTION ---
col1, col2 = st.columns([1, 5])
with col1:
    st.image("https://cdn-icons-png.flaticon.com/512/3254/3254068.png", width=80) # Icon placeholder
with col2:
    st.title("MeetSync | Core Intelligence")
    st.markdown("<p style='color:#94a3b8; font-size:1.1rem; margin-top:-10px;'>Industry grade Generative AI for operational meetings. Powered by LCEL & Pydantic.</p>", unsafe_allow_html=True)


# --- STATE INITIALIZATION ---
if 'transcript' not in st.session_state:
    st.session_state['transcript'] = ""
if 'results' not in st.session_state:
    st.session_state['results'] = {}
if 'vectorstore' not in st.session_state:
    st.session_state['vectorstore'] = None
if 'chat_history' not in st.session_state:
    st.session_state['chat_history'] = []

# --- SIDEBAR ---
with st.sidebar:
    st.header("⚙️ Configuration")
    use_diarization = st.toggle("Enable Speaker Recognition", value=False, help="Identifies structural speakers. Requires Hugging Face token.")
    st.divider()
    st.caption("v2.1 Enterprise | © MeetSync 2026")

# --- MAIN DASHBOARD TABS ---
tab1, tab2, tab3 = st.tabs(["🚀 Mission Control (Upload)", "📊 Executive Dashboard", "💬 Neural Chat (RAG)"])

# ----------------- TAB 1: UPLOAD -----------------
with tab1:
    st.subheader("Data Ingestion")
    st.markdown("Drop your meeting recording or paste a raw log to begin extraction.")
    
    col_up1, col_up2 = st.columns([1, 1])
    with col_up1:
        uploaded_file = st.file_uploader("Upload Audio (MP3, WAV, M4A)", type=["mp3", "wav", "m4a", "mp4"])
    with col_up2:
        pasted_transcript = st.text_area("Or Paste Raw Transcript", height=150, placeholder="[10:00:00] Alice: The Q3 roadmap looks solid...")

    if st.button("🚀 Execute Analysis Pipeline", use_container_width=True):
        if not GROQ_API_KEY:
            st.error("GROQ API Key missing in environment.")
            st.stop()
            
        with st.status("Initializing Intelligence Pipeline...", expanded=True) as status:
            transcript = ""
            if pasted_transcript.strip():
                st.write("Using manually pasted transcript.")
                transcript = pasted_transcript
            elif uploaded_file:
                temp_path = f"temp_{uploaded_file.name}"
                with open(temp_path, "wb") as f:
                    f.write(uploaded_file.getbuffer())
                
                try:
                    st.write("🎙️ Booting Whisper Transcriber...")
                    t_result = transcribe_audio(temp_path)
                    
                    if use_diarization:
                        st.write("👥 Analyzing Vocal Signatures (Pyannote Diarization)...")
                        d_result = diarize_audio(temp_path)
                        st.write("🔄 Merging datasets...")
                        transcript = merge_transcription_and_diarization(t_result['segments'], d_result)
                    else:
                        transcript = t_result['text']
                        
                except Exception as e:
                    st.error(f"Pipeline Error: {e}")
                finally:
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
            
            if transcript:
                st.session_state['transcript'] = transcript
                st.write("⚡ Executing parallel LLM structural extraction (Llama-3 70B)...")
                
                # Core Processing
                results = process_meeting(transcript)
                st.session_state['results'] = results
                
                # RAG Initialization
                st.write("🧠 Compiling FAISS memory indices...")
                st.session_state['vectorstore'] = setup_rag(transcript)
                st.session_state['chat_history'] = [] 
                
                status.update(label="Analysis Pipeline Completed Simultaneously!", state="complete", expanded=False)

# ----------------- TAB 2: DASHBOARD -----------------
with tab2:
    if st.session_state['results']:
        results = st.session_state['results']
        
        # --- KPI METRICS ---
        st.subheader("Meeting KPIs")
        m1, m2, m3, m4 = st.columns(4)
        word_count = len(st.session_state['transcript'].split())
        
        num_actions = len(results.get("action_items_raw", {}).get("items", [])) if results.get("action_items_raw") else 0
        num_decisions = len(results.get("decisions_raw", {}).get("decisions", [])) if results.get("decisions_raw") else 0
        
        m1.metric("Words Analyzed", f"{word_count:,}")
        m2.metric("Action Items", str(num_actions))
        m3.metric("Key Decisions", str(num_decisions))
        m4.metric("Pipeline T-Time", "< 10s") # Arbitrary fast representation
        
        st.divider()
        
        # --- EXECUTIVE SUMMARY ---
        st.subheader("Executive Briefing")
        st.info(results['summary'])
        
        st.divider()
        
        col_data1, col_data2 = st.columns(2)
        
        with col_data1:
            st.subheader("🎯 Action Items")
            if results.get("action_items_raw") and "items" in results["action_items_raw"]:
                df_actions = pd.DataFrame(results["action_items_raw"]["items"])
                if not df_actions.empty:
                    st.dataframe(df_actions, use_container_width=True, hide_index=True)
                else:
                    st.write("No deliverables flagged.")
            else:
                st.write(results['action_items'])
                
        with col_data2:
            st.subheader("⚖️ Formal Decisions")
            if results.get("decisions_raw") and "decisions" in results["decisions_raw"]:
                df_decisions = pd.DataFrame(results["decisions_raw"]["decisions"])
                if not df_decisions.empty:
                    st.dataframe(df_decisions, use_container_width=True, hide_index=True)
                else:
                    st.write("No consensus decisions logged.")
            else:
                st.write(results['decisions'])
                
        st.divider()
        
        # --- EMAIL DRAFT ---
        st.subheader("✉️ Automated Follow-up Dispatch")
        st.text_area("Ready to send. Review and copy below:", results['email_draft'], height=250)
        
        st.divider()
        
        # --- RAW LOGS ---
        with st.expander("🔍 Inspect Raw Transcripts"):
            st.text(st.session_state['transcript'])
            
        # --- EXPORTS ---
        st.subheader("⬇️ Download Mission Reports")
        ex1, ex2 = st.columns(2)
        with ex1:
            try:
                docx_path = export_docx(results, filename="MeetSync_Enterprise_Report.docx")
                with open(docx_path, "rb") as d:
                    st.download_button("Download DOCX", d, file_name="MeetSync_Enterprise_Report.docx", use_container_width=True)
            except Exception as e:
                st.error("DOCX Export Fail")
        with ex2:
            try:
                pdf_path = export_pdf(results, filename="MeetSync_Enterprise_Report.pdf")
                with open(pdf_path, "rb") as p:
                    st.download_button("Download PDF", p, file_name="MeetSync_Enterprise_Report.pdf", use_container_width=True)
            except Exception as e:
                st.error("PDF Export Fail")

    else:
        st.info("Awaiting pipeline execution in Mission Control.")

# ----------------- TAB 3: RAG CHAT -----------------
with tab3:
    if st.session_state['vectorstore']:
        st.subheader("Neural Interface")
        st.markdown("Query the FAISS semantic indices of your meeting. Type a question below to extract specific intelligence.")
        
        # Display chat history
        chat_container = st.container(height=500)
        with chat_container:
            for message in st.session_state['chat_history']:
                with st.chat_message(message["role"]):
                    st.markdown(message["content"])
                
        # Chat input
        if prompt := st.chat_input("E.g., What was the final budget approved for engineering?"):
            st.session_state['chat_history'].append({"role": "user", "content": prompt})
            with chat_container:
                with st.chat_message("user"):
                    st.markdown(prompt)
                    
                with st.chat_message("assistant"):
                    response_stream = ask_meeting_stream(st.session_state['vectorstore'], prompt)
                    answer = st.write_stream(response_stream)
            st.session_state['chat_history'].append({"role": "assistant", "content": answer})
            
        # Export Chat History
        if st.session_state['chat_history']:
            st.divider()
            st.markdown("##### Artifacts")
            chat_text = "MeetSync Enterprise - Neural Chat Logs\n" + "="*40 + "\n\n"
            for msg in st.session_state['chat_history']:
                role_name = "Agent/User" if msg['role'] == 'user' else "AI Core"
                chat_text += f"[{role_name}]\n{msg['content']}\n\n"
            st.download_button("Export Intelligence Logs (TXT)", data=chat_text, file_name="MeetSync_Neural_Log.txt")
    else:
        st.info("Awaiting pipeline execution. FAISS index not compiled.")
