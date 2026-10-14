# Agent instructions

Read `docs/AGENT_INSTRUCTIONS.md` first, then `docs/DESIGN_SYSTEM.md`, `docs/INTERACTION_SYSTEM.md`,
`docs/INFORMATION_ARCHITECTURE.md`, `docs/POSITIONING.md` and `docs/BUILD_LOG.md`.

`docs/BUILD_LOG.md` records decisions that supersede parts of `docs/IMPLEMENTATION_PLAN.md`
(stack: Astro + React islands + Tailwind v4).

## Development

Start the dev server in background mode: `npx astro dev --background`
(`astro dev stop`, `astro dev status`, `astro dev logs`).

## Rules that are easy to break

- Colours, type, spacing and motion come from tokens in `src/styles/global.css`. Do not add raw hex values in components.
- Every technical annotation must be real data (build info, real anchors, config flags), never decorative fake data.
- Layer 2 (keyboard, palette, hero interaction) is optional; everything must work with pointer/touch and without JS.
- No placeholder content. Project facts must be publishable; Medical Navigator: only facts verifiable on the live public site.

Astro docs: https://docs.astro.build
