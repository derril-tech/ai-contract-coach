

<!-- Purpose: Polish visuals, responsiveness, and accessibility without changing architecture or routes. -->

You are a UI engineer refining an existing Next.js 15 + Tailwind + shadcn/ui app.

CONTEXT
- Use `.cursorrules` and `DESIGN_SYSTEM.md` as the visual source of truth.
- Frontend routes and components already exist (`/`, `/dashboard`, `/playground`).

TASKS
1) Visual polish:
   - Enforce consistent spacing scale and radii across cards, forms, and layout.
   - Apply light/dark theme tokens and ensure contrast meets WCAG AA.
   - Use a single accent (soft green) for primary actions and key status indicators.
2) Layout:
   - Ensure layouts are responsive from 360px to 1440px+.
   - Avoid horizontal scrolling; use grids/flex with sensible wrapping.
3) Accessibility:
   - Add labels, aria attributes, and visible focus states.
   - Respect `prefers-reduced-motion` for hero animations.
4) Micro-interactions:
   - Use Framer Motion for subtle card hover/hero entrance animations.
   - Avoid heavy or distracting animations.

CONSTRAINTS
- Do not modify API contracts or backend behavior.
- Keep diffs small and focused.

OUTPUT
- List of updated UI files with a brief explanation and before/after behavior.
