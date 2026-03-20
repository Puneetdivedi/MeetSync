# MeetSync

MeetSync is an AI-powered meeting intelligence web application. Upload a meeting audio recording or paste a transcript, and the application produces a complete, structured output within 60 seconds — including an executive summary, action items, key decisions, and a drafted follow-up email.

## Features

- **Local Audio Transcription**: Powered by OpenAI's Whisper model.
- **Speaker Diarization**: Identifies who said what using `pyannote.audio`.
- **AI Intelligence**: Summarization, action items, and email drafting powered by Groq and the Llama-3 model.
- **Export**: Download results straight to DOCX and PDF.
- **Web UI**: Easy-to-use interface built with Streamlit.

## Setup Instructions

1. Clone or download the repository.
2. Ensure you have Python 3.9+ installed and `ffmpeg` installed on your system.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the `.env.example` to `.env` and fill out your keys:
   - `GROQ_API_KEY`: Get one from [Groq Console](https://console.groq.com/).
   - `HF_TOKEN`: Get one from [Hugging Face](https://huggingface.co/) for pyannote.
5. Run the app:
   ```bash
   streamlit run app.py
   ```

## Note

Ensure `ffmpeg` is installed correctly for Whisper to be able to extract audio.
