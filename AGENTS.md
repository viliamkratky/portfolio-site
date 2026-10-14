# Agent instructions

Read `docs/AGENT_INSTRUCTIONS.md` first, then `docs/DESIGN_SYSTEM.md`, `docs/INTERACTION_SYSTEM.md`,
`docs/INFORMATION_ARCHITECTURE.md`, `docs/POSITIONING.md` and `docs/BUILD_LOG.md`.

`docs/BUILD_LOG.md` records decisions that supersede parts of `docs/IMPLEMENTATION_PLAN.md`
(stack: Astro + React islands + Tailwind v4).

## Development

Start the dev server in background mode: `npx astro dev --background`
(`astro dev stop`, `astro dev status`, `astro dev logs`).

`astro dev` does not run `functions/` (the contact endpoint). To test it, copy `.dev.vars.example` to `.dev.vars` and
run `PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run preview:pages` (port 8788, Turnstile test keys,
messages logged instead of sent). Never put production keys in `.dev.vars` or in the repository.

## Git workflow

Pushing to `main` deploys to production (Cloudflare Pages), so never commit or push directly to `main`.

1. Create a branch from `main` before making any change.
2. Commit there and test it (`npx astro build`, then check the result in the dev server or a preview).
3. Merge into `main` only after the change is verified to work.

## Rules that are easy to break

- Colours, type, spacing and motion come from tokens in `src/styles/global.css`. Do not add raw hex values in components.
- Every technical annotation must be real data (build info, real anchors, config flags), never decorative fake data.
- Layer 2 (keyboard, palette, hero interaction) is optional; everything must work with pointer/touch and without JS.
- No placeholder content. Project facts must be publishable; Medical Navigator: only facts verifiable on the live public site.

Astro docs: https://docs.astro.build
