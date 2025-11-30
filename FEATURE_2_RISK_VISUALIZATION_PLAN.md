# Feature #2: Interactive Risk Visualization - Implementation Plan

> **Status:** 🔜 Ready to Implement  
> **Created:** 2025-11-30  
> **Baseline:** v1.1.0 (Commit: 33e8b46)

---

## 📋 Feature Overview

**What:** Beautiful animated risk visualizations including:
- Animated circular risk gauge with needle
- Risk distribution donut chart
- Clause risk heatmap/grid
- Animated risk score counter
- Overall contract health indicator

**Why Jaw-Dropping:**
- Visual impact immediately communicates contract risk
- Animations draw attention and create engagement
- Professional dashboard aesthetic
- Showcases React state-driven animations
- Makes data digestible at a glance

**User Experience:**
1. After analysis completes, risk gauge animates to final position
2. Donut chart shows distribution of low/medium/high risk clauses
3. Risk score counter animates up like a game score
4. Color-coded visual feedback throughout

---

## ❶ Frontend Changes

### New Components Needed
- `web/components/playground/risk-gauge.tsx` - Circular gauge with animated needle
- `web/components/playground/risk-donut.tsx` - Donut chart showing risk distribution
- `web/components/playground/risk-score.tsx` - Animated score counter
- `web/components/playground/risk-summary-card.tsx` - Combined risk overview card

### Components to Modify
- `web/app/playground/page.tsx` - Add risk summary card
- `web/app/dashboard/page.tsx` - Add risk overview to dashboard

### UI/UX Changes
1. **Risk Gauge:**
   - SVG-based circular gauge
   - Animated needle from 0 to risk score
   - Color gradient (green → yellow → red)
   - Glowing effect on completion

2. **Donut Chart:**
   - Shows clause distribution by risk level
   - Animated segment growth
   - Interactive hover states
   - Legend with counts

3. **Score Counter:**
   - Animated number counting up
   - Score out of 100
   - Color matches risk level

### React Showcases
- ✅ SVG animations with framer-motion
- ✅ useEffect for animation triggers
- ✅ State-driven color transitions
- ✅ Custom hooks for animation timing

### Responsive Design
- ✅ Gauge scales down on mobile
- ✅ Donut chart responsive
- ✅ Cards stack on small screens

### Dark Mode
- ✅ All SVGs use CSS variables
- ✅ Colors work in both themes

---

## ❷ Backend Changes

### Changes Needed
- **None!** This is a pure frontend feature.
- Uses existing data from streaming analysis (overallRisk, clauses with risk levels)

---

## ❸ External Services Changes

### Changes Needed
- **None!**
- No Redis changes
- No Supabase changes
- No Railway config changes
- No new environment variables

---

## ❹ Breaking Changes Prevention

### Existing Features Check
- ✅ Streaming analysis unchanged
- ✅ Existing risk meter component still works
- ✅ All API endpoints unchanged
- ✅ Existing hooks unchanged

### Strategy: Pure Additive
- New components only
- Existing RiskMeter component preserved
- New components are optional enhancements

### Rollback Plan
1. Remove new components from playground
2. Or: `git checkout v1.1.0`

---

## 🔍 Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| SVG performance issues | Low | Low | Use CSS transforms |
| Animation jank | Low | Low | Test on mobile |
| Dark mode issues | Low | Low | Use CSS variables |

---

## 📝 Implementation Steps

### Step 1: Create Risk Gauge Component (20 min)
1. Create `risk-gauge.tsx` with SVG circular gauge
2. Add animated needle with framer-motion
3. Add color gradient background
4. Test with different risk levels

### Step 2: Create Risk Donut Chart (15 min)
1. Create `risk-donut.tsx` with SVG donut
2. Add animated segment growth
3. Add legend component
4. Test with different clause counts

### Step 3: Create Risk Score Counter (10 min)
1. Create `risk-score.tsx` with animated counter
2. Add color transitions
3. Add supporting text

### Step 4: Create Risk Summary Card (10 min)
1. Create `risk-summary-card.tsx` combining all
2. Layout for desktop and mobile
3. Add to playground page

### Step 5: Update Dashboard (10 min)
1. Add risk overview to dashboard
2. Show recent analysis stats
3. Test responsiveness

### Step 6: Test & Deploy (15 min)
1. Test all animations
2. Test dark/light modes
3. Test responsive design
4. Deploy to production

---

## ⏱️ Time Estimation

| Phase | Estimated |
|-------|-----------|
| Risk Gauge | 20 min |
| Donut Chart | 15 min |
| Score Counter | 10 min |
| Summary Card | 10 min |
| Dashboard Update | 10 min |
| Testing & Deploy | 15 min |
| **Total** | **~80 min** |

---

## 🎨 Design Mockup (Text)

```
┌─────────────────────────────────────────────────────────────┐
│  Contract Risk Assessment                                   │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │    ╭───────╮    │  │  Risk Score     │                  │
│  │   ╱         ╲   │  │                 │                  │
│  │  │    ◉─────│   │  │     62/100      │                  │
│  │   ╲   │     ╱   │  │   ██████████░░  │                  │
│  │    ╰──┼────╯    │  │   MEDIUM RISK   │                  │
│  │       │         │  │                 │                  │
│  │     MEDIUM      │  └─────────────────┘                  │
│  └─────────────────┘                                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Clause Distribution                                 │   │
│  │  ┌────────┐                                         │   │
│  │  │ ████   │  ▪ 2 Low Risk   (green)                │   │
│  │  │ ████   │  ▪ 3 Medium Risk (amber)               │   │
│  │  │ ██     │  ▪ 1 High Risk   (red)                 │   │
│  │  └────────┘                                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Success Criteria

- [ ] Gauge animates smoothly to risk level
- [ ] Donut chart shows correct distribution
- [ ] Score counter animates up
- [ ] Works in light and dark mode
- [ ] Responsive on all devices
- [ ] No breaking changes
- [ ] Performance is smooth (60fps)

---

**Ready to implement! Follow the steps in order.**

