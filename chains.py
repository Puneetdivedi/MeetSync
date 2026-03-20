import os
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from config import GROQ_API_KEY

def get_llm():
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")
    return ChatGroq(temperature=0, groq_api_key=GROQ_API_KEY, model_name="llama3-8b-8192")

def load_prompt(filename):
    with open(os.path.join("prompts", filename), "r", encoding="utf-8") as f:
        return f.read()

def generate_summary(transcript):
    prompt_text = load_prompt("summary.txt")
    prompt = PromptTemplate.from_template(prompt_text)
    chain = prompt | get_llm()
    result = chain.invoke({"transcript": transcript})
    return result.content

def extract_action_items(transcript):
    prompt_text = load_prompt("action_items.txt")
    prompt = PromptTemplate.from_template(prompt_text)
    chain = prompt | get_llm()
    result = chain.invoke({"transcript": transcript})
    return result.content

def extract_decisions(transcript):
    prompt_text = load_prompt("decisions.txt")
    prompt = PromptTemplate.from_template(prompt_text)
    chain = prompt | get_llm()
    result = chain.invoke({"transcript": transcript})
    return result.content

def draft_email(transcript):
    prompt_text = load_prompt("email_draft.txt")
    prompt = PromptTemplate.from_template(prompt_text)
    chain = prompt | get_llm()
    result = chain.invoke({"transcript": transcript})
    return result.content

def process_meeting(transcript):
    \"\"\"
    Runs all chains sequentially and returns a dictionary of results.
    For production, this could be parallelized using asyncio.gather or LCEL runnables.
    \"\"\"
    print("Generating Summary...")
    summary = generate_summary(transcript)
    
    print("Extracting Action Items...")
    actions = extract_action_items(transcript)
    
    print("Extracting Key Decisions...")
    decisions = extract_decisions(transcript)
    
    print("Drafting Follow-up Email...")
    email = draft_email(transcript)
    
    return {
        "summary": summary,
        "action_items": actions,
        "decisions": decisions,
        "email_draft": email,
        "transcript": transcript
    }
