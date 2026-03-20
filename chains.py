import os
from typing import List, Optional
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field
from config import GROQ_API_KEY

def get_llm():
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")
    # Use Llama-3-70b for better structured output and reasoning
    return ChatGroq(temperature=0, groq_api_key=GROQ_API_KEY, model_name="llama3-70b-8192")

def load_prompt(filename):
    with open(os.path.join("prompts", filename), "r", encoding="utf-8") as f:
        return f.read()

# --- Pydantic Models for Structured Output ---

class ActionItem(BaseModel):
    task: str = Field(description="The specific action to be taken")
    assignee: str = Field(description="The person responsible for the action. Use 'Unassigned' if not specified.")
    deadline: Optional[str] = Field(description="The deadline for the task, if mentioned. Otherwise null.")

class ActionItemList(BaseModel):
    items: List[ActionItem] = Field(description="List of action items extracted from the meeting")

class Decision(BaseModel):
    decision: str = Field(description="A clear and concise description of the decision made")
    context: Optional[str] = Field(description="Brief context or reason for the decision, if applicable.")

class DecisionList(BaseModel):
    decisions: List[Decision] = Field(description="List of key decisions made during the meeting")

# --- LCEL Chains ---

def build_chains():
    llm = get_llm()
    
    # 1. Summary Chain (Plain Text)
    summary_prompt = PromptTemplate.from_template(load_prompt("summary.txt"))
    summary_chain = summary_prompt | llm | (lambda x: x.content)
    
    # 2. Action Items Chain (Structured Output)
    action_prompt = PromptTemplate.from_template(load_prompt("action_items.txt"))
    action_llm = llm.with_structured_output(ActionItemList)
    action_chain = action_prompt | action_llm
    
    # 3. Decisions Chain (Structured Output)
    decision_prompt = PromptTemplate.from_template(load_prompt("decisions.txt"))
    decision_llm = llm.with_structured_output(DecisionList)
    decision_chain = decision_prompt | decision_llm
    
    # 4. Email Draft Chain (Plain Text)
    email_prompt = PromptTemplate.from_template(load_prompt("email_draft.txt"))
    email_chain = email_prompt | llm | (lambda x: x.content)
    
    # Combine into a single parallel runnable
    parallel_chain = RunnableParallel(
        summary=summary_chain,
        action_items=action_chain,
        decisions=decision_chain,
        email_draft=email_chain
    )
    
    return parallel_chain

def process_meeting(transcript: str):
    """
    Runs all extraction chains concurrently using LCEL RunnableParallel.
    Significantly reduces processing time and enforces structured JSON outputs.
    """
    print("Initiating parallel AI processing (Summary, Actions, Decisions, Email)...")
    parallel_chain = build_chains()
    
    # Run all tasks concurrently
    results = parallel_chain.invoke({"transcript": transcript})
    
    # Format the structured Pydantic outputs back into Markdown/List formats for easy saving/viewing
    # Alternatively, the app.py can consume the raw objects, but stringifying here keeps exporter.py working.
    
    # Format Action Items
    action_str = ""
    for idx, item in enumerate(results["action_items"].items, 1):
        deadline_str = f" (Due: {item.deadline})" if item.deadline else ""
        action_str += f"{idx}. **{item.assignee}**: {item.task}{deadline_str}\n"
    if not action_str:
        action_str = "No action items identified."
        
    # Format Decisions
    decision_str = ""
    for idx, d in enumerate(results["decisions"].decisions, 1):
        ctx_str = f" - *Context: {d.context}*" if d.context else ""
        decision_str += f"{idx}. {d.decision}{ctx_str}\n"
    if not decision_str:
        decision_str = "No key decisions identified."
    
    return {
        "summary": results["summary"],
        "action_items": action_str,
        "action_items_raw": results["action_items"].model_dump(), # Pass raw data for UI tables
        "decisions": decision_str,
        "decisions_raw": results["decisions"].model_dump(), # Pass raw data for UI tables
        "email_draft": results["email_draft"],
        "transcript": transcript
    }

# --- Conversational RAG ---

def setup_rag(transcript: str):
    """
    Initializes a lightweight local FAISS vector store with HuggingFace embeddings
    so users can talk to their transcript.
    """
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from langchain_community.vectorstores import FAISS
    from langchain_community.embeddings import HuggingFaceEmbeddings
    from langchain_core.documents import Document

    print("Setting up Vector Store for RAG...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents([Document(page_content=transcript)])
    
    # Using a fast, local embedding model
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(splits, embeddings)
    return vectorstore

def ask_meeting(vectorstore, question: str):
    """
    Queries the vectorstore representing the meeting.
    """
    from langchain_core.runnables import RunnablePassthrough
    from langchain_core.output_parsers import StrOutputParser
    
    llm = get_llm()
    retriever = vectorstore.as_retriever()
    
    template = """You are a helpful AI assistant that answers questions based ONLY on the following meeting transcript excerpts.
    If the context does not provide the answer, say "I cannot find the answer to that in the meeting transcript."
    Do not hallucinate external information.
    
    Context:
    {context}
    
    Question: {question}
    
    Answer:"""
    
    custom_rag_prompt = PromptTemplate.from_template(template)
    
    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | custom_rag_prompt
        | llm
        | StrOutputParser()
    )
    
    return rag_chain.invoke(question)
