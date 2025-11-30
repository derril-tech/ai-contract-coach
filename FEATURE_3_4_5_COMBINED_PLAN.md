# Features #3, #4, #5 - Combined Implementation Plan

> **Status:** 🔜 Ready to Implement  
> **Created:** 2025-11-30  
> **Baseline:** v1.2.0

---

## Overview

Implementing three features in one efficient run:

| # | Feature | Effort | Description |
|---|---------|--------|-------------|
| 3 | Live Clause Highlighter | ~1h | Bidirectional clause-text navigation |
| 4 | Voice Question Input | ~1h | Web Speech API for voice questions |
| 5 | One-Click Share | ~45m | Share results via Web Share API |

**Total Estimated Time:** ~2.5-3 hours

---

## Feature #3: Live Clause Highlighter

### What
Click a clause → original contract text scrolls and highlights the exact location.
Click text → shows clause details.

### Components
- `clause-highlighter.tsx` - Highlighted text display with scroll-to functionality

### Changes
- Playground page: Add original text panel with highlighting
- Bidirectional navigation between clause list and text

---

## Feature #4: Voice Question Input

### What
Press microphone button, speak your question, watch it transcribe and send.

### Components
- `voice-input.tsx` - Microphone button with Web Speech API

### Changes
- Add voice button to Q&A panel
- Real-time transcription display
- Auto-submit on speech end

---

## Feature #5: One-Click Share

### What
Generate shareable summary, copy to clipboard, or use native share dialog.

### Components
- `share-button.tsx` - Share/copy functionality

### Changes
- Add share button to analysis results
- Toast notification on copy
- Native share on mobile

---

## Implementation Order

1. **Feature #3** - Clause Highlighter (foundational)
2. **Feature #4** - Voice Input (standalone)
3. **Feature #5** - Share Button (standalone)
4. **Integration** - Add all to playground
5. **Test & Deploy**

---

## Backend Changes
**None!** All three features are frontend-only.

## External Services Changes
**None!** Uses browser APIs only.

## Breaking Changes
**None!** All features are additive.

---

**Ready to implement!**

