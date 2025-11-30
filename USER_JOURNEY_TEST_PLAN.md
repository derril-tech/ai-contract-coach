# User Journey Test Plan - ContractCoach MVP

## Overview
This document outlines all user journeys to test for the MVP release. Each journey should be verified end-to-end.

---

## Journey 1: Landing Page & Navigation

### Steps:
1. ✅ User visits homepage (`/`)
2. ✅ Hero video/background displays correctly (dark/light mode)
3. ✅ Logo and navigation bar visible
4. ✅ Theme toggle works (dark ↔ light)
5. ✅ "Get Started" button navigates to `/playground`
6. ✅ "Sign In" button (if implemented) works
7. ✅ Footer displays correctly with social links
8. ✅ All footer links work (GitHub, LinkedIn)

### Success Criteria:
- Page loads without errors
- All interactive elements work
- Responsive on mobile/desktop
- Theme switching works smoothly

---

## Journey 2: Dashboard View

### Steps:
1. ✅ User navigates to `/dashboard`
2. ✅ Dashboard displays (empty state or with contracts)
3. ✅ Navigation works (back to home, to playground)
4. ✅ Stats cards display correctly (if implemented)

### Success Criteria:
- Dashboard loads without errors
- Empty state is user-friendly
- Navigation is intuitive

---

## Journey 3: Playground - Manual Text Input

### Steps:
1. ✅ User navigates to `/playground`
2. ✅ Playground UI loads correctly
3. ✅ User enters contract text in input field
4. ✅ User clicks "Analyze Contract" button
5. ✅ Job is created (loading state shown)
6. ✅ Job status updates (queued → running → done)
7. ✅ Analysis results display
8. ✅ Clause list appears with risk indicators
9. ✅ User clicks on a clause
10. ✅ Clause detail view shows:
    - Plain English explanation
    - Risk assessment
    - Suggested edits
11. ✅ User can navigate between clauses

### Success Criteria:
- Text input accepts contract text
- Analysis completes successfully
- Results are displayed correctly
- Clause interactions work smoothly

---

## Journey 4: Playground - Google Drive Integration

### Steps:
1. ✅ User navigates to `/playground`
2. ✅ User clicks "Connect Google Drive" button
3. ✅ Google OAuth flow initiates
4. ✅ User authorizes access
5. ✅ Redirected back to `/playground` with token
6. ✅ Drive connection indicator shows (connected state)
7. ✅ User enters Google Drive File ID
8. ✅ User clicks "Import from Drive" or "Analyze"
9. ✅ File is fetched and extracted
10. ✅ Analysis runs on imported file
11. ✅ Results display correctly

### Success Criteria:
- OAuth flow completes successfully
- Token is stored securely
- File import works (PDF/Docx)
- Text extraction works correctly
- Analysis runs on imported content

---

## Journey 5: Clause Detail Review

### Steps:
1. ✅ User has analysis results with clauses
2. ✅ User clicks on a specific clause
3. ✅ Clause detail panel opens
4. ✅ User views "Plain English" tab
5. ✅ User views "Risk & Red Flags" tab
6. ✅ User views "Suggested Edit" tab
7. ✅ Risk indicators display correctly (low/medium/high)
8. ✅ All clause information is accurate

### Success Criteria:
- Clause detail view is comprehensive
- All tabs display correctly
- Risk indicators are clear
- Information is accurate

---

## Journey 6: Interactive Q&A

### Steps:
1. ✅ User has analysis results
2. ✅ User scrolls to Q&A section
3. ✅ User enters a question in the input field
4. ✅ User submits question
5. ✅ AI response appears
6. ✅ User asks follow-up question
7. ✅ Context is maintained across questions
8. ✅ Multiple Q&A exchanges work

### Success Criteria:
- Q&A interface is intuitive
- Responses are relevant and helpful
- Context is maintained
- Multiple questions work smoothly

---

## Journey 7: Theme Consistency

### Steps:
1. ✅ User switches to dark mode on landing page
2. ✅ Navigates to dashboard - dark mode persists
3. ✅ Navigates to playground - dark mode persists
4. ✅ Switches to light mode - all pages update
5. ✅ Refreshes page - theme preference persists

### Success Criteria:
- Theme is consistent across all pages
- Theme preference persists across sessions
- Smooth transitions between themes

---

## Journey 8: Error Handling

### Steps:
1. ✅ User submits empty text - appropriate error shown
2. ✅ Network error occurs - error message displays
3. ✅ Invalid Drive File ID - error handled gracefully
4. ✅ OAuth cancellation - user redirected correctly
5. ✅ Analysis timeout - error state shown

### Success Criteria:
- All errors are user-friendly
- Error messages are clear
- User can recover from errors
- No crashes or blank screens

---

## Journey 9: Responsive Design

### Steps:
1. ✅ Test on desktop (1920x1080)
2. ✅ Test on tablet (768x1024)
3. ✅ Test on mobile (375x667)
4. ✅ Navigation works on all sizes
5. ✅ Forms are usable on mobile
6. ✅ Videos/images scale correctly

### Success Criteria:
- All pages are responsive
- Touch interactions work on mobile
- No horizontal scrolling on mobile
- Hamburger menu works (if implemented)

---

## Journey 10: Performance

### Steps:
1. ✅ Page load times are acceptable (<3s)
2. ✅ Analysis completes within reasonable time (<30s)
3. ✅ No blocking UI during processing
4. ✅ Smooth animations and transitions
5. ✅ Images/videos load efficiently

### Success Criteria:
- Fast initial load
- Responsive during analysis
- Smooth user experience
- No performance bottlenecks

---

## Testing Status

### Status Legend:
- ✅ Tested & Passed
- ⚠️ Tested & Issues Found
- ❌ Not Tested Yet
- 🔄 In Progress

---

## Notes
- Test each journey in isolation first
- Then test cross-journey flows
- Document any issues found
- Update status as testing progresses

---

*Last Updated: [Date]*
*Tester: [Name]*
*Version: MVP 1.0*

