# Production Testing Guide - ContractCoach

> **Version:** v1.5.0  
> **Last Updated:** 2025-11-30  
> **Total Features:** 12

---

## 🎯 Testing Overview

This guide provides step-by-step instructions to test all 12 features in production. Each feature includes:
- **How to Test** - Step-by-step instructions
- **What to Watch For** - Success criteria
- **Common Issues** - Potential problems and solutions

---

## 🔗 Production URLs

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | `https://your-vercel-url.vercel.app` |
| **Frontend (Railway)** | `https://web-contract-coach-production.up.railway.app` |
| **Backend (Railway)** | `https://api-contract-coach-production.up.railway.app` |

---

## 📋 Pre-Testing Checklist

Before testing, verify:

- [ ] Both Railway services are deployed and running (green status)
- [ ] Vercel deployment is complete (if using Vercel)
- [ ] Environment variables are set correctly on all platforms
- [ ] Browser console is open (F12) to monitor errors
- [ ] Network tab is open to monitor API calls

---

## 🧪 Feature Testing

### Feature #1: Real-time Streaming Analysis

**Location:** Playground page → Run Analysis

**How to Test:**
1. Navigate to `/playground`
2. Click "Demo" to load sample contract OR paste your own text
3. Click "Run Analysis" button
4. Watch the progress indicator and streaming clauses

**What to Watch For:**
- ✅ Progress bar appears and animates
- ✅ Status messages update (Starting → Analyzing → Complete)
- ✅ Clauses appear one-by-one with animation
- ✅ Risk badges show on each clause (Low/Medium/High)
- ✅ Overall risk summary appears at the end
- ✅ No console errors during streaming

**Common Issues:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Streaming doesn't start | API connection failed | Check CORS settings, verify API URL |
| Clauses don't appear | SSE parsing error | Check browser SSE support |
| "Error" message | OpenAI API issue | Verify OPENAI_API_KEY is set |

---

### Feature #2: Interactive Risk Visualization

**Location:** Playground page → Right column (after analysis)

**How to Test:**
1. Complete an analysis (Feature #1)
2. Look at the Risk Summary Card
3. Observe the animated gauge, donut chart, and score

**What to Watch For:**
- ✅ Gauge needle animates to risk level position
- ✅ Donut chart segments animate in sequence
- ✅ Score counter animates from 0 to final value
- ✅ Colors match risk level (green/amber/red)
- ✅ Legend shows correct clause counts
- ✅ All animations are smooth (60fps)

**Common Issues:**
| Issue | Cause | Solution |
|-------|-------|----------|
| No animations | `animationsEnabled: false` in settings | Check Settings panel |
| Wrong colors | Theme mismatch | Toggle dark/light mode |
| Gauge stuck | No risk data | Ensure analysis completed |

---

### Feature #3: Live Clause Highlighter

**Location:** Playground page → Clause Details → "In Context" tab

**How to Test:**
1. Complete an analysis
2. Select a clause from the left panel
3. Click the "In Context" tab in Clause Details
4. Click on highlighted text sections
5. Use up/down arrows to navigate

**What to Watch For:**
- ✅ Contract text shows with colored highlights
- ✅ Selected clause is visually emphasized (ring/scale)
- ✅ Clicking highlight selects corresponding clause
- ✅ Navigation arrows work (scroll to next/prev clause)
- ✅ Legend shows color meanings
- ✅ Bidirectional: click clause → highlights scroll into view

**Common Issues:**
| Issue | Cause | Solution |
|-------|-------|----------|
| No highlights | Text matching failed | Clause text may differ from original |
| Wrong position | Text modified | Use original unmodified contract |
| Scroll doesn't work | Ref not attached | Check component mounting |

---

### Feature #4: Voice Question Input

**Location:** Playground page → Q&A panel → Microphone button

**How to Test:**
1. Complete an analysis
2. Find the microphone button in the Q&A input area
3. Click the microphone button
4. Speak a question (e.g., "What are the payment terms?")
5. Wait for transcription and auto-submit

**What to Watch For:**
- ✅ Mic button shows (not grayed out)
- ✅ Clicking starts listening indicator
- ✅ Waveform animation plays while listening
- ✅ Real-time transcription appears
- ✅ Auto-submits after 2 seconds of silence
- ✅ Question appears in chat

**Common Issues:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Mic button grayed | Browser doesn't support Web Speech API | Use Chrome/Edge |
| "Not allowed" error | Microphone permission denied | Allow mic in browser settings |
| No transcription | Poor mic input | Speak clearly, check mic volume |
| Wrong language | Default is en-US | Modify language in code if needed |

**Browser Support:**
- ✅ Chrome (full support)
- ✅ Edge (full support)
- ⚠️ Firefox (limited)
- ❌ Safari (not supported)

---

### Feature #5: One-Click Share

**Location:** Playground page → Risk Summary Card → Share button

**How to Test:**
1. Complete an analysis
2. Click "Share" button on Risk Summary Card
3. Test each sharing option:
   - Copy Summary
   - Copy Link
   - Twitter
   - LinkedIn
   - Email
   - Download Report

**What to Watch For:**
- ✅ Share dropdown opens
- ✅ "Copy Summary" shows "Copied!" confirmation
- ✅ Twitter opens compose tweet window
- ✅ LinkedIn opens share dialog
- ✅ Email opens default mail client
- ✅ Download saves a `.md` file

**Common Issues:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Copy doesn't work | HTTPS required for Clipboard API | Ensure site uses HTTPS |
| Social links fail | Popup blocked | Allow popups for site |
| Email doesn't open | No mail client configured | Configure default mail app |
| Download fails | Blob API issue | Check browser console |

---

### Feature #6: Smart Negotiation Tips

**Location:** Playground page → Select clause → Negotiation Tips panel

**How to Test:**
1. Complete an analysis
2. Select any clause from the list
3. Find the "Smart Negotiation Tips" card
4. Click "Generate Tips" button
5. Expand a tip to see strategy

**What to Watch For:**
- ✅ Loading state shows while generating
- ✅ 2-4 tips appear with categories (Soften/Protect/Counter/Remove)
- ✅ Each tip has suggested text
- ✅ Copy button works for suggested text
- ✅ Confidence bar animates
- ✅ "Show strategy" expands to reveal explanation

**Common Issues:**
| Issue | Cause | Solution |
|-------|-------|----------|
| No tips generated | OpenAI API error | Check API key, quota |
| Tips are generic | Insufficient context | Provide more clause text |
| Loading forever | API timeout | Check network, retry |
| Wrong category | AI classification | This is expected variance |

---

### Feature #7: Contract Comparison Mode

**Location:** Playground page → Available when you have analyzed contracts

**How to Test:**
1. Analyze first contract
2. Save/note the results
3. Analyze a second (modified) contract
4. Compare the results side-by-side

**What to Watch For:**
- ✅ Stats show: Added, Removed, Changed, Unchanged
- ✅ Overview tab shows risk level comparison
- ✅ Clause Changes tab lists all differences
- ✅ Side by Side tab shows diff for changed clauses
- ✅ Color coding: green=added, red=removed, amber=changed

**Common Issues:**
| Issue | Cause | Solution |
|-------|-------|----------|
| No differences found | Contracts identical | Use different contracts |
| Wrong matching | Clause types don't match | Comparison uses clause type matching |
| UI overflow | Many clauses | Scroll within component |

---

### Feature #8: PDF Export with Branding

**Location:** Playground page → Risk Summary Card → "Export PDF" button

**How to Test:**
1. Complete an analysis
2. Click "Export PDF" button
3. Fill in optional fields (Company Name, Prepared By)
4. Toggle include/exclude options
5. Click "Generate PDF"
6. Check print preview/downloaded PDF

**What to Watch For:**
- ✅ Dialog opens with options
- ✅ Form fields are editable
- ✅ Toggles work for content options
- ✅ Print preview shows formatted report
- ✅ Report includes:
  - Header with logo text
  - Contract name and date
  - Risk breakdown stats
  - Executive summary
  - Clause analysis
  - Footer with disclaimer

**Common Issues:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Blank PDF | Print window blocked | Allow popups |
| Missing styles | CSS not loaded | Wait for page load |
| Cut off content | Page breaks | Adjust content length |
| No download | Browser print settings | Use "Save as PDF" option |

---

### Feature #9: Contract History Dashboard

**Location:** Dashboard page → Analysis History section

**How to Test:**
1. Analyze several contracts in Playground
2. Navigate to `/dashboard`
3. Find the "Analysis History" card
4. Search for a contract
5. Click on an entry

**What to Watch For:**
- ✅ History entries appear after analysis
- ✅ Each entry shows: name, risk badge, date, clause count
- ✅ Search filters results
- ✅ Stats row shows totals
- ✅ Clicking entry could load details (if implemented)
- ✅ Clear All works (with confirmation)

**Common Issues:**
| Issue | Cause | Solution |
|-------|-------|----------|
| No history shown | localStorage cleared | Re-analyze contracts |
| Entries disappear | localStorage limit | Max 50 entries stored |
| Search not working | Case sensitivity | Search is case-insensitive |

**Storage Note:** History is stored in localStorage. Clearing browser data will erase history.

---

### Feature #10: Email Summary to Stakeholders

**Location:** Playground page → Risk Summary Card → "Email Summary" button

**How to Test:**
1. Complete an analysis
2. Click "Email Summary" button
3. Add recipient email(s)
4. Review preview
5. Add optional notes
6. Click "Open in Email"

**What to Watch For:**
- ✅ Dialog opens with form
- ✅ Can add multiple recipients
- ✅ Subject line pre-filled
- ✅ Preview shows risk breakdown
- ✅ Opens default email client
- ✅ Email body is formatted correctly

**Common Issues:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Email doesn't open | No default mail client | Configure mail app |
| Long URL error | Body too large for mailto | Reduce content |
| Formatting lost | Plain text only | mailto doesn't support HTML |
| Wrong characters | Encoding issue | Should be URL encoded |

---

### Feature #11: Batch Contract Analysis

**Location:** Playground page → "Batch Mode" button

**How to Test:**
1. Click "Batch Mode" button
2. Upload multiple `.txt` files (or drag & drop)
3. Click "Start Analysis"
4. Watch progress
5. Test Pause/Resume
6. Review results

**What to Watch For:**
- ✅ Batch panel opens as modal
- ✅ Files appear in queue after upload
- ✅ Progress bar updates
- ✅ Each file shows status: Queued → Processing → Done/Error
- ✅ Pause stops processing
- ✅ Resume continues from where paused
- ✅ Results show risk level per file

**Common Issues:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Files not loading | Wrong file type | Use .txt files |
| Processing stuck | API rate limit | Wait and retry |
| All errors | API connection issue | Check API endpoint |
| Slow processing | Sequential processing | Expected behavior |

**Note:** Currently uses mock analysis. Connect to real API for production.

---

### Feature #12: Custom Risk Thresholds

**Location:** Playground page → Settings button (gear icon) → Settings panel

**How to Test:**
1. Click the Settings button (gear icon)
2. Expand "Risk Thresholds" section
3. Adjust sliders:
   - Low Risk Max Score
   - Medium Risk Max Score
   - High Risk Clause Warning
   - Clause Type Weights
4. Toggle Display Preferences
5. Set Notification email
6. Close and verify persistence

**What to Watch For:**
- ✅ Settings panel slides in from right
- ✅ Sliders are draggable and responsive
- ✅ Values update in real-time
- ✅ Closing and reopening preserves values
- ✅ Reset button restores defaults
- ✅ Settings persist across page reloads

**Common Issues:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Settings not saving | localStorage disabled | Enable localStorage |
| Sliders not moving | Touch/mouse issue | Try different input method |
| Reset doesn't work | State not updating | Refresh page |

**Storage Note:** Settings are stored in localStorage under `contractcoach_settings`.

---

## 🌓 Theme Testing

**Test both themes for all features:**

1. Toggle theme (sun/moon icon in header)
2. Verify in Light Mode:
   - ✅ All text is readable
   - ✅ Cards have proper contrast
   - ✅ Buttons are visible
   - ✅ Charts use correct colors
3. Verify in Dark Mode:
   - ✅ All text is readable
   - ✅ Cards have proper contrast
   - ✅ Buttons are visible
   - ✅ Charts use correct colors

---

## 📱 Responsive Testing

**Test on different screen sizes:**

| Breakpoint | Test |
|------------|------|
| Mobile (< 640px) | Bottom nav, stacked layouts |
| Tablet (640-1024px) | 2-column where applicable |
| Desktop (> 1024px) | Full 2-3 column layouts |

**Key Checks:**
- ✅ Navigation adapts (hamburger on mobile)
- ✅ Cards stack properly
- ✅ Text doesn't overflow
- ✅ Modals are scrollable
- ✅ Touch targets are large enough

---

## 🔒 Security Testing

**Verify:**
- [ ] No API keys exposed in frontend code
- [ ] CORS only allows specific origins
- [ ] Rate limiting works (test 5+ rapid requests)
- [ ] Error messages don't expose sensitive info
- [ ] localStorage data is appropriate (no secrets)

---

## 🚨 Error Handling Testing

**Force errors and verify handling:**

1. **Network Error:** Disable network, try analysis
   - ✅ Should show error message
   - ✅ Should not crash

2. **API Error:** Use invalid API key (test env only)
   - ✅ Should show "Failed to analyze" message

3. **Empty Input:** Try to analyze empty text
   - ✅ Button should be disabled or show validation

4. **Large Input:** Paste very long contract (100k+ chars)
   - ✅ Should truncate or show warning

---

## ✅ Testing Checklist

### Quick Smoke Test (5 minutes)
- [ ] Home page loads
- [ ] Navigate to Playground
- [ ] Load demo contract
- [ ] Run analysis
- [ ] See results
- [ ] Toggle theme

### Full Test (30 minutes)
- [ ] Feature #1: Streaming Analysis
- [ ] Feature #2: Risk Visualization
- [ ] Feature #3: Clause Highlighter
- [ ] Feature #4: Voice Input
- [ ] Feature #5: Share Button
- [ ] Feature #6: Negotiation Tips
- [ ] Feature #7: Contract Comparison
- [ ] Feature #8: PDF Export
- [ ] Feature #9: History Dashboard
- [ ] Feature #10: Email Summary
- [ ] Feature #11: Batch Analysis
- [ ] Feature #12: Custom Thresholds
- [ ] Light/Dark themes
- [ ] Mobile responsive
- [ ] Error handling

---

## 📝 Bug Report Template

If you find an issue:

```markdown
## Bug Report

**Feature:** [#1-12]
**Environment:** [Production/Staging]
**Browser:** [Chrome/Firefox/Safari/Edge]
**Device:** [Desktop/Mobile]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**


**Actual Behavior:**


**Console Errors:**
```
(paste any errors)
```

**Screenshots:**
(attach if applicable)
```

---

## 🎉 Testing Complete

When all features pass testing:

1. Update `MVP_STABLE_VERSION.md` with new commit hash
2. Tag the release if not already tagged
3. Document any known issues
4. Notify stakeholders

---

**Happy Testing! 🧪**

