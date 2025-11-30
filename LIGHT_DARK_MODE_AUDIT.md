````md
<!--
Purpose: Audit, fix, and standardize light & dark mode behavior
Stack: React 19 + Next.js 15 (App Router), any styling solution (Tailwind, CSS Modules, styled-components, shadcn/ui)
Usage: Paste into .cursor-prompts or open in your AI coding assistant and run it against the repo.
-->

# Light & Dark Mode Audit & Fix Guide (React 19 / Next.js 15)

You are a senior frontend engineer specializing in theming and design systems.

Your job: **make the light and dark modes of this React 19 / Next.js 15 app visually correct, consistent, and maintainable**, regardless of the existing code style.

Follow this process exactly.

---

## 0. Assumptions & Hard Constraints

- Framework: **Next.js 15 (App Router)**, **React 19**.
- Styling may be:
  - Tailwind (+ optionally shadcn/ui), or
  - CSS Modules / global CSS, or
  - styled-components / emotion / other CSS-in-JS.
- Do **not** change routes, data fetching, or business logic.
- Keep diffs **focused on theming** (classNames, CSS variables, wrappers, minor markup tweaks).

If the app already uses a theming library (e.g. `next-themes`, a custom ThemeProvider, or shadcn `ThemeProvider`), **reuse and fix that** instead of introducing a second theming system.

---

## 1. Identify the Current Theming Strategy

1. Scan for **theme providers** or **theme togglers**:
   - Look for `ThemeProvider`, `NextThemesProvider`, `ThemeContext`, or similar.
   - Check `app/layout.tsx`, `app/providers.tsx`, and `components` directories.

2. Determine how dark mode is represented:
   - `class="dark"` on `<html>` or `<body>` (Tailwind / next-themes style)?
   - A `data-theme` attribute?
   - A React state like `const [isDark, setIsDark] = useState(false)` passed down?
   - Hard-coded toggles or duplicated components (one per theme)?

3. Write down (mentally) the current pattern and **stick to a single canonical approach**:
   - Prefer `next-themes` with `attribute="class"` and Tailwind `dark:` variants when Tailwind is present.
   - Otherwise, prefer **CSS variables** (`--color-bg`, `--color-fg`, etc.) toggled at the root.

---

## 2. Standardize the Root Theme Setup

### 2.1 HTML & Body (App Router)

In `app/layout.tsx` (or `app/(site)/layout.tsx`):

- Ensure `<html>` and `<body>` are structured like this:

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils"; // or your local cn helper
import { ThemeProvider } from "@/components/theme-provider"; // see below

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "App",
  description: "App description",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
````

Key points:

* `suppressHydrationWarning` on `<html>` reduces hydration mismatches when theme changes.
* `bg-background text-foreground` (or equivalent semantic classes) must exist and adapt across themes.
* All pages should **inherit** from this `RootLayout` (no manual background/text colors on every page unless truly necessary).

### 2.2 Theme Provider (if using next-themes / shadcn)

Create or fix `components/theme-provider.tsx`:

```tsx
// components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

If the repo already has something similar, **normalize it to this behavior** rather than creating a new one.

---

## 3. Introduce or Normalize Design Tokens (CSS Variables)

Regardless of the styling system, make light/dark theme **mostly a matter of CSS variables**, not hard-coded colors.

### 3.1 Tailwind + CSS Variables

If Tailwind is present (look for `tailwind.config.{js,ts}` & `globals.css`):

1. In `globals.css` (or `app/globals.css`), define root variables:

```css
:root {
  --background: 255 255 255;
  --foreground: 15 23 42;
  --card: 255 255 255;
  --card-foreground: 15 23 42;
  --muted: 241 245 249;
  --muted-foreground: 100 116 139;
  /* add other tokens as needed */
}

.dark {
  --background: 15 23 42;
  --foreground: 241 245 249;
  --card: 15 23 42;
  --card-foreground: 241 245 249;
  --muted: 30 41 59;
  --muted-foreground: 148 163 184;
}
```

2. In `tailwind.config.ts`, map them to semantic utilities (if not already):

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};

export default config;
```

3. Use these semantics everywhere:

   * Replace `bg-white` / `bg-slate-900` etc. with `bg-background`, `bg-card`, `text-foreground`, etc.
   * Use `border-border` if you have a `border` token; avoid per-component hex values.

### 3.2 Non-Tailwind (CSS Modules / styled-components)

If Tailwind is **not** used:

1. Define variables on `:root` and `.dark` as above.
2. Refactor component styles (CSS Modules / styled-components) to refer to `var(--background)`, `var(--foreground)`, etc., instead of hard-coded colors.

Example (CSS module):

```css
/* Button.module.css */
.button {
  background-color: var(--accent, #2563eb);
  color: var(--accent-foreground, #f9fafb);
}
```

---

## 4. Audit & Fix Existing Components

Now systematically clean up the components. For each, follow these steps:

### 4.1 General Audit Strategy

1. Search for **hard-coded colors**:

   * Literal classes: `bg-white`, `text-black`, `bg-slate-900`, etc.
   * Inline styles: `style={{ backgroundColor: "#fff" }}`.
   * Hex/rgb in CSS files or styled-components.

2. For each occurrence:

   * Decide which semantic token it should map to (background, foreground, card, muted, accent, etc.).
   * Replace with the semantic class or variable:

     * Tailwind: `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, etc.
     * CSS vars: `background-color: var(--background)` etc.

3. If dark-specific classes exist (e.g. `dark:bg-slate-900`), **reconcile them with tokens**:

   * Prefer a single semantic token whose value changes between `:root` and `.dark`.
   * Only use `dark:` directly when there is genuinely theme-specific structural style (e.g. different gradient or image).

### 4.2 Layouts & Sections

* Ensure main shells (layouts, main pages) use token-based backgrounds, not raw colors.
* Example:

```tsx
// app/(marketing)/page.tsx or similar
export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* sections/cards here */}
    </main>
  );
}
```

* Remove redundant background settings on nested components unless necessary; let the root layout drive defaults.

### 4.3 Cards, Panels, Modals

* Standardize to something like:

```tsx
<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
  {/* content */}
</div>
```

* Ensure modal backdrops use theme-aware colors (opacity on `bg-background` or `bg-black/60` with appropriate dark behavior).
* For shadcn/ui components, ensure they use your token mapping (or keep shadcn defaults if already wired into tokens).

### 4.4 Typography & Small Text

* Replace `text-gray-700`, `text-gray-200`, etc. with semantic tokens:

  * `text-foreground` for primary copy
  * `text-muted-foreground` for secondary text
* Check headings: they should be readable in both modes (avoid super-light colors on dark backgrounds or vice-versa).

### 4.5 Buttons & Interactive Elements

* Ensure primary/secondary buttons use theme tokens:

  * Primary: `bg-primary text-primary-foreground`
  * Secondary: `bg-muted text-foreground`
* Hover/focus states must have sufficient contrast in both modes.
* Ensure `:focus-visible` outlines are visible:

  * Tailwind example: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

### 4.6 Inputs, Textareas, Selects

* Standardize:

  * Background: `bg-background` or `bg-card`.
  * Border: `border-input` mapped to a token that adjusts per theme.
  * Text: `text-foreground`.
  * Placeholder: use `placeholder:text-muted-foreground` or equivalent.

* Ensure autofill styles don’t break dark mode (if present, use `:-webkit-autofill` overrides with CSS variables).

### 4.7 Images, Logos, and Icons

* For logos or images that don’t work in dark mode:

  * Provide theme-specific variants (e.g. `logo-light.svg`, `logo-dark.svg`) and conditionally render based on theme class or `useTheme()` value, **but keep logic minimal**.
  * Example:

```tsx
"use client";
import { useTheme } from "next-themes";

export function BrandLogo() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <img
      src={isDark ? "/logo-dark.svg" : "/logo-light.svg"}
      alt="Brand logo"
      className="h-6 w-auto"
    />
  );
}
```

* Ensure SVG icons use `currentColor` so they inherit `text-foreground`.

### 4.8 Charts & Third-Party Components

* For chart libraries, theme-aware config:

  * Use CSS variables for chart colors when possible.
  * Derive chart palette from `getComputedStyle(document.documentElement)` for `--foreground`, `--muted-foreground`, etc.
* For third-party components with poor dark-mode support:

  * Wrap them in a container with background and text set to good contrast.
  * Override their CSS via a scoped selector using your tokens.

---

## 5. Remove Anti-Patterns

While auditing, **fix these anti-patterns**:

1. **Theme-specific duplication**:

   * Avoid fully duplicated components like `LightNavbar` and `DarkNavbar`.
   * Merge into one component using tokens and minimal theme-aware details.

2. **Inline theme state everywhere**:

   * Avoid `const isDark = useTheme()...` used in every small component unless necessary.
   * Theme state should mostly live in the provider + CSS; most components just use tokens.

3. **Mixed strategies**:

   * Don’t mix `class="dark"` on both `<html>` and `<body>` with different semantics.
   * Don’t mix `data-theme` and `class="dark"` unless the design system explicitly requires this.

4. **Hydration mismatch hazards**:

   * Do not read `window.matchMedia` or `localStorage` for theme in server components.
   * Use `next-themes` or a single client provider to manage theme; SSR should render a neutral baseline relying on CSS.

---

## 6. Final Verification Checklist

After refactoring, ensure the following are true:

* [ ] The app has a **single source of truth** for theme (ThemeProvider + CSS variables and/or Tailwind `dark`).
* [ ] `app/layout.tsx` (or root layout) sets:

  * `<html lang="en" suppressHydrationWarning>`
  * `<body className="min-h-screen bg-background text-foreground ...">`
* [ ] No critical UI element relies on hard-coded `#fff`, `#000`, or fixed grays — they use tokens instead.
* [ ] All main views (`/`, `/dashboard`, `/playground`, etc.) are readable and visually balanced in **both** light and dark mode.
* [ ] Buttons, form fields, and interactive elements have visible focus states and acceptable contrast.
* [ ] The theme switcher (if present) does not cause visible flash-of-incorrect-theme (FOT) beyond an acceptable minimum.
* [ ] There is no duplicated component solely for theme purposes; everything relies on tokens or minimal conditional logic.

---

## 7. Deliverables

When you finish the audit and fixes, summarize:

* Files touched (with 1–2 line rationale each).
* Any new or changed CSS variables and Tailwind tokens.
* Any remaining intentional exceptions (e.g. specific component that still uses direct `dark:` classes and why).

Keep the summary short and focused on theming changes only.

```
```
