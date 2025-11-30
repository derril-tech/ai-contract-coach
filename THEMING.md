
````md
# Theming Guidelines (React 19 / Next.js 15)

**Purpose**

These rules tell you, the AI coding assistant, exactly how to **create, edit, and refactor UI code without breaking light/dark mode**.

You must follow these instructions whenever you touch **UI, layout, components, or styles**.

Tech assumptions:

- Framework: **React 19**, **Next.js 15 (App Router)**.
- Theming style may vary:
  - Tailwind (+ optional shadcn/ui) **or**
  - CSS Modules / global CSS **or**
  - styled-components / emotion / other CSS-in-JS.
- Light/dark mode already exists or will exist. Your job is to **preserve and improve it**, not to introduce a separate, conflicting system.

---

## 1. Core Principles (Never Break These)

When editing or generating code:

1. **Single source of truth for theme**

   - There must be exactly **one primary theme mechanism**, for example:
     - A `ThemeProvider` / `next-themes` setup that toggles a `class` (e.g. `dark`) on `<html>` or `<body>`, _or_
     - A root `data-theme` attribute, _or_
     - A global CSS variable setup.
   - **Do not** introduce a second, parallel theme mechanism.
   - If a theme provider already exists, **re-use it**. Do not create a new one.

2. **Theme through tokens, not raw colors**

   - Prefer **semantic tokens** (CSS variables or semantic Tailwind classes) such as:
     - `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, etc.
   - Avoid hard-coded colors in component code:
     - No `#000`, `#fff`, `#1f2937` in JSX/CSS unless explicitly part of a design token.
     - Avoid adding new raw Tailwind colors like `bg-slate-900`, `text-gray-700` when tokens exist.

3. **Layout changes must respect theming**

   When you move, wrap, or restructure components:

   - Preserve any **theme-related classes** (e.g. `bg-background`, `dark:` variants).
   - Keep containers that define the background/text context (e.g. `min-h-screen bg-background text-foreground`).
   - Do **not** drop theme wrappers (like `<ThemeProvider>` or theme-aware `<main>` / `<section>` elements) when rearranging layouts.

4. **Do not break SSR hydration**

   - Do not read `window`, `document`, `localStorage`, or `matchMedia` directly in server components for theming.
   - If the app already uses `next-themes`, continue using it for theme state.
   - If you must access theme in a client component, use the existing `ThemeProvider` API (e.g. `useTheme()`).

---

## 2. Root Layout & Theme Provider Rules

Whenever you touch **root layout** or **global providers**:

1. **Root layout structure (App Router)**

   - `app/layout.tsx` (or equivalent) must have:

     ```tsx
     export default function RootLayout({ children }: { children: React.ReactNode }) {
       return (
         <html lang="en" suppressHydrationWarning>
           <body className="min-h-screen bg-background text-foreground antialiased">
             {/* ThemeProvider should wrap the app if theming system uses one */}
             {/* Example: <ThemeProvider ...>{children}</ThemeProvider> */}
             {children}
           </body>
         </html>
       );
     }
     ```

   - If a `ThemeProvider` exists, it should wrap `children` here or in a top-level `app/providers.tsx`.

2. **ThemeProvider consistency**

   - If the project uses `next-themes` or similar, maintain its configuration and **do not radically change it**.
   - Typical safe config (for reference only – adjust to existing setup):

     ```tsx
     <ThemeProvider
       attribute="class"
       defaultTheme="system"
       enableSystem
       disableTransitionOnChange
     >
       {children}
     </ThemeProvider>
     ```

   - When editing, ensure you **do not remove**:
     - `attribute="class"` if Tailwind `dark:` is used.
     - `suppressHydrationWarning` on `<html>` if theme changes client-side.

---

## 3. Design Tokens & Colors

You must treat **design tokens** as the stable foundation for theming.

### 3.1 When Tailwind + tokens exist

If there is `tailwind.config` and tokens like `background`, `foreground`, `card`, etc.:

- Always use **semantic classes**:
  - `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.
- When you see raw Tailwind colors like `bg-white`, `bg-slate-900`, `text-gray-500`:
  - Replace them with the closest semantic token that makes sense.
- When creating new components or layouts:
  - Start from tokens, not from raw Tailwind palette.

### 3.2 When CSS variables exist

If the project uses CSS variables like `--background`, `--foreground`, etc.:

- Use these variables in CSS or inline styles:
  - `background-color: var(--background);`
  - `color: var(--foreground);`
- In JS/TS styling solutions (styled-components/emotion), also rely on these variables instead of hard-coded hex values.

### 3.3 Adding or editing tokens

- Prefer **adjusting token values** over sprinkling new hard-coded colors.
- Only introduce new tokens (e.g. `--accent`, `--accent-foreground`) if:
  - You actually need a new role (primary CTA, destructive, warning, etc.), and
  - You add them to both light and dark theme definitions.

---

## 4. Component-Level Rules

Whenever you add or modify a component (pages, layouts, UI components):

1. **Background & text**

   - Use semantic tokens:
     - Root/main: `className="min-h-screen bg-background text-foreground"`.
     - Cards/panels: `bg-card text-card-foreground`.
     - Subtle areas: `bg-muted text-muted-foreground`.
   - Do not hard-code backgrounds like `bg-white` or `bg-black` unless:
     - It is for overlays (e.g. `bg-black/50`), and they look okay in both modes.

2. **Buttons and clickable elements**

   - Use design-system button components if available (e.g. `Button` from shadcn/ui).
   - If manually styling:
     - Primary: semantic `bg-primary text-primary-foreground`.
     - Secondary: `bg-muted text-foreground`.
   - Ensure hover/focus styles do not reduce contrast in either theme.

3. **Inputs / forms**

   - Background: `bg-background` or `bg-card`.
   - Border: `border-input` or equivalent token.
   - Text: `text-foreground`.
   - Placeholder: `placeholder:text-muted-foreground` or token-based equivalent.

4. **Typography**

   - For main content: `text-foreground`.
   - For secondary/subtle content: `text-muted-foreground`.
   - Avoid fixed grays like `text-gray-600` when tokens exist.

5. **Icons & SVG**

   - Prefer icons that use `currentColor`, so they automatically match the surrounding text color.
   - Do not hard-code fill/stroke colors that only look good in one theme.

6. **Images / logos**

   - If the project already uses theme-specific assets (e.g. different logos for dark mode), preserve that pattern.
   - If necessary, render different assets based on resolved theme using existing theme API.
   - Avoid duplicating entire components just to switch images; only the asset or small wrapper should be conditional.

---

## 5. Layout & Refactor Safety Rules

When changing layouts or restructuring:

1. **Preserve theme context**

   - If a parent section is responsible for background/text context (e.g. `section` with `bg-background`), keep that responsibility at an appropriate level.
   - Do not move children out of a themed container into a neutral one without also giving them proper background/text tokens.

2. **Minimize theme-specific branches**

   - Avoid `if (isDark) return <DarkComponent />; else return <LightComponent />;`.
   - Prefer a single component using tokens or theme-aware variants.

3. **Keep wrappers that affect theme**

   - Do not remove, flatten, or “simplify” components that:
     - Add theme classes (like `.dark`, `bg-background`, `text-foreground`).
     - Provide theme-related context (e.g. `ThemeProvider`, layout wrappers with semantic colors).

4. **Local overrides**

   - If you must override theme in a specific area (e.g. a special section with its own palette), still:
     - Use a separate set of tokens (like `bg-accent`) instead of hard-coded colors when possible.
     - Make sure those tokens are defined for both light and dark modes.

---

## 6. What Not to Do

You must **avoid** the following unless explicitly instructed otherwise:

- ✗ Introducing a second theme context or provider alongside the existing one.
- ✗ Hard-coding colors directly in JSX, CSS, or Tailwind classes when tokens exist.
- ✗ Removing existing `bg-*` / `text-*` / `dark:*` classes without replacing them with equivalent token-based alternatives.
- ✗ Creating entirely separate components for light and dark variants (e.g. `HeaderLight` and `HeaderDark`).
- ✗ Accessing browser-only APIs for theme in server components.
- ✗ Changing the `darkMode` strategy in Tailwind (e.g. from `"class"` to `"media"`) unless instructed and updated throughout.

---

## 7. Theming Checklist (Run This After Every UI Change)

After you modify layouts, pages, or components, mentally run through this checklist:

1. **Tokens used?**
   - Did I use semantic tokens instead of raw colors for backgrounds, text, borders, and key UI parts?

2. **Both themes okay?**
   - Would this look correct in **both** light and dark mode? (Assume tokens are properly defined for both.)

3. **Theme wrappers preserved?**
   - Did I keep `ThemeProvider`, root `bg-background text-foreground`, and other critical theme containers intact?

4. **No duplicate theming logic?**
   - Did I avoid creating new theme providers or branching entire components per theme?

5. **Contrast & readability**
   - Are headings, text, buttons, and inputs readable, with good contrast, in both themes?

If any answer is “no” or uncertain, **fix the theming first** before considering the change done.

---

## 8. Summary for Cursor / AI Assistant

When working in this codebase:

- **Always respect and extend the existing theming system** instead of introducing new ones.
- **Always use semantic design tokens** for colors and backgrounds instead of raw values.
- **Always keep layout and wrappers that define theme context** intact when refactoring.
- **Always check your changes for both light and dark modes conceptually**, even if you cannot visually see them.

Your highest priority in UI work is to keep **light and dark mode visually consistent, predictable, and easy to maintain**.
````


