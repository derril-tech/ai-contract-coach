import os
import json
import logging
import uuid
from typing import Dict, Any, List, Optional, AsyncGenerator
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


async def analyze_contract_stream(
    text: str, 
    options: Dict[str, Any] = None
) -> AsyncGenerator[Dict[str, Any], None]:
    """
    Streams contract analysis results clause-by-clause using OpenAI.
    
    Yields events:
    - {"type": "status", "data": {"status": "starting"}}
    - {"type": "progress", "data": {"current": 1, "total": 5, "message": "..."}}
    - {"type": "clause", "data": {clause_object}}
    - {"type": "summary", "data": {"overallRisk": "...", "summary": "..."}}
    - {"type": "complete", "data": {"status": "done"}}
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        yield {"type": "error", "data": {"error": "Missing OpenAI API Key"}}
        return

    client = AsyncOpenAI(api_key=api_key)
    
    # Yield starting status
    yield {"type": "status", "data": {"status": "starting", "message": "Initializing analysis..."}}
    
    system_prompt = """You are an expert contract lawyer and AI assistant.
Your job is to review contracts, identify key clauses, assess their risk, and explain them in plain English.

IMPORTANT: You must respond with ONLY a valid JSON object, no other text.

The JSON must have this exact structure:
{
    "overallRisk": "low" | "medium" | "high",
    "summary": "Executive summary of the contract",
    "clauses": [
        {
            "type": "payment" | "ip" | "confidentiality" | "termination" | "liability" | "other",
            "title": "Short title",
            "risk": "low" | "medium" | "high",
            "originalText": "Exact text from contract",
            "summary": "Plain English explanation",
            "whyItMatters": "Why this is important",
            "suggestedEdit": "Suggested improvement or null"
        }
    ]
}

Focus on identifying clauses related to: Payment, IP, Confidentiality, Termination, and Liability.
Return 3-8 key clauses depending on the contract length."""

    user_prompt = f"Analyze this contract and return ONLY the JSON response:\n\n{text[:50000]}"
    
    if options and options.get("questions"):
        user_prompt += f"\n\nIncorporate answers to these questions in your summary: {', '.join(options['questions'])}"
    
    yield {"type": "status", "data": {"status": "analyzing", "message": "Analyzing contract with AI..."}}
    
    try:
        # Use streaming to get the response progressively
        full_response = ""
        
        stream = await client.chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            stream=True,
            temperature=0.3,  # More deterministic for structured output
        )
        
        yield {"type": "status", "data": {"status": "streaming", "message": "Receiving analysis..."}}
        
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                full_response += chunk.choices[0].delta.content
        
        # Parse the complete JSON response
        yield {"type": "status", "data": {"status": "parsing", "message": "Processing results..."}}
        
        # Clean up response (remove markdown code blocks if present)
        clean_response = full_response.strip()
        if clean_response.startswith("```json"):
            clean_response = clean_response[7:]
        if clean_response.startswith("```"):
            clean_response = clean_response[3:]
        if clean_response.endswith("```"):
            clean_response = clean_response[:-3]
        clean_response = clean_response.strip()
        
        try:
            result = json.loads(clean_response)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {e}")
            logger.error(f"Response was: {clean_response[:500]}")
            yield {"type": "error", "data": {"error": f"Failed to parse AI response: {str(e)}"}}
            return
        
        clauses = result.get("clauses", [])
        total_clauses = len(clauses)
        
        # Stream each clause with a small delay for visual effect
        for i, clause in enumerate(clauses):
            # Add unique ID if not present
            if "id" not in clause:
                clause["id"] = str(uuid.uuid4())
            
            yield {
                "type": "progress", 
                "data": {
                    "current": i + 1, 
                    "total": total_clauses,
                    "message": f"Analyzing {clause.get('title', 'clause')}..."
                }
            }
            
            yield {"type": "clause", "data": clause}
        
        # Send final summary
        yield {
            "type": "summary", 
            "data": {
                "overallRisk": result.get("overallRisk", "medium"),
                "summary": result.get("summary", "Analysis complete."),
                "totalClauses": total_clauses
            }
        }
        
        yield {"type": "complete", "data": {"status": "done"}}
        
    except Exception as e:
        logger.error(f"Streaming analysis failed: {e}")
        yield {"type": "error", "data": {"error": str(e)}}


# ============================================================================
# NEGOTIATION TIPS GENERATION
# ============================================================================

class NegotiationTip(BaseModel):
    id: str = Field(description="Unique UUID for the tip")
    category: str = Field(description="Category: soften, protect, counter, or remove")
    title: str = Field(description="Short title for the tip")
    originalText: str = Field(description="The original clause text being addressed")
    suggestedText: str = Field(description="Suggested alternative wording")
    strategy: str = Field(description="Explanation of the negotiation strategy")
    confidence: float = Field(description="Confidence score from 0.0 to 1.0")

class NegotiationTipsResponse(BaseModel):
    tips: List[NegotiationTip] = Field(description="List of negotiation tips for the clause")


async def generate_negotiation_tips(
    clause_text: str,
    clause_type: str,
    risk_level: str,
    clause_title: str = "",
    context: str = ""
) -> Dict[str, Any]:
    """
    Generates smart negotiation tips for a specific clause using OpenAI.
    
    Args:
        clause_text: The original clause text
        clause_type: Type of clause (payment, ip, confidentiality, termination, liability)
        risk_level: Risk level (low, medium, high)
        clause_title: Optional title of the clause
        context: Optional additional context
    
    Returns:
        Dictionary with 'tips' array containing negotiation suggestions
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.warning("OPENAI_API_KEY not found. Returning empty tips.")
        return {"tips": [], "error": "Missing OpenAI API Key"}

    client = AsyncOpenAI(api_key=api_key)
    
    system_prompt = """You are an expert contract negotiation advisor. Your role is to provide 
actionable negotiation tips to help the user improve their position in contract negotiations.

For each clause, generate 2-4 specific negotiation tips that:
1. SOFTEN - Make harsh language more balanced
2. PROTECT - Add protections for the reviewing party
3. COUNTER - Propose alternative terms that are more favorable
4. REMOVE - Suggest removing problematic provisions entirely (only for high-risk clauses)

Each tip should include:
- A clear category (soften, protect, counter, remove)
- A descriptive title
- The exact suggested alternative wording
- A brief strategy explanation
- A confidence score (0.0-1.0) based on how likely the change would be accepted

Be specific and practical. Provide actual language, not just concepts."""

    user_prompt = f"""Generate negotiation tips for this {risk_level.upper()} RISK {clause_type.upper()} clause:

Clause Title: {clause_title or 'N/A'}
Original Text:
"{clause_text}"

{f'Additional Context: {context}' if context else ''}

Provide 2-4 specific, actionable tips with alternative wording."""

    try:
        completion = await client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format=NegotiationTipsResponse,
        )
        
        result = completion.choices[0].message.parsed
        
        if result:
            tips_data = result.model_dump()
            # Ensure each tip has an ID
            for tip in tips_data.get("tips", []):
                if not tip.get("id"):
                    tip["id"] = str(uuid.uuid4())
            return tips_data
        else:
            return {"tips": [], "error": "No tips generated"}
            
    except Exception as e:
        logger.error(f"Failed to generate negotiation tips: {e}")
        return {"tips": [], "error": str(e)}

