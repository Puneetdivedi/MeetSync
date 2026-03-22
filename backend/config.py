import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
HF_TOKEN = os.getenv("HF_TOKEN")

if not GROQ_API_KEY:
    print("Warning: GROQ_API_KEY is not set in .env")

if not HF_TOKEN:
    print("Warning: HF_TOKEN is not set in .env")
