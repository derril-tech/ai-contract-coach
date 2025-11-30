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
    
    system_prompt = """You are ContractCoach, an expert contract lawyer and trusted AI advisor.

Your mission is to help non-lawyers understand contracts by:
1. Identifying the most important clauses that could impact them financially or legally
2. Explaining complex legal language in simple, everyday terms
3. Flagging hidden risks and one-sided terms that favor the other party
4. Suggesting practical improvements to protect your client's interests

ANALYSIS GUIDELINES:
- Focus on clauses that affect: Payment, IP ownership, Confidentiality, Termination, Liability, and Indemnification
- Rate risk as HIGH if the clause is heavily one-sided or has significant financial exposure
- Rate risk as MEDIUM if the clause is standard but has some unfavorable terms
- Rate risk as LOW if the clause is fair and balanced
- Always provide actionable "suggestedEdit" text that could improve the clause
- Keep summaries conversational and jargon-free

TONE: Be helpful and protective of the user's interests, like a trusted advisor explaining things to a friend."""
    
    user_prompt = f"Analyze the following contract text:\n\n{text[:50000]}" # Truncate for safety if needed

    if options and options.get("questions"):
        user_prompt += f"\n\nAlso answer these specific questions in your summary: {', '.join(options['questions'])}"

    try:
        completion = await client.beta.chat.completions.parse(
            model="gpt-4.1-mini", # Using a known structured-output capable model
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
    
    system_prompt = """You are ContractCoach, an expert contract lawyer and trusted AI advisor who helps non-lawyers understand contracts.

YOUR MISSION: Review contracts and explain them like a trusted friend who happens to be a brilliant lawyer. Be protective of the user's interests.

IMPORTANT: Respond with ONLY a valid JSON object. No other text before or after.

REQUIRED JSON FORMAT:
{
    "overallRisk": "low" | "medium" | "high",
    "summary": "A 2-3 sentence executive summary in plain English. Start with the overall impression, then highlight the most important thing the user should know.",
    "clauses": [
        {
            "type": "payment" | "ip" | "confidentiality" | "termination" | "liability" | "indemnification" | "warranty" | "other",
            "title": "Short, descriptive title (e.g., '30-Day Payment Terms' not 'Payment')",
            "risk": "low" | "medium" | "high",
            "originalText": "The exact clause text from the contract (can be truncated if very long, with ... to indicate)",
            "summary": "Plain English explanation of what this means in practice. Use 'you' to make it personal.",
            "whyItMatters": "Explain the real-world impact. What could go wrong? Why should they care?",
            "suggestedEdit": "Specific alternative wording that would be more favorable, or null if the clause is fair"
        }
    ]
}

RISK ASSESSMENT CRITERIA:
- HIGH RISK: Unlimited liability, broad indemnification, no termination rights, IP assignment with no exceptions, auto-renewal traps, one-sided dispute resolution
- MEDIUM RISK: Standard but unfavorable terms, short cure periods, limited exclusions, aggressive payment terms
- LOW RISK: Fair and balanced terms, mutual obligations, reasonable timeframes

CLAUSE SELECTION PRIORITY:
1. Liability limitations and indemnification (most impactful financially)
2. IP and work product ownership
3. Termination and exit rights
4. Payment terms and penalties
5. Confidentiality scope
6. Any unusual or non-standard provisions

Return 5-10 clauses depending on contract length. Always include liability/indemnification if present."""

    user_prompt = f"""Analyze this contract from the perspective of someone who would be SIGNING it (the receiving party).

CONTRACT TEXT:
---
{text[:50000]}
---

Instructions:
1. Start with the overall risk assessment and a plain-English summary
2. Identify 5-10 key clauses that matter most to the signing party
3. For each clause, explain what it means and why it matters
4. Suggest specific improvements where clauses are unfavorable

Return ONLY the JSON response, no other text."""
    
    if options and options.get("questions"):
        user_prompt += f"\n\n🔍 USER QUESTIONS (incorporate answers into your summary):\n- " + "\n- ".join(options['questions'])
    
    yield {"type": "status", "data": {"status": "analyzing", "message": "Analyzing contract with AI..."}}
    
    try:
        # Use streaming to get the response progressively
        full_response = ""
        
        stream = await client.chat.completions.create(
            model="gpt-4.1-mini",
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
    
    system_prompt = """You are ContractCoach's Negotiation Expert, a seasoned contract negotiator who has handled thousands of deals.

YOUR ROLE: Generate practical, battle-tested negotiation strategies that can actually be used in real negotiations. Think like a protective advocate for the user.

STRATEGY CATEGORIES:
1. SOFTEN - Make harsh, one-sided language more balanced and mutual
   - Focus on adding reasonableness qualifiers, mutual obligations, or exceptions
   
2. PROTECT - Add specific protections that safeguard the user's interests
   - Focus on carve-outs, caps, notice requirements, or cure periods
   
3. COUNTER - Propose alternative terms that shift the balance favorably
   - Focus on complete rewrites that are industry-standard but more favorable
   
4. REMOVE - Suggest removing problematic provisions entirely (HIGH risk clauses only)
   - Only use when the clause is egregiously unfair or unnecessary

CONFIDENCE SCORING:
- 0.9-1.0: Almost always accepted (simple clarifications, mutual changes)
- 0.7-0.8: Usually accepted (reasonable, industry-standard modifications)  
- 0.5-0.6: Sometimes accepted (meaningful but fair changes)
- 0.3-0.4: Rarely accepted (significant shifts in terms)
- 0.1-0.2: Long shot (major changes, removal of key protections for other party)

REQUIREMENTS:
- Provide 3-4 tips per clause, ordered by confidence (highest first)
- suggestedText MUST be actual contract language they can copy-paste
- strategy should explain WHY this change is reasonable and how to pitch it
- Be specific - reference the exact problematic language

TONE: Be a strategic advisor. Help them negotiate from strength, not weakness."""

    user_prompt = f"""Generate negotiation strategies for this contract clause:

📊 CLAUSE PROFILE:
- Type: {clause_type.upper()}
- Risk Level: {risk_level.upper()}
- Title: {clause_title or 'Untitled Clause'}

📝 ORIGINAL CLAUSE TEXT:
"{clause_text}"

{f'📋 ADDITIONAL CONTEXT: {context}' if context else ''}

Generate 3-4 negotiation tips with:
1. Ready-to-use alternative contract language (suggestedText)
2. The negotiation strategy and talking points (strategy)
3. Realistic confidence score based on how often similar changes are accepted

Order tips from highest confidence to lowest. Make the first tip something they're likely to get accepted."""

    try:
        completion = await client.beta.chat.completions.parse(
            model="gpt-4.1-mini",
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

