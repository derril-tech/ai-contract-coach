import os
import json
import logging
from typing import Dict, Any, List, Optional
from openai import AsyncOpenAI
from pydantic import BaseModel, Field

# Configure logger
logger = logging.getLogger("openai_adapter")
logger.setLevel(logging.INFO)

class Clause(BaseModel):
    id: str = Field(description="Unique UUID for the clause")
    type: str = Field(description="Type of the clause (payment, ip, confidentiality, termination, liability, other)")
    title: str = Field(description="Short title for the clause")
    risk: str = Field(description="Risk level: low, medium, or high")
    originalText: str = Field(description="The exact text extracted from the contract")
    summary: str = Field(description="Plain English summary of what this clause means")
    whyItMatters: str = Field(description="Explanation of why this clause is important or risky")
    suggestedEdit: Optional[str] = Field(description="Suggested edit to mitigate risk, if applicable")

class ContractAnalysis(BaseModel):
    overallRisk: str = Field(description="Overall contract risk: low, medium, or high")
    summary: str = Field(description="Executive summary of the contract")
    clauses: List[Clause] = Field(description="List of extracted key clauses")

async def analyze_contract(text: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Analyzes a contract text using OpenAI to extract clauses and assess risk.
    Returns a dictionary matching the ContractAnalysis schema.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.warning("OPENAI_API_KEY not found. Returning stubbed error.")
        return {"error": "Missing OpenAI API Key"}

    client = AsyncOpenAI(api_key=api_key)
    
    system_prompt = (
        "You are an expert contract lawyer and AI assistant. "
        "Your job is to review contracts, identify key clauses, assess their risk, "
        "and explain them in plain English to a non-lawyer. "
        "Focus on: Payment, IP, Confidentiality, Termination, and Liability."
    )
    
    user_prompt = f"Analyze the following contract text:\n\n{text[:50000]}" # Truncate for safety if needed

    if options and options.get("questions"):
        user_prompt += f"\n\nAlso answer these specific questions in your summary: {', '.join(options['questions'])}"

    try:
        completion = await client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06", # Using a known structured-output capable model
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format=ContractAnalysis,
        )
        
        result = completion.choices[0].message.parsed
        return result.model_dump()
        
    except Exception as e:
        logger.error(f"OpenAI analysis failed: {e}")
        raise e

