# DESIGN_SYSTEM.md  
_OpenAI ContractCoach – Design System_

---

## 1. Product & Brand Overview

**Product**  
OpenAI ContractCoach is an AI assistant that ingests long-form contracts from Google Drive, extracts key clauses (payment, IP, confidentiality, termination, liability), simplifies legal language, and flags unusual or risky terms.

**Personality**

- **Primary traits:** Trustworthy, precise, expert, calm.
- **Secondary traits:** Smart, proactive, quietly futuristic (AI, OpenAI SDK).
- **Emotional goal:** Replace contract anxiety with confidence and clarity.

**Visual Metaphors**

- **Paper & clauses** → contract pages, highlighted segments, layered sheets.
- **AI network** → connected nodes, flowing circuits, subtle glows.
- **Shield/structure** → protection, risk mitigation, reliable guardrails.

---

## 2. Brand Assets & Media

All assets live in `web/public` and are referenced via Next.js `public` URLs.

- **Logo**
  - File: `web/public/logo.png`
  - Web path: `/logo.png`
- **Hero Background – Light**
  - Video file: `web/public/hero-bg-light.mp4` → `/hero-bg-light.mp4`
  - Screenshot: `web/public/Screenshot-light.png` → `/Screenshot-light.png`
- **Hero Background – Dark**
  - Video file: `web/public/hero-bg-dark.mp4` → `/hero-bg-dark.mp4`
  - Screenshot: `web/public/Screenshot-dark.png` → `/Screenshot-dark.png`

**Usage**

- Use the **video** backgrounds on the home hero (`/`) in a masked layer behind content.
- Use the **screenshots** as static fallbacks (SSR, mobile low-power mode, or prefers-reduced-motion).
- The **logo** appears in:
  - App header (top-left)
  - Auth / landing hero
  - Favicon + social share image (derivative versions)

---

## 3. Layout & Grid

**Breakpoints (Tailwind-style)**

- `sm`: 640px – mobile
- `md`: 768px – small tablets
- `lg`: 1024px – laptops
- `xl`: 1280px – desktops
- `2xl`: 1536px – large monitors

**Grid**

- **Desktop**: 12-column fluid grid, `max-width: 1200px` for main content.
- **Content width**:
  - Primary content: 8–10 columns centered.
  - Sidebar / navigation: 3–4 columns on dashboards.
- **Vertical rhythm**:
  - Base unit: `4px`.
  - Common spacing: `8, 12, 16, 24, 32, 48, 64`.

**Page Structure**

- `/` (Landing)
  - Hero (full width, video background)
  - Value props (3 columns)
  - “How it works” (3-step timeline)
  - Screenshots / demo
  - CTA + trust indicators
- `/dashboard`
  - Top bar: logo, project selector, user menu.
  - Two-column layout:
    - Left: Recent contracts / filters.
    - Right: Selected contract overview + AI insights.
- `/playground`
  - Left: Contract selection + clause list.
  - Right: Chat-like clause explanation + risk annotations.

---

## 4. Color System

Core palette is inspired by legal paper + AI circuitry with a calm, trustworthy feel.

> Hex values are approximate and can be adjusted in Tailwind / CSS variables.

### 4.1 Brand Colors

- **Navy (Primary)**
  - `--color-primary: #15354A;`  
  - Usage: primary buttons, active states, key text accents.
- **Slate (Secondary)**
  - `--color-secondary: #495A68;`  
  - Usage: headers, navigation, card borders, icons.
- **Soft Gray**
  - `--color-soft-gray: #D4D8DC;`  
  - Usage: backgrounds, dividers, neutral chips.
- **Cream**
  - `--color-cream: #F5F1E8;`  
  - Usage: light surfaces, paper feel, hero overlay in light mode.
- **Soft Green**
  - `--color-accent: #7AA881;`  
  - Usage: success states, AI highlights, glowing nodes.

### 4.2 Light Mode

- `--bg-page: #F5F1E8` (cream)
- `--bg-elevated: #FFFFFF`
- `--bg-subtle: #EFF2F5`
- `--border-subtle: #E0E4E8`
- `--text-primary: #10212F`
- `--text-secondary: #4A5563`
- `--text-muted: #6B7280`
- `--shadow-soft: 0 18px 40px rgba(15, 23, 42, 0.08)`

### 4.3 Dark Mode

Inspired by the dark hero frame (circuit board in teal light).

- `--bg-page: #05060A`
- `--bg-elevated: #0B0F18`
- `--bg-subtle: #111827`
- `--border-subtle: #1F2933`
- `--text-primary: #F9FAFB`
- `--text-secondary: #D1D5DB`
- `--text-muted: #9CA3AF`
- `--glow-accent: rgba(122, 168, 129, 0.45)` (soft green glow)
- `--shadow-soft: 0 22px 55px rgba(0, 0, 0, 0.7)`

### 4.4 Semantic Colors

- **Success**: `#22C55E` (muted by default, only bright in badges).
- **Warning**: `#F97316` (used sparingly).
- **Danger**: `#EF4444` (for “high risk” clauses).
- **Info**: use **Soft Green** + Navy.

These are always rendered on accessible backgrounds (min contrast AA).

---

## 5. Typography

**Base fonts**

- **Display & Headings**: `Inter`, `SF Pro Text`, or similar modern sans.
- **Body**: same family, with careful line height.
- **Mono (clauses & code)**: `JetBrains Mono`, `SF Mono`, or `ui-monospace`.

**Scale**

- `display-1`: 40px / 48px – hero title.
- `h1`: 32px / 40px – page headers.
- `h2`: 24px / 32px – section headers.
- `h3`: 20px / 28px – card titles.
- `body-lg`: 18px / 28px – main copy / explanations.
- `body`: 16px / 24px – general UI text.
- `body-sm`: 14px / 20px – meta labels, table headers.
- `caption`: 12px / 16px – helper text, pill labels.

**Usage Guidelines**

- Keep headings concise; complement hero video rather than compete.
- Use **monospace** blocks for:
  - Raw clause text
  - JSON-like structured outputs (e.g., extracted metadata).
- Apply slightly increased letter-spacing for uppercase labels (0.04em).

---

## 6. Spacing, Radius & Elevation

**Spacing Tokens**

- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-6`: 24px
- `space-8`: 32px
- `space-10`: 40px
- `space-12`: 48px

**Border Radius**

- `radius-sm`: 6px – input fields, small tags.
- `radius-md`: 12px – cards, chips.
- `radius-lg`: 18px – primary layout containers.
- `radius-full`: 9999px – pills, circular status dots.

**Shadows / Elevation**

- **Card base**: soft, diffused shadow; consistent across themes.
- **Elevated modals**: strong shadow + slight border for definition.
- Components never use more than two shadow presets to keep visual consistency.

---

## 7. Iconography & Illustration

- Icon style: simple, thin-line, slightly rounded corners.
- Preferred libraries: `lucide-react` integrated via shadcn UI.
- Common pictograms:
  - Contract / document
  - Shield / risk
  - Highlighter / clause
  - AI node network
  - Google Drive glyph (for import CTA)

**Illustration Style**

- Subtle, abstract: focus on contract pages + lines + circuits.
- Avoid literal people or mascots; focus on expertise and structure.

---

## 8. Theming & Technical Integration (Next.js 15 / React 19)

**Theming Implementation**

- Use CSS variables for tokens, toggled via `[data-theme="light"]` / `[data-theme="dark"]`.
- Integrate `next-themes` for theme switching with system default.

Example (high-level):

```tsx
// app/layout.tsx
<html lang="en" suppressHydrationWarning>
  <body className={cn("min-h-screen bg-page text-primary", inter.className)}>
    <ThemeProvider attribute="data-theme" defaultTheme="system">
      <AppShell>{children}</AppShell>
    </ThemeProvider>
  </body>
</html>
```

**Video Background**

```tsx
// Example fragment for hero
<div className="relative h-[70vh] overflow-hidden rounded-3xl">
  <video
    autoPlay
    loop
    muted
    playsInline
    poster="/Screenshot-light.png"
    className="absolute inset-0 h-full w-full object-cover"
    src="/hero-bg-light.mp4"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-bg-page/90 via-bg-page/60 to-bg-page/20" />
  <div className="relative z-10 flex h-full flex-col items-start justify-center px-8 md:px-16">
    {/* Hero content */}
  </div>
</div>
```

In dark mode, `src` switches to `/hero-bg-dark.mp4` and poster to `/Screenshot-dark.png`.

---

## 9. Components & Patterns

### 9.1 App Shell

* **Header**

  * Left: logo (`/logo.png`) + product name.
  * Center: page-specific breadcrumbs or status (e.g., “Reviewing: ACME MSA v3”).
  * Right: theme toggle, user avatar menu, “New Review” button.
* **Sidebar (dashboard)**

  * Sections: “My Contracts”, “Templates”, “Reports”, “Settings”.
  * Uses navy hover, soft green active indicator.

### 9.2 Buttons

**Variants**

* Primary (solid)

  * Background: `--color-primary`
  * Text: white
  * Hover: slightly lighter navy
  * Focus: 2px soft-green outline
* Secondary (outline)

  * Border: `--color-secondary`
  * Text: `--color-secondary`
  * Hover: subtle slate background
* Ghost

  * Transparent background
  * Text in `--text-secondary`
  * Used for filters, secondary actions.

**Special Button**

* “Run AI Review”

  * Gradient background in light mode: navy → soft green.
  * Pulsing glow (Framer Motion) on idle.
  * Use icon: `Sparkles` or custom AI node icon.

### 9.3 Inputs & Selects

* Rounded `radius-md` with subtle border.
* Focus ring in soft green.
* Labels always visible; placeholders are optional hints.
* For clause filters, use chip-like segmented controls.

### 9.4 Cards

Used extensively for:

* **Contract Overview**
* **Risk Summary**
* **Key Clauses**

Structure:

* Title row with icon + title + optional badge (e.g., “High risk”).
* Body with compact content and meta.
* Footer with actions (e.g., “See full clause”, “Add note”).

### 9.5 Clause List & Detail View

**Clause List Panel**

* Vertical list with:

  * Clause type pill (e.g., “Payment Terms”).
  * Short excerpt.
  * Risk badge (Low, Medium, High).
* Selected clause uses navy left border + soft-cream background in light mode; slate highlight in dark.

**Detail Panel**

* Two-column layout on large screens:

  * Left: original clause (monospace, small).
  * Right: AI explanation & recommendations (body text).
* Tabs:

  * “Plain English”
  * “Risk & Red Flags”
  * “Suggested Edit”
  * “History”

### 9.6 Risk Badges

* **Low**: Soft green background, dark green text.
* **Medium**: Warm amber background, dark text.
* **High**: Light red background, red text, plus small “shield-warning” icon.

Badges are pill-shaped and appear:

* In clause list items.
* In the “Risk Summary” top card.

### 9.7 Timeline / Flow Pattern

Used for “Review Steps”:

1. Import from Drive
2. Analyze & Extract
3. Review Clauses
4. Export / Share

Visual style:

* Horizontal stepper on desktop, vertical on mobile.
* Each step: circle with icon, connected by thin line.
* Completed steps: soft green fill.
* Current step: navy border + subtle glow.

### 9.8 Toasts & Notifications

* Top-right stacked, 4-second auto-dismiss.
* Success: soft green left border, cream background.
* Error: red left border, darkened background.
* Info: navy left border.

### 9.9 Modals / Drawers

* Use for:

  * Google Drive OAuth / file picker.
  * Export / share dialogues.
* Dark overlay with 30–40% opacity.
* Corner radius `radius-lg` and soft shadow.

---

## 10. Motion & Interaction

Use **Framer Motion** sparingly but deliberately.

**Principles**

* Fast, smooth (200–250ms) transitions.
* Easing: `easeOut` or cubic-bezier(0.16, 1, 0.3, 1).
* No large bouncy animations; feel precise and considered.

**Key Interactions**

* Hero text slides up & fades in after video loads.
* Cards subtly lift by `4px` on hover with increased shadow.
* Clause selection animates:

  * Background color fade.
  * Slight scale of risk badge.
* “Run AI Review” button:

  * Gentle pulsing outer glow when idle (to hint main action).
* Results:

  * AI text appears via fade + “type in” effect (e.g., character-based or word-based), respecting performance.

Respect `prefers-reduced-motion` by disabling non-essential animations.

---

## 11. Accessibility

* Minimum contrast:

  * Text vs background: WCAG AA.
  * Check especially soft green on cream and on dark backgrounds.
* Keyboard navigation:

  * All interactive elements reachable using Tab.
  * Clear focus ring using soft green outline.
* Screen readers:

  * ARIA labels for:

    * Hero video (“Background video showing contracts being analyzed”).
    * Icons used without label.
    * Clause risk badges (“Payment clause, high risk”).
* Live regions:

  * Use aria-live for AI response area to announce when new analysis arrives.

---

## 12. Example Design Tokens (CSS Variables)

Define in `globals.css`:

```css
:root {
  --color-primary: #15354A;
  --color-secondary: #495A68;
  --color-soft-gray: #D4D8DC;
  --color-cream: #F5F1E8;
  --color-accent: #7AA881;

  --bg-page: var(--color-cream);
  --bg-elevated: #FFFFFF;
  --bg-subtle: #EFF2F5;

  --text-primary: #10212F;
  --text-secondary: #4A5563;
  --text-muted: #6B7280;

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 18px;
}

[data-theme="dark"] {
  --bg-page: #05060A;
  --bg-elevated: #0B0F18;
  --bg-subtle: #111827;

  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
  --text-muted: #9CA3AF;
}
```

Example Tailwind mapping:

```js
// tailwind.config.ts (excerpt)
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
      'bg-page': 'var(--bg-page)',
      'bg-elevated': 'var(--bg-elevated)',
      'bg-subtle': 'var(--bg-subtle)',
      'text-primary': 'var(--text-primary)',
      'text-secondary': 'var(--text-secondary)',
      'text-muted': 'var(--text-muted)',
    },
    borderRadius: {
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
    },
  },
}
```

---

## 17. Light & Dark Theme Variants (Video-Driven)

The light and dark themes are derived directly from the provided hero videos:

- **Light mode** – stacked legal papers, soft depth, warm neutrals.
- **Dark mode** – AI circuitry on a deep navy/charcoal surface with soft green glows.

Both themes share the same **semantic tokens** but use different underlying values to stay visually consistent while respecting the mood of each background.

---

### 17.1 Light Theme – “Paper Desk”

**Mood**

- Quiet, professional, like looking at neatly stacked contracts on a desk.
- Warm cream and soft gray, low visual noise.
- Subtle shadows to imply physical pages.

**Core Tokens (Light)**

```css
:root[data-theme="light"] {
  /* Backgrounds */
  --bg-page: #F5F1E8;        /* paper / desk */
  --bg-elevated: #FFFFFF;    /* cards, modals */
  --bg-subtle: #EFF2F5;      /* subtle panels, inputs */
  --bg-interactive: #E6EBF1; /* hover states */

  /* Borders */
  --border-subtle: #E0E4E8;
  --border-strong: #C9CED6;

  /* Text */
  --text-primary: #10212F;
  --text-secondary: #4A5563;
  --text-muted: #6B7280;
  --text-on-primary: #FFFFFF;

  /* Brand / Accent */
  --color-primary: #15354A;  /* navy */
  --color-secondary: #495A68;/* slate */
  --color-accent: #7AA881;   /* soft green */

  /* Status */
  --color-success: #22C55E;
  --color-warning: #F97316;
  --color-danger:  #EF4444;

  /* Effects */
  --shadow-soft: 0 18px 40px rgba(15, 23, 42, 0.08);
  --shadow-strong: 0 26px 60px rgba(15, 23, 42, 0.14);
  --glow-accent: 0 0 0 1px rgba(122, 168, 129, 0.3);

  /* Overlay over hero video */
  --hero-overlay-from: rgba(245, 241, 232, 0.95);
  --hero-overlay-to:   rgba(245, 241, 232, 0.45);
}
```

**Usage Guidelines (Light)**

* **Hero overlay**

  * Use a left-to-right and bottom-to-top gradient so the stacked pages remain visible but don’t compete with text.
  * Example:

    ```css
    background-image:
      linear-gradient(to right, var(--hero-overlay-from), var(--hero-overlay-to), transparent),
      linear-gradient(to top, var(--hero-overlay-from), transparent);
    ```

* **Surfaces**

  * `bg-bg-page` for app body, `bg-bg-elevated` for cards, `bg-bg-subtle` for panels/inputs.

* **Buttons**

  * Primary: `background: var(--color-primary); color: var(--text-on-primary);`
  * Outline: white background, `border: var(--border-subtle)`, hover fills with `--bg-interactive`.

* **Risk badges**

  * Use soft tints over white or subtle backgrounds:

    ```css
    /* Light */
    --risk-low-bg:    rgba(22, 163, 74, 0.08);
    --risk-low-text:  #15803D;
    --risk-med-bg:    rgba(245, 158, 11, 0.08);
    --risk-med-text:  #B45309;
    --risk-high-bg:   rgba(239, 68, 68, 0.08);
    --risk-high-text: #B91C1C;
    ```

* **Scroll surfaces**

  * Use `bg-bg-subtle` for scrollable original clause text — feels like a slightly darker sheet under the top page.

---

### 17.2 Dark Theme – “AI Circuit Board”

**Mood**

* Deep, focused, technical – like looking at a glowing circuit board.
* Background hero shows a network of teal/soft-green nodes and lines.
* UI should feel **precise and calm**, never neon or noisy.

**Core Tokens (Dark)**

```css
:root[data-theme="dark"] {
  /* Backgrounds */
  --bg-page: #05060A;        /* near-black navy */
  --bg-elevated: #0B0F18;    /* cards */
  --bg-subtle: #111827;      /* sidebars, panels */
  --bg-interactive: #121B2A; /* hovers */

  /* Borders */
  --border-subtle: #1F2933;
  --border-strong: #334155;

  /* Text */
  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
  --text-muted: #9CA3AF;
  --text-on-primary: #F9FAFB;

  /* Brand / Accent */
  --color-primary: #7AA881;   /* soft green becomes primary pop on dark */
  --color-secondary: #7C8FA0; /* slate shifted lighter */
  --color-accent: #A9D5B0;    /* lighter green for glows */

  /* Status */
  --color-success: #22C55E;
  --color-warning: #F97316;
  --color-danger:  #FB7185;

  /* Effects */
  --shadow-soft: 0 22px 55px rgba(0, 0, 0, 0.7);
  --shadow-strong: 0 32px 80px rgba(0, 0, 0, 0.9);
  --glow-accent: 0 0 25px rgba(122, 168, 129, 0.6);

  /* Overlay over hero video */
  --hero-overlay-from: rgba(5, 6, 10, 0.96);
  --hero-overlay-to:   rgba(5, 6, 10, 0.55);
}
```

**Usage Guidelines (Dark)**

* **Hero overlay**

  * Preserve the glowing circuit effect while making text readable:

    ```css
    background-image:
      radial-gradient(circle at 20% 20%, rgba(122, 168, 129, 0.25), transparent 55%),
      radial-gradient(circle at 80% 70%, rgba(122, 168, 129, 0.15), transparent 60%),
      linear-gradient(to right, var(--hero-overlay-from), var(--hero-overlay-to), transparent),
      linear-gradient(to top, var(--hero-overlay-from), transparent);
    ```

* **Primary actions**

  * Use soft green as primary background with subtle outer glow:

    ```css
    /* For primary button on dark */
    background-color: var(--color-primary);
    box-shadow: var(--glow-accent);
    color: var(--text-on-primary);
    ```

* **Surfaces & contrast**

  * `bg-bg-page` is near-black; always render text on `bg-bg-elevated` or `bg-bg-subtle` for long blocks of copy to avoid eye strain.
  * Use `border-subtle` to outline cards instead of increased brightness.

* **Risk badges**

  * Keep them readable but non-blinding:

    ```css
    /* Dark */
    --risk-low-bg:    rgba(22, 163, 74, 0.16);
    --risk-low-text:  #4ADE80;
    --risk-med-bg:    rgba(245, 158, 11, 0.18);
    --risk-med-text:  #FDBA74;
    --risk-high-bg:   rgba(248, 113, 113, 0.18);
    --risk-high-text: #FCA5A5;
    ```

* **Circuit accent lines**

  * For subtle separators (e.g., between cards or columns), use a **thin 1px line** with color `rgba(122, 168, 129, 0.22)` to echo the circuitry without drawing too much attention.

---

### 17.3 Tailwind Mapping & Utility Examples

Map theme variables into Tailwind’s `extend.colors` so components remain token-driven:

```ts
// tailwind.config.ts (excerpt)
extend: {
  colors: {
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    accent: "var(--color-accent)",
    "bg-page": "var(--bg-page)",
    "bg-elevated": "var(--bg-elevated)",
    "bg-subtle": "var(--bg-subtle)",
    "bg-interactive": "var(--bg-interactive)",
    "text-primary": "var(--text-primary)",
    "text-secondary": "var(--text-secondary)",
    "text-muted": "var(--text-muted)",
    "border-subtle": "var(--border-subtle)",
  },
}
```

**Example hero container classes**

```tsx
<div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-bg-page shadow-soft">
  {/* video + overlay */}
</div>
```

**Example card for both themes**

```tsx
<Card className="border-border-subtle/80 bg-bg-elevated/90 shadow-soft">
  {/* content */}
</Card>
```

Because both light and dark themes share the same semantic classes, the components automatically adapt when `data-theme` toggles.

---

### 17.4 State & Interaction Variants per Theme

**Hover / Active**

* Light:

  * Hover: `bg-bg-interactive`, `border-border-strong`.
  * Active: slightly darker `bg-bg-interactive`, reduced shadow.
* Dark:

  * Hover: `bg-bg-interactive` with a hint of green tint (`box-shadow: 0 0 0 1px rgba(122, 168, 129, 0.25)` for critical CTAs).
  * Active: drop the glow and slightly darken background.

**Focus**

* Both themes use the same accessible focus ring:

```css
outline: 2px solid rgba(122, 168, 129, 0.9);
outline-offset: 2px;
```

**Disabled**

* Light: lower opacity to `0.45`, maintain the same background color, remove shadows.
* Dark: lower opacity to `0.55` and remove glows/shadows.

---

### 17.5 Hero Video Integration (Final Checklist)

For every page that uses the hero video:

* **Light mode**

  * `<video src="/hero-bg-light.mp4" poster="/Screenshot-light.png" ...>`
  * Overlay with `--hero-overlay-from` / `--hero-overlay-to`.
  * Text always on `text-primary` / `text-secondary`.

* **Dark mode**

  * `<video src="/hero-bg-dark.mp4" poster="/Screenshot-dark.png" ...>`
  * Add radial green glows to connect with the circuitry pattern.
  * Reserve bright greens only for:

    * Primary CTA
    * Active step in the timeline
    * Critical status badges

This ensures the app feels like **one cohesive product** where the visuals of the video backgrounds, the logo, and the UI themes all speak the same language—both in **light “paper desk” mode** and **dark “AI circuit board” mode**.

---

## 18. Tailwind + shadcn Theme Mapping & Video Overlays

This section shows:

1. How to wire our **CSS variables** into **Tailwind** and **shadcn/ui**.
2. Exactly how to **overlay the hero videos** and make them visible in the existing layout / `Hero` components we already wrote.

---

### 18.1 Global CSS Variables & Base Styles

Create / update `web/app/globals.css` (or equivalent) to define light/dark tokens and base styles.

```css
/* web/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root[data-theme="light"] {
    /* Backgrounds */
    --bg-page: #F5F1E8;
    --bg-elevated: #FFFFFF;
    --bg-subtle: #EFF2F5;
    --bg-interactive: #E6EBF1;

    /* Borders */
    --border-subtle: #E0E4E8;
    --border-strong: #C9CED6;

    /* Text */
    --text-primary: #10212F;
    --text-secondary: #4A5563;
    --text-muted: #6B7280;
    --text-on-primary: #FFFFFF;

    /* Brand / Accent */
    --color-primary: #15354A;
    --color-secondary: #495A68;
    --color-accent: #7AA881;

    /* Status */
    --color-success: #22C55E;
    --color-warning: #F97316;
    --color-danger: #EF4444;

    /* Effects */
    --shadow-soft: 0 18px 40px rgba(15, 23, 42, 0.08);
    --shadow-strong: 0 26px 60px rgba(15, 23, 42, 0.14);
    --glow-accent: 0 0 0 1px rgba(122, 168, 129, 0.3);

    /* Hero overlay */
    --hero-overlay-from: rgba(245, 241, 232, 0.96);
    --hero-overlay-to: rgba(245, 241, 232, 0.45);
  }

  :root[data-theme="dark"] {
    /* Backgrounds */
    --bg-page: #05060A;
    --bg-elevated: #0B0F18;
    --bg-subtle: #111827;
    --bg-interactive: #121B2A;

    /* Borders */
    --border-subtle: #1F2933;
    --border-strong: #334155;

    /* Text */
    --text-primary: #F9FAFB;
    --text-secondary: #D1D5DB;
    --text-muted: #9CA3AF;
    --text-on-primary: #F9FAFB;

    /* Brand / Accent */
    --color-primary: #7AA881;   /* green as primary on dark */
    --color-secondary: #7C8FA0;
    --color-accent: #A9D5B0;

    /* Status */
    --color-success: #22C55E;
    --color-warning: #F97316;
    --color-danger: #FB7185;

    /* Effects */
    --shadow-soft: 0 22px 55px rgba(0, 0, 0, 0.7);
    --shadow-strong: 0 32px 80px rgba(0, 0, 0, 0.9);
    --glow-accent: 0 0 25px rgba(122, 168, 129, 0.6);

    /* Hero overlay */
    --hero-overlay-from: rgba(5, 6, 10, 0.96);
    --hero-overlay-to: rgba(5, 6, 10, 0.55);
  }

  body {
    @apply bg-bg-page text-text-primary antialiased;
  }
}
```

> We’re using `data-theme="light"` / `data-theme="dark"` which is already compatible with the existing `ThemeProvider` usage.

---

### 18.2 Tailwind Theme Mapping

Update `web/tailwind.config.ts` so Tailwind utilities point at these CSS variables.

```ts
// web/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic background / text
        "bg-page": "var(--bg-page)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-subtle": "var(--bg-subtle)",
        "bg-interactive": "var(--bg-interactive)",

        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",

        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",

        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",

        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        strong: "var(--shadow-strong)",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "18px",
      },
    },
  },
  plugins: [],
};

export default config;
```

Now utility classes like `bg-bg-page`, `text-text-primary`, `border-border-subtle`, `shadow-soft`, etc. are fully theme-aware.

---

### 18.3 shadcn/ui Theme Alignment

If you’re using shadcn’s default theme tokens, you can align them to our variables by overriding the CSS in `web/app/globals.css`:

```css
/* Map shadcn's CSS custom properties to our semantic vars */

@layer base {
  :root[data-theme="light"] {
    --background: var(--bg-page);
    --foreground: var(--text-primary);

    --card: var(--bg-elevated);
    --card-foreground: var(--text-primary);

    --popover: var(--bg-elevated);
    --popover-foreground: var(--text-primary);

    --primary: var(--color-primary);
    --primary-foreground: var(--text-on-primary);

    --secondary: var(--color-secondary);
    --secondary-foreground: var(--text-on-primary);

    --muted: var(--bg-subtle);
    --muted-foreground: var(--text-muted);

    --accent: var(--color-accent);
    --accent-foreground: var(--text-on-primary);

    --border: var(--border-subtle);
    --input: var(--border-subtle);
    --ring: var(--color-accent);
  }

  :root[data-theme="dark"] {
    --background: var(--bg-page);
    --foreground: var(--text-primary);

    --card: var(--bg-elevated);
    --card-foreground: var(--text-primary);

    --popover: var(--bg-elevated);
    --popover-foreground: var(--text-primary);

    --primary: var(--color-primary);
    --primary-foreground: var(--text-on-primary);

    --secondary: var(--color-secondary);
    --secondary-foreground: var(--text-on-primary);

    --muted: var(--bg-subtle);
    --muted-foreground: var(--text-muted);

    --accent: var(--color-accent);
    --accent-foreground: var(--text-on-primary);

    --border: var(--border-subtle);
    --input: var(--border-subtle);
    --ring: var(--color-accent);
  }
}
```

This ensures all `Button`, `Card`, `Input`, etc. from shadcn automatically adopt our theme without refactoring component styles.
