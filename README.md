<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/3254/3254068.png" width="80" alt="MeetSync Logo">
  <h1>MeetSync Enterprise</h1>
  <p><strong>Industry-grade AI Meeting Intelligence & Operational Dashboard</strong></p>
  
  [![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://meetsync.streamlit.app/)
  [![Built with LangChain](https://img.shields.io/badge/Built_with-LangChain-blue.svg)](https://langchain.com/)
  [![Powered by Groq](https://img.shields.io/badge/Powered_by-Groq_LPU-f55036.svg)](https://groq.com/)
</div>

---

MeetSync is an enterprise-ready Generative AI web application designed to automatically ingest operational meetings and compute structural intelligence. With **MeetSync Enterprise**, you can upload your meeting audio and instantly receive perfectly formatted Action Items, Key Decisions, Executive Summaries, and Follow-up Emails. 

## ✨ Key Features
- **Local Neural Transcription**: Hardened audio transcription powered by OpenAI's Whisper model.
- **Architectural Concurrency**: Uses LangChain Expression Language (`LCEL`) `RunnableParallel` to compute summaries, action items, and emails simultaneously mapping to Groq's Llama-3 70B for near-instant execution.
- **Deterministic Pydantic Guarantees**: Extracts structured JSON data safely using `tenacity` retries and strict Pydantic parsing.
- **Conversational Memory (RAG)**: Chat with your meeting dynamically! MeetSync uses `faiss-cpu` and `sentence-transformers` to build on-the-fly local vector indices of your transcript.
- **Premium Mission Control UI**: Glassmorphism CSS, realtime streaming output, dynamic KPI metrics, and one-click DOCX/PDF Enterprise formatting.

---

## 🚀 Live Deployment Instructions (Streamlit Community Cloud)

This repository is pre-configured to be deployed natively on [Streamlit Community Cloud](https://share.streamlit.io/) with zero changes required.

1. **Fork or Push** this repository to your own public or private GitHub account.
2. Go to **[Streamlit Community Cloud](https://share.streamlit.io/)** and click **New App**.
3. Point Streamlit to this repository and select `app.py` as the entry point.
4. **Critical**: Before hitting "Deploy", click on **Advanced Settings** and add your Secrets.

### Required Secrets
Add the following to the **Secrets** block in Streamlit:
```toml
GROQ_API_KEY = "gsk_your_groq_api_key_here"
HF_TOKEN = "hf_your_hugging_face_token_here" 
```
*(The Hugging Face token is only required if you toggle the Speaker Diarization feature in the UI).*

5. Hit **Deploy**. 
Streamlit will automatically detect the `packages.txt` file and install the `ffmpeg` system dependency required for audio processing, followed by `requirements.txt`.

---

## 💻 Local Developer Setup

If you prefer to run the mission control dashboard locally:

1. Clone the repository.
2. Make sure you have **Python 3.9+** and install system dependencies (like `ffmpeg` via homebrew or choco).
3. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and fill in your API keys.
5. Launch the dashboard:
   ```bash
   streamlit run app.py
   ```
