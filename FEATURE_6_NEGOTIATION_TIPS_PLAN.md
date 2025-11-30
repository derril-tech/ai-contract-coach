# Feature #6: Smart Negotiation Tips - Implementation Plan

> **Status:** 🔜 Ready to Implement  
> **Created:** 2025-11-30  
> **Baseline:** v1.3.0

---

## 📋 Feature Overview

**What:** AI-powered negotiation suggestions for each clause, providing:
- Specific language to counter risky clauses
- Negotiation strategies based on clause type
- Alternative clause wording suggestions
- Risk mitigation recommendations
- One-click copy for negotiation language

**Why Jaw-Dropping:**
- Shows OpenAI's contextual understanding
- Provides actionable, immediate value
- Transforms analysis into negotiation tool
- Professional-quality suggestions
- Showcases AI agent capabilities

---

## ❶ Frontend Changes

### New Components
- `negotiation-tips.tsx` - Main tips panel with AI suggestions
- `negotiation-tip-card.tsx` - Individual tip card with copy/apply actions

### UI/UX Features
1. **Tips Panel:**
   - Appears when clause is selected
   - Animated entrance
   - Categorized tips (Soften Language, Add Protection, Counter Offer)
   
2. **Tip Cards:**
   - Original vs Suggested comparison
   - One-click copy
   - Strategy explanation
   - Confidence indicator

3. **Generate Button:**
   - "Generate Tips" action button
   - Loading state with typing animation
   - Streaming tips display

---

## ❷ Backend Changes

### New Endpoint
```
POST /negotiate/tips
Body: { clauseId, clauseText, clauseType, riskLevel, context }
Response: { tips: [...] }
```

### OpenAI Integration
- Use GPT-4 for high-quality negotiation advice
- Structured output for consistent tip format
- Context-aware suggestions based on:
  - Clause type (payment, IP, liability, etc.)
  - Risk level (low, medium, high)
  - Contract context

### Tip Schema
```python
class NegotiationTip(BaseModel):
    id: str
    category: str  # "soften", "protect", "counter", "remove"
    title: str
    originalText: str
    suggestedText: str
    strategy: str
    confidence: float  # 0-1
```

---

## ❸ External Services Changes

### OpenAI
- New prompt for negotiation tips
- Uses existing OPENAI_API_KEY
- No additional configuration needed

### Redis (Optional Caching)
- Cache tips by clause hash
- TTL: 1 hour
- Key: `contractcoach:tips:{clause_hash}`

---

## ❹ Breaking Changes Prevention

### Existing Features Check
- ✅ Streaming analysis unchanged
- ✅ Risk visualization unchanged
- ✅ Highlighter unchanged
- ✅ Voice input unchanged
- ✅ Share unchanged

### Strategy
- New endpoint is additive
- Tips are optional enhancement
- Fallback to empty tips on error

---

## 🔍 Implementation Steps

### Step 1: Backend Endpoint (30 min)
1. Add `NegotiationTip` Pydantic model
2. Create `POST /negotiate/tips` endpoint
3. Add OpenAI prompt for negotiation tips
4. Test endpoint

### Step 2: Frontend Components (45 min)
1. Create `negotiation-tips.tsx`
2. Create `negotiation-tip-card.tsx`
3. Add animations and copy functionality
4. Test components

### Step 3: Integration (15 min)
1. Add tips panel to playground
2. Wire up generate button
3. Test full flow

### Step 4: Deploy (15 min)
1. Build and test
2. Commit and push
3. Verify on production

---

## ⏱️ Time Estimation

| Phase | Estimated |
|-------|-----------|
| Backend | 30 min |
| Components | 45 min |
| Integration | 15 min |
| Testing & Deploy | 15 min |
| **Total** | **~1.75 hours** |

---

## 🎨 Design Mockup (Text)

```
┌─────────────────────────────────────────────────────────────┐
│  💡 Smart Negotiation Tips                    [Generate ▶]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🛡️ ADD PROTECTION                          [Copy] │   │
│  │                                                     │   │
│  │ Original:                                           │   │
│  │ "Provider shall not be liable for any damages..."  │   │
│  │                                                     │   │
│  │ Suggested:                                          │   │
│  │ "Provider shall not be liable for any damages      │   │
│  │  except in cases of gross negligence or willful    │   │
│  │  misconduct..."                                     │   │
│  │                                                     │   │
│  │ Strategy: Adding exceptions for egregious behavior │   │
│  │ protects you from complete waiver of rights.       │   │
│  │                                                     │   │
│  │ Confidence: ████████░░ 85%                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📝 SOFTEN LANGUAGE                          [Copy] │   │
│  │ ...                                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Success Criteria

- [ ] Tips generate correctly from OpenAI
- [ ] Tips display with proper formatting
- [ ] Copy button works
- [ ] Loading state shows during generation
- [ ] Works for all clause types
- [ ] No breaking changes
- [ ] Dark/light mode compatible

---

**Ready to implement!**

