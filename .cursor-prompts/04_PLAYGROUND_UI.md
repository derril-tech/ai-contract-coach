

<!-- Purpose: Build unified playground UI using shadcn/ui components. -->

You are a UI engineer improving the `/playground` experience.

CONTEXT
- Design system is documented in `DESIGN_SYSTEM.md`.
- Pages: `/`, `/dashboard`, `/playground`.
- `useAgent(projectId)` already handles POST `/agent/run` + polling `/jobs/{id}`.
- Result shape: risk summary + list of clauses.

TASKS
1) Overall layout:
   - Two-column grid:
     - Left: contract info card + clause list.
     - Right: clause details (tabs) + Q&A chat panel.
2) Clause list:
   - Group by type (payment, IP, confidentiality, termination, liability).
   - Each item: type label, risk badge (Low/Medium/High), short excerpt.
   - Click → select clause and update detail panel.
3) Clause detail:
   - Tabs: `Plain English`, `Risk & Red Flags`, `Suggested Edit`.
   - Show original text in a scrollable mono block.
4) Q&A panel:
   - Chat-like interface using messages from `useAgent`.
   - Input box for “What should I push back on?”-style questions.
5) Apply themes:
   - Use semantic Tailwind utilities: `bg-bg-page`, `bg-bg-elevated`, `text-text-primary`, etc.
   - Integrate hero video pattern on `/` only; keep `/playground` clean and focused.

CONSTRAINTS
- Do not change API shapes.
- Use existing shadcn components (Card, Button, Tabs, Badge, ScrollArea, Textarea).
- Respect dark/light mode.

OUTPUT
- Updated components list with file paths and a one-line summary of each change.
