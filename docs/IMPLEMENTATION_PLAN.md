# Implementation Plan

> **Update 2026-10-14:** the stack decision (§4.1, §4.3, §4.4) was superseded: the site is built with Astro + React islands + Tailwind v4. See `docs/BUILD_LOG.md`.

Status: proposal, analysis only. Nothing in the repository has been changed except this file.
Date: 2026-10-04

This document turns the direction in `/docs` into a buildable plan. It is written so that an AI coding agent can execute it one task at a time.

**Document precedence.** `DESIGN_SYSTEM.md` > `INTERACTION_SYSTEM.md` > `INFORMATION_ARCHITECTURE.md` > `POSITIONING.md` > this file. If this plan contradicts one of those documents, the document wins, unless section 3 of this plan explicitly flags the contradiction and the owner has resolved it.

---

## 0. How to use this plan (for agents)

1. Read `AGENT_INSTRUCTIONS.md`, then the four system documents, then this file.
2. Execute exactly one task ID (e.g. `5.3`) per session unless told otherwise.
3. Do not start a phase whose "Depends on" list is not satisfied.
4. Do not start any task that depends on an open item in section 3.1 ("Must decide"). Stop and ask.
5. Every task must pass the **Definition of Done** in section 5.0 before it is considered complete.
6. When a task resolves a decision, write the decision into the document that owns it (see section 6), not into chat.

---

## 1. Synthesis: what this site is

### 1.1 Professional positioning

The owner is not selling a technology. The claim is **range with quality at every layer**: the same person can take an ambiguous problem, shape it into a product, design the interface, and build and ship the system underneath. "Design-minded Full-stack Software Engineer & Product Builder" is the label; *"Design quality on the surface. Real engineering underneath."* is the argument.

That argument has a structural consequence: the site cannot merely *say* it. Every layer of the claim needs visible evidence, and the website itself is the first exhibit. Drupal, AI and specific frameworks are supporting evidence, deliberately kept out of the identity.

The weakest point of this positioning is breadth. Five capability areas can read as "does everything". The site must counter that with depth of evidence, not with more capability copy.

### 1.2 Visual identity

A warm, dark, restrained **product interface**, not a portfolio template and not a terminal. Roughly 85% premium product design and 15% technical language. Identity comes from structure (grid, alignment, thin borders, typographic contrast, mono annotations) more than from color or a logo. Atmosphere (grain, warm light, depth) is reserved for a few large surfaces. The orange accent is a signal, used for state and emphasis, never as a fill.

The defining contrast is **spacious page composition around information-dense components**: big quiet layouts that contain small, precise, product-grade UI.

### 1.3 Interaction model

Two strictly separated layers:

- **Layer 1, the website.** Links, scrolling, touch, forms. Complete on its own, including without JavaScript.
- **Layer 2, the instrument.** Command palette, `:` commands, Vim-style keys, shortcuts, the explorable hero, a small set of easter eggs. Optional, discoverable, and always a different interface to the same structure, never a second architecture.

The intended reaction is "this behaves like real software", not "this pretends to be a terminal".

### 1.4 Information architecture

Small and flat: `/`, `/work`, `/work/[project]`, `/services`, `/about`, `/contact`. Depth comes from **progressive disclosure** (home = summary, work index = snapshot, case study = evidence), not from more pages. Resume, GitHub and LinkedIn are utilities. `/notes` and search do not exist until content justifies them. Three audiences (hiring, clients, peers) share one structure; they differ in how deep they go, not where they go.

### 1.5 Quality bar

Raycast-level craft is the visual benchmark, with Linear/Vercel restraint. In practice that means: no weak states (hover, focus, active, empty, loading, error), no sloppy spacing at any breakpoint, typographic hierarchy with real contrast, and performance treated as a feature. The bar applies to the code as much as the pixels: the repository is itself evidence and may be read by technical reviewers.

### 1.6 Role of gamification

Gamification here means **curiosity rewarded with real information**: discovering that the site responds to the keyboard, that a command exists, that the hero can be taken apart. Every discovery should reveal something true about the owner's work or the system itself. No points, XP, badges or progress.

### 1.7 Explicitly avoided

Terminal cosplay, fake OS desktops, Matrix green, typewriter text, skill bars, card grids everywhere, giant gradient blobs, glowing everything, centered SaaS hero, pills everywhere, generic glassmorphism, random 3D, scroll hijacking, bouncing motion, agency language, AI-hype language, and copying any reference's layouts or assets.

---

## 2. Repository audit

### 2.1 What exists

```text
portfolio_web/
├── docs/
│   ├── AGENT_INSTRUCTIONS.md       3.9 KB
│   ├── DESIGN_SYSTEM.md           14.9 KB
│   ├── INFORMATION_ARCHITECTURE.md 9.5 KB
│   ├── INTERACTION_SYSTEM.md       9.4 KB
│   ├── POSITIONING.md              7.3 KB
│   ├── COMPONENT_RULES.md          0 B  (empty)
│   └── CONTENT_STRATEGY.md         0 B  (empty)
└── references/
    └── inspiration.md              0 B  (empty)
```

| Area | Finding |
|---|---|
| Tech stack | None. No `package.json`, no source, no lockfile. |
| Version control | Not a git repository. |
| Framework / app structure | None. |
| Styling approach | None in code. Tokens exist only as prose in `DESIGN_SYSTEM.md`. |
| Components | None. |
| Routing | None in code. Target routes defined in `INFORMATION_ARCHITECTURE.md`. |
| UI / motion / 3D libraries | None installed. |
| Fonts / assets | None. No images, no resume PDF, no favicon, no OG imagery. |
| Design system | Documented only (`DESIGN_SYSTEM.md`). Not implemented. |
| Responsive setup | None. |
| Accessibility setup | None. |
| Testing / linting / formatting | None. |
| Performance configuration | None. |
| Deployment | None. No hosting, domain or CI defined. |

This is a greenfield project. There is nothing to migrate and no legacy conflict in code. All conflicts are between documents, or between documents and external facts.

### 2.2 External facts that affect the plan

**Project archive.** Case-study material lives in a private archive as structured data (`project.yaml`, schema v1) with explicit publication permissions per project. Only projects cleared for publication may appear on the site; the archive itself (including the list of uncleared projects) is not part of this repository.

This is the largest risk in the whole project: **the site is designed around case studies, and few are currently publishable.** See section 7.1.

The archive's `project.yaml` is a good basis for the site's content model (section 4.3), as long as permissions are enforced at build time.

**Token contrast (computed, WCAG 2.x).**

| Token | on `--bg-primary` #0B0B0A | on `--bg-hover` #1D1B18 | Verdict |
|---|---|---|---|
| `--text-primary` #F2F0E9 | 17.3 | 15.1 | pass |
| `--text-secondary` #A09C92 | 7.2 | 6.3 | pass |
| `--text-muted` #68655E | **3.4** | **3.0** | **fails AA for body/metadata text** |
| `--accent-primary` #FF7448 | 7.4 | 6.4 | pass, also valid as focus ring |
| `--accent-muted` #A95335 | 3.7 | 3.3 | large text / non-text only |
| `--border-strong` #474239 | 2.0 | 1.7 | fails 3:1 for input boundaries |

The documented 11–13px mono metadata will very likely be set in `--text-muted`, which fails. Fix: introduce a readable tertiary text (about `#86837C`, 5.2:1 on `bg-primary`, 4.5:1 on `bg-hover`) and keep `#68655E` for disabled and decorative use only. Interactive boundaries (inputs, the palette field) need a border of at least 3:1 (about `#6B655A`).

### 2.3 Conflicts and inconsistencies in `/docs`

| # | Conflict | Where | Recommended resolution |
|---|---|---|---|
| C1 | `--text-muted` fails contrast, but accessibility requires sufficient contrast | DESIGN_SYSTEM §5 vs §29 | Add `--text-tertiary` (~#86837C). Restrict `--text-muted` to disabled/decorative. |
| C2 | Hero layer keys: `1–4` vs `1–5`; DESIGN_SYSTEM lists 5 layers but 4 keys | DESIGN_SYSTEM §23 vs INTERACTION §18 | Five layers, keys `1–5`, active only while the hero is focused or in view. |
| C3 | `g c` (contact) missing from DESIGN_SYSTEM | DESIGN_SYSTEM §17 vs INTERACTION §7 | Include `g c`. |
| C4 | Command naming: `:projects` vs route and label "Work" | DESIGN_SYSTEM §16, IA §17 | Canonical `:work`; `:projects` and `:ls projects` as aliases. IA §17 forbids a second vocabulary. |
| C5 | Theme commands (`:theme light`) but only a dark palette exists | DESIGN_SYSTEM §5, §16 | Decide in M4. Recommended: dark-only at launch, no theme commands until a light theme exists. |
| C6 | `/` opens search, but there is too little content for search, and Firefox uses `/` for quick find | INTERACTION §7, IA §18, INTERACTION §10 | `/` opens the palette with the filter focused. Accept the Firefox override as an established web convention (GitHub, YouTube); quick find stays on `Ctrl/⌘+F`. |
| C7 | Single-character shortcuts (`j`, `k`, `g`, `?`, `:`, `1–5`) vs WCAG 2.1.4 Character Key Shortcuts | INTERACTION §7 vs §11 | Provide an off switch in the shortcut overlay (persisted), and scope number keys to the hero. |
| C8 | Hero "subtle scroll interaction" vs "no scroll hijacking" | INTERACTION §18 vs DESIGN_SYSTEM §24 | Scroll may *drive* state (scroll-linked, no pinning, no snapping). It may never capture or delay scrolling. |
| C9 | Status elements (`● AVAILABLE`, `BUILD 2026.10`) without a source of truth | DESIGN_SYSTEM §19, INTERACTION §13 | Every status value must come from real data (build metadata, a config flag the owner controls). See §7.2. |
| C10 | `COMPONENT_RULES.md`, `CONTENT_STRATEGY.md`, `references/inspiration.md` are empty but present | `/docs`, `/references` | Fill `CONTENT_STRATEGY.md` first (Phase 0). Fill `COMPONENT_RULES.md` in Phase 4. Fill or delete `inspiration.md`. |
| C11 | `AGENT_INSTRUCTIONS.md` names only `DESIGN_SYSTEM.md` as required reading | AGENT_INSTRUCTIONS | Add the reading order and precedence from the top of this file. |

---

## 3. Unresolved decisions

Only decisions not already settled in `/docs` are listed. Each has a recommendation and the phase that needs it.

### 3.1 Must decide before implementation

| ID | Decision | Options | Recommendation | Needed by |
|---|---|---|---|---|
| M1 | **Framework / rendering model** | Astro (static, islands) · Next.js (React, App Router) · SvelteKit · hand-rolled Vite | **Astro, static output.** Details and comparison in §4.1. | Phase 1 |
| M2 | **Content inventory and permissions:** which projects can be shown, at what depth (full / anonymized / mention only), and which 3–4 are featured | per project | Inventory every archive project; seek written permission for the 2–3 strongest; plan anonymized, diagram-only case studies for the rest; make **this portfolio** and **Decision Watchdog** (self-owned) the guaranteed case studies. | Phase 0 (blocks Phases 5–6) |
| M3 | **Language(s)** | English only · English + Slovak | **English only at launch.** No i18n machinery. Revisit if Slovak SMB clients become a primary audience. | Phase 1 |
| M4 | **Theme scope** | Dark only · Dark + light | **Dark only at launch.** Remove `Change Theme` / `:theme` until a designed light theme exists. A light theme doubles visual QA of every state. | Phase 2 |
| M5 | **Hero concept** | Generic "five-layer stack" · **exploded view of this site itself** · other | **Exploded view of this site.** The five layers (Design, Frontend, Backend, AI, Infra) each show a real artifact of the page the visitor is looking at. See §4.6. | Phase 3 |
| M6 | **Typeface** | Geist Sans + Geist Mono (documented preference) · a less ubiquitous grotesk + Geist Mono · licensed grotesk (Söhne / ABC Diatype class) | Run the Phase 2 specimen with **Geist** and **one alternative sans**, keep Geist Mono. Geist is now the default face of Vercel/v0-generated sites, which works against "not AI-generated". Decide on the specimen, and decide whether a paid licence is acceptable. | Phase 2 |
| M7 | **Token corrections** | as documented · corrected | Accept C1 corrections (`--text-tertiary`, 3:1 input border). | Phase 2 |
| M8 | **Public identity:** display name, initials / brand mark, domain | | Owner's decision. Needed for the header, metadata, OG images, and the hero. | Phase 1 (domain), Phase 4 (mark) |
| M9 | **Hosting** | Cloudflare Pages / Netlify / Vercel (managed static) · self-managed S3 + CloudFront via Terraform | **Managed static host + GitHub Actions** as the build and quality-gate pipeline. Self-managed IaC is real evidence but is permanent maintenance for a static site; reconsider only if it becomes a case study in its own right. | Phase 1 |
| M10 | **Analytics and privacy** | none · cookieless (Plausible / Umami / host analytics) · GA | **Cookieless or none.** Anything needing a consent banner contradicts the product-quality goal. | Phase 1 |
| M11 | **Single-key shortcut policy** (C7) | always on · on with off-switch · opt-in | **On by default for pointer-and-keyboard devices, with an off switch** in the `?` overlay, persisted in `localStorage`. | Phase 9 (architecture known from Phase 1) |

### 3.2 Can decide during implementation

| ID | Decision | Default to use unless changed | Decided in |
|---|---|---|---|
| D1 | Exact type scale values within the documented ranges | Fluid `clamp()` per documented range | 2.2 |
| D2 | Final motion tokens (durations, easing curves) | 160 / 220 / 400 / 640ms; one ease-out, one ease-in-out | 2.3 |
| D3 | Grain implementation details | Pre-rendered tile, see §4.7 | 2.5 |
| D4 | Icon system | Lucide subset at 1.5px stroke, inlined at build, plus custom glyphs on the same 24px grid | 2.6 |
| D5 | Homepage composition details | Order from IA §5; layout decided against real content | 6.x |
| D6 | Work index layout | Indexed list rows, not a card grid | 5.6 |
| D7 | Case-study block set | Derived from the first real case study | 5.3 |
| D8 | What `j`/`k` move between on each page type | §4.5 | 9.6 |
| D9 | CLI command list and easter eggs | ≤ 12 commands, ≤ 5 discovery commands, each returning real content | 9.4, 9.9 |
| D10 | Mobile navigation pattern | Top bar + menu button opening a full-height native `<dialog>` that includes a search/command entry | 4.3 |
| D11 | Contact form | **No form.** Visible email, copy-to-clipboard, LinkedIn. A form needs a backend, spam handling and a privacy notice for little gain. | 7.3 |
| D12 | Resume format | Static PDF in `/public`, linked from About, footer and palette | 7.4 |
| D13 | Availability status | Single boolean in site config; the element is hidden when false | 4.4 |
| D14 | OG image approach | Per-page static images designed once from the visual grammar; generate at build only if the page count grows | 13.2 |
| D15 | Page transitions | Native cross-document View Transitions, CSS only | 4.7 |
| D16 | WebGL | Not used, unless the Phase 3 spike fails its criteria (§4.6) | 3.2 |

---

## 4. Implementation strategy

### 4.1 Stack

**Recommendation: Astro (current stable major), static output, TypeScript strict, no UI framework at launch.**

| Criterion | Astro static | Next.js |
|---|---|---|
| JS shipped for Layer 1 | 0 KB by default | React runtime on every page (~45–60 KB gz minimum) |
| Progressive enhancement | Native: HTML first, islands opt in | Possible, but against the grain of the framework |
| Content (MDX case studies + typed data) | Content collections with Zod schemas | Possible, more assembly |
| Interactive pieces (palette, hero) | Vanilla TS custom elements or a framework island | React components |
| "Shows I can build React products" | Weaker signal | Stronger signal |
| Fit for this site | Very high | Medium |

The React-signal argument is real but weak: the evidence of product engineering should come from case studies, not from the framework of a mostly-static site. A site that ships near-zero JS and still feels like an application is a stronger demonstration than a React bundle.

Interactive pieces are written as **vanilla TypeScript custom elements** (`<command-palette>`, `<system-hero>`). Escape hatch: if the palette's state becomes hard to manage, move that single island to Preact (~4 KB). Do not add React.

Supporting tooling:

- Package manager: pnpm. Node: current LTS pinned in `.nvmrc` and `engines`.
- Type checking: `astro check` + `tsc --noEmit`, `strict: true`.
- Formatting: Prettier + `prettier-plugin-astro`.
- Linting: ESLint flat config with `eslint-plugin-astro` and `eslint-plugin-jsx-a11y` (Astro templates). Keep the rule set small.
- Unit tests: Vitest, for pure logic only (command parsing, fuzzy matching, key sequences, permission guards, token contrast).
- End-to-end: Playwright + `@axe-core/playwright`, covering keyboard flows, overlays, reduced motion and mobile viewports.
- Budgets: Lighthouse CI in GitHub Actions with assertions (§4.11).
- No Tailwind (see §4.3), no GSAP, no Lenis, no Framer Motion, no three.js, no fuse.js, no headless UI kit.

> Note: the knowledge shelf (`second-brain/tools/frontend/web-animation.md`) documents Lenis and GSAP. They were considered and are deliberately **not** recommended here: Lenis changes native scrolling, which conflicts with the no-hijacking rule; GSAP is not justified while CSS and the Web Animations API cover the planned motion. Revisit GSAP only if hero choreography outgrows WAAPI.

### 4.2 Component architecture

```text
src/
├── config/
│   ├── site.ts              # name, links, availability flag, nav order
│   └── routes.ts            # route manifest: single source for nav, palette, j/k, footer
├── content/
│   ├── config.ts            # Zod schemas
│   └── projects/            # one MDX per publishable project (+ frontmatter from archive)
├── styles/
│   ├── tokens.css           # all design tokens
│   ├── reset.css
│   ├── base.css             # element defaults, typography classes
│   └── layers.css           # @layer order declaration
├── components/
│   ├── primitives/          # Container, Grid, Section, Text, Icon, Kbd, Link, Button
│   ├── surface/             # Panel, Grain, Glow, Rule (construction line), Annotation
│   ├── diagram/             # Node, Edge, Plane, Measure, Label: the visual grammar
│   ├── shell/               # Header, MobileMenu, Footer, SkipLink, StatusLine
│   ├── work/                # ProjectRow, ProjectMeta, case-study MDX blocks
│   └── home/                # page-specific compositions only
├── interactive/             # vanilla TS custom elements (lazy where possible)
│   ├── keys/                # keyboard manager, sequences, input guard, scopes
│   ├── commands/            # registry, parser, matcher, CLI handlers
│   ├── palette/             # <command-palette>
│   ├── help/                # <shortcut-help>
│   └── hero/                # <system-hero>
├── lib/
│   ├── build-info.ts        # commit, date, version: real data for status UI
│   └── permissions.ts       # publication guard
├── layouts/
│   ├── Base.astro
│   └── CaseStudy.astro
└── pages/                   # routes from IA §24 only, plus 404 and /lab (dev only)
```

Rules:

- **Primitives are dumb, compositions are specific.** No generic `Card` component with ten props. If two sections need similar UI, extract only after the second real use.
- **One source of truth for structure:** `routes.ts` + the content collection generate the header, footer, palette entries, CLI targets, `g x` shortcuts and the help overlay. This enforces IA §17 mechanically.
- **The visual grammar (`diagram/`) is the key reuse layer.** Custom visuals are compositions of a few primitives, not one-off illustrations (see §7.3).
- `/lab/*` routes (specimen, hero spike) are built only in development and never linked from production.

### 4.3 Styling and token strategy

**Plain CSS with custom properties, Astro scoped styles, cascade layers. No Tailwind.**

Comparison: Tailwind v4 is fast to write and token-capable, but this site is a small number of highly bespoke compositions where class strings become the design spec. Scoped CSS with semantic tokens keeps the design readable, keeps the token system the single source, and is itself evidence of CSS craft. Bundle size is not the deciding factor; legibility of the design system is.

- `@layer reset, tokens, base, components, utilities;` declared once.
- **Two token tiers only:** semantic tokens as named in `DESIGN_SYSTEM.md` (`--bg-primary`, `--text-secondary`, `--border-subtle`, `--accent-primary`…) plus component-local custom properties. A primitive tier (`--orange-500`) is added only if a light theme is ever built.
- Token groups: color, type (families, fluid sizes, line heights, tracking), space (the documented scale), radius, border, motion (durations, easings), z-index, layout (container widths, gutters, column count).
- Type scale: fluid `clamp()` values within the documented ranges; exposed as classes (`.t-display-xl` … `.t-meta`) because type styles combine size, leading, tracking and family.
- Layout: a 12-column CSS grid primitive with named span helpers for the documented asymmetric splits (7/1/4, 2/6/4). Container queries for component-level responsiveness; media queries only for page-level layout.
- Modern CSS used with `@supports` guards where needed: nesting, `:has()`, container queries, `color-mix()`, scroll-driven animations, `@view-transition`.
- A unit test parses `tokens.css` and asserts contrast for every declared text/background pair. Contrast stops being a manual check.

### 4.4 Motion

**CSS transitions and keyframes first, Web Animations API for sequenced or interruptible motion. No animation library.**

- Motion tokens: `--dur-1` 160ms, `--dur-2` 220ms (micro-interactions), `--dur-3` 400ms, `--dur-4` 640ms (larger transitions); `--ease-out`, `--ease-in-out`. No spring or bounce curves.
- Section reveals: CSS scroll-driven animations (`animation-timeline: view()`) inside `@supports`, limited to section-level elements and never per text line. Without support, content is simply static, which is acceptable.
- Pointer response: a single `pointermove` handler per interactive surface writes CSS variables inside `requestAnimationFrame`; CSS does the rest. Transform and opacity only.
- Page transitions: native cross-document View Transitions via CSS (`@view-transition { navigation: auto; }`). No client router. Browsers without support navigate normally.
- `prefers-reduced-motion: reduce` is handled globally in tokens (durations collapse to near zero for non-essential motion) and per component for parallax and pointer effects. Functional state changes (palette open, hero layer change) remain visible as instant changes or crossfades.

### 4.5 Keyboard system (Vim-style navigation)

One small, eagerly loaded module (target < 3 KB gz) owns all keyboard input.

- **Single `keydown` listener** on `document`.
- **Input guard:** ignore when the event target is `input`, `textarea`, `select`, `[contenteditable]`, or inside an element with `data-keys="off"`; ignore when `ctrlKey`/`altKey`/`metaKey` are held (except the explicit `⌘K`/`Ctrl+K` binding); ignore `event.isComposing`.
- **Scope stack:** `global` → `overlay` (palette or help open: only `Esc` and the overlay's own keys) → `hero` (number keys only when the hero has focus or is in view).
- **Sequence resolver** for `g` + key with an ~800ms timeout and a small visible pending indicator (`g…`) in the status line.
- **Bindings come from the registry** (§4.6), so help, palette and keys cannot drift apart.
- **`j` / `k` semantics:** move focus, not just scroll. Targets are declared in markup (`data-nav-item`): section headings on long pages, project rows on `/work`, case-study sections on project pages. Focus the target (`tabindex="-1"` on headings), scroll it into view (instant under reduced motion), and announce nothing extra because focus already does. Show a brief position marker in the margin.
- **Off switch** in the `?` overlay (M11), persisted; when off, only `⌘K`/`Ctrl+K` and `Esc` remain.
- **Discovery:** keyboard hints (`⌘K` in the header, `Press ? for shortcuts` in the footer) render only after the first real keyboard interaction, or on devices that report `(any-hover: hover) and (any-pointer: fine)`. This avoids advertising shortcuts to touch users.

### 4.6 Command system: palette, CLI and hero

**Registry.** A typed array of commands, generated at build from `routes.ts`, the projects collection and a handwritten list of actions:

```ts
type Command = {
  id: string;                 // "nav.work"
  title: string;              // "Go to Work"
  group: "Navigation" | "Work" | "External" | "Interface" | "Discover";
  keywords?: string[];
  cli?: string[];             // ["work", "projects", "ls projects"]
  shortcut?: string[];        // ["g", "w"]
  run: CommandAction;         // navigate | open-external | copy | show-panel | toggle
};
```

**Palette.**

- Native `<dialog>` opened with `showModal()`: free focus containment, `inert` background, `Esc` handling, top layer. No focus-trap library.
- WAI-ARIA combobox pattern: `input[role=combobox]` + `role=listbox`, `aria-activedescendant`, arrow keys, `Enter`, `Esc`, `Home`/`End`.
- Matching: a small handwritten scorer (prefix > word-start > subsequence) over fewer than 50 items. No fuzzy-search dependency.
- Groups as listed in INTERACTION §5; empty state; focus returns to the invoking element on close.
- Loading: the trigger button and key listener are eager; the palette module is a dynamic `import()` prefetched on idle and on trigger hover or focus, so the first `⌘K` opens instantly.
- Without JavaScript the header trigger is not rendered; navigation is unaffected.

**CLI mode.** Not a second input. Typing `:` as the first character in the palette (or pressing `:` anywhere) switches the same palette into command mode:

- Parser: `:verb [args]` with aliases from the registry; `:open <project>` completes project slugs.
- Results render as **structured panels in the palette** (key/value rows, short lists, links), not as simulated terminal scrollback.
- Unknown command: `command not found: foo`, followed by the closest matches.
- Discovery commands (≤ 5), each returning true information:
  - `:whoami`: one-paragraph identity and links
  - `:stack`: actual tools in daily use, grouped
  - `:history`: a real timeline derived from project data
  - `:system`: real build info (commit, build date, pages, JS shipped, host)
  - `:grid`: toggles the real construction overlay of the 12-column grid. It is a joke that is also a demonstration of the layout system.

**Feedback.** A single polite `aria-live` status line (bottom-left on desktop) shows short confirmations ("Opened Work", "Copied email"). No toasts stacking.

**Hero (M5 recommendation): "this page, exploded".**

- A stack of five thin planes in CSS 3D (`perspective`, `rotateX/Y`, `translateZ`), each a real DOM/SVG layer:
  1. **Design:** the actual grid, type scale and token swatches of this page
  2. **Frontend:** the real component tree of the hero itself
  3. **Backend:** the content schema and routes that generated the page
  4. **AI:** how AI is used in the owner's workflow, with real Decision Watchdog output (if cleared)
  5. **Infra:** the real pipeline that shipped this build: commit → CI gates → deploy, with real build data
- Default state is a calm, legible composition that communicates "interface to infrastructure" with no interaction at all.
- Controls: a visible, labelled ARIA **tablist** (Design / Frontend / Backend / AI / Infra). Arrow keys within the tablist; `1–5` as scoped shortcuts; pointer hover separates planes slightly; subtle pointer-driven tilt (≤ 6°).
- Why CSS 3D over WebGL: crisp real text, accessible content, zero 3D runtime, trivial reduced-motion fallback (flat, stacked panels). WebGL (OGL, not three.js) is considered only if the Phase 3 spike fails on depth or lighting quality.
- Mobile: planes become a vertical, swipeable or segmented sequence with the same tablist. No tilt.

This concept is the strongest available way to make the hero *evidence* rather than decoration, and it avoids both a Raycast-style glossy object and a Resend-style cube.

### 4.7 Grain, light and texture

- **Grain:** one pre-rendered, tileable noise texture (256px, grayscale, under 10 KB) applied as a pseudo-element overlay with opacity tokens (`--grain-1` 2%, `--grain-2` 4%). Generated once from `feTurbulence` and committed. **No live SVG filters** over large areas: they repaint on scroll and are expensive on mobile.
- **Pointer grain reveal:** a second layer whose `mask-image: radial-gradient(...)` follows CSS variables set from `pointermove`. Composited, cheap, and disabled under reduced motion.
- **Light:** `radial-gradient` glows on a few named surfaces only, with one consistent warm key light direction across the site. Treat it as a light source with a position, not as a per-component glow.
- `prefers-reduced-transparency` (where supported) removes blur and translucent layering.

### 4.8 Accessibility

- Semantic landmarks, one `h1` per page, skip link, `lang="en"`.
- Visible focus via `:focus-visible` using the accent at ≥ 2px with offset (7.4:1 contrast).
- Contrast enforced by tokens test (§4.3), including the C1 fix.
- Overlays: native `<dialog>`, `Esc` closes, focus returns, background inert.
- Hero tablist and palette combobox follow WAI-ARIA Authoring Practices patterns exactly.
- Character-key shortcuts can be turned off (WCAG 2.1.4).
- Hover-only reveals always have a focus and tap equivalent.
- Decorative visuals `aria-hidden`; informative diagrams get a text equivalent (a caption or a visually hidden description).
- Automated: axe on every route and overlay state in Playwright. Manual before launch: VoiceOver + Safari, NVDA + Firefox, keyboard-only pass, 200% zoom, Windows forced colors.

### 4.9 Responsive behaviour

- Test widths: 375, 768, 1024/1280, 1600+ (the four in AGENT_INSTRUCTIONS).
- Page layout recomposes at two or three breakpoints. Components respond to their container, not the viewport.
- Mobile recomposes rather than hides: the hero becomes a sequence, dense panels become stacked key/value lists, the grid becomes 4 columns with the same rhythm.
- Keyboard hints hidden on touch (§4.5); the palette remains reachable from the mobile menu as "Search".

### 4.10 Progressive enhancement

| Capability | Without JS | With JS | Without modern CSS |
|---|---|---|---|
| Navigation, content, links | Full | Full | Full |
| Hero | Static, legible default composition with all five layers readable | Tabs, tilt, layer separation | Flat stacked panels |
| Palette / CLI / keys | Absent (trigger not rendered) | Full | Full |
| Section reveals | Static | Static | Static |
| Page transitions | Normal navigation | Normal navigation | Normal navigation |

The site must be launchable at the end of Phase 7 with Layer 1 only.

### 4.11 Performance strategy and asset loading

Proposed budgets (enforced in Lighthouse CI, recorded in `TECHNICAL_ARCHITECTURE.md`):

| Metric | Budget |
|---|---|
| JS on initial load, homepage | ≤ 25 KB gz (keys + hero); palette chunk ≤ 15 KB gz, lazy |
| JS on initial load, other pages | ≤ 8 KB gz |
| CSS total | ≤ 30 KB gz |
| Fonts | ≤ 2 preloaded WOFF2 files (sans variable + mono), Latin + Latin Extended subsets, ≤ 100 KB total |
| LCP (mobile, simulated 4G) | ≤ 2.0 s |
| CLS | ≤ 0.02 |
| INP | ≤ 150 ms |
| Total homepage transfer | ≤ 400 KB |
| Lighthouse performance / a11y / best practices / SEO | ≥ 95 / 100 / 100 / 100 |

Loading rules:

- Fonts self-hosted, preloaded, `font-display: swap`, metric-matched fallbacks (`size-adjust`, `ascent-override`) to avoid layout shift.
- Images through Astro's image pipeline: AVIF/WebP, explicit dimensions, `loading="lazy"` below the fold, `fetchpriority="high"` only on a real LCP image.
- Scripts are Astro-bundled modules (deferred by default). Heavy islands use `client:visible` / dynamic import.
- No third-party scripts at launch, except cookieless analytics if chosen (M10).
- Security and caching headers configured at the host (`_headers` or equivalent): CSP, HSTS, long-cache immutable assets. Part of the "infrastructure" evidence.
- Build metadata (commit, date, JS bytes, page count) generated at build and consumed by the footer and `:system`.

---

## 5. Phased build plan

Order and rationale. The order you suggested is adjusted in four places:

1. **Phase 0 (decisions and content) comes first**, because the homepage, hero and work pages all depend on what can legally be shown.
2. **A hero / visual-language spike (Phase 3) comes before the shell.** The hero defines the visual grammar every other section reuses. Discovering that late is the most expensive possible rework.
3. **Layer 1 is completed before Layer 2.** All pages exist and work before the palette, keys and CLI are built. The command registry is then generated from a complete structure, and the site is launchable early.
4. **Accessibility, responsive and performance are gates in every task**, not only end phases. The late phases are audits, not first passes.

```text
0 decisions & content
→ 1 foundation & delivery pipeline
→ 2 visual system
→ 3 hero & visual-grammar spike
→ 4 shell & navigation
→ 5 content model & work
→ 6 homepage (static hero)
→ 7 services, about, contact, 404, resume   ← Layer 1 complete: launchable
→ 8 hero interactivity
→ 9 power-user layer (registry, keys, palette, CLI, help)
→ 10 responsive refinement
→ 11 accessibility audit
→ 12 performance audit
→ 13 polish & launch
```

### 5.0 Definition of Done (applies to every task)

- `astro check`, lint, unit tests, build and Playwright pass in CI.
- No axe violations on affected routes.
- Every interactive element is keyboard-reachable with a visible focus state.
- Verified at 375 / 768 / 1280 / 1600 widths.
- Verified with `prefers-reduced-motion: reduce`.
- Within the performance budget (§4.11).
- Passes the quality test in DESIGN_SYSTEM §31, with question 6 ("cleaner without this effect?") answered explicitly.
- No placeholder or lorem content committed. Missing content blocks the task, it is not faked.

---

### Phase 0: Decisions and content inventory

**Objective.** Remove every blocker that would cause rework later. No code.

**Tasks.**

- **0.1 Content inventory.** For each project in the archive, record: publication permission, possible depth (full / anonymized / mention), what evidence exists (live URL, diagrams, decisions, metrics), and which positioning capability it proves. Output: `docs/CONTENT_STRATEGY.md` §Inventory. Do not copy private or restricted material into this repository.
- **0.2 Evidence gap map.** Cross-reference the five capabilities (POSITIONING §4) with the inventory. Mark capabilities that have no publishable evidence.
- **0.3 Permission requests.** Owner drafts requests for the 2–3 most valuable restricted projects (agent may prepare drafts; owner sends).
- **0.4 Resolve M1–M11.** Record each answer in its owning document (§6).
- **0.5 Reconcile docs.** Apply the resolutions for C1–C11 to the existing docs (owner approval required for each edit).
- **0.6 Write `TECHNICAL_ARCHITECTURE.md` and `ACCESSIBILITY.md`** from §4 of this plan plus the decisions.

**Depends on.** Nothing.

**Acceptance.** All "Must decide" items have recorded answers. The featured-project set (3–4) is known, with the depth of each. The docs no longer contradict each other.

---

### Phase 1: Foundation and delivery pipeline

**Objective.** An empty but production-grade project that builds, tests and deploys on every push, with quality gates in place before any UI exists.

**Tasks.**

- **1.1** `git init`; scaffold Astro (minimal template), TypeScript strict, pnpm, `.nvmrc`, `.editorconfig`, `.gitignore`.
- **1.2** Prettier + `prettier-plugin-astro`; ESLint flat config (astro, jsx-a11y); scripts `check`, `lint`, `format`, `test`, `e2e`.
- **1.3** Vitest with one real unit (e.g. `build-info.ts`). Playwright + axe with one smoke test against the built site.
- **1.4** GitHub Actions: install → check → lint → unit → build → e2e → Lighthouse CI with budget assertions from §4.11.
- **1.5** Hosting (M9): preview deploys per PR, production on `main`, domain (M8), security and cache headers.
- **1.6** `lib/build-info.ts`: commit SHA, build timestamp, version, generated at build.
- **1.7** `layouts/Base.astro`: `lang`, meta, canonical, favicon slot, `@layer` stylesheet order, skip link target.
- **1.8** Portfolio decision tracking for this repository, if the owner wants it.

**Depends on.** M1, M3, M8 (domain), M9, M10.

**Acceptance.** A blank page is live on the production domain; a PR produces a preview URL; CI fails if a budget, type, lint, unit, e2e or axe check fails.

---

### Phase 2: Visual system

**Objective.** The token system and base primitives, verified on a specimen page, before any real composition.

**Tasks.**

- **2.1** `tokens.css`: all color tokens with the C1 corrections; `@layer` order; `reset.css`; `base.css`.
- **2.2** Fonts (M6): self-host, subset, preload, metric-matched fallbacks; fluid type scale and `.t-*` classes; specimen comparison of Geist vs the alternative sans.
- **2.3** Space, radius, border, z-index, motion and layout tokens; global reduced-motion handling.
- **2.4** `Grid`, `Container`, `Section` primitives with the documented asymmetric splits; dev-only construction-line overlay (later exposed via `:grid`).
- **2.5** Texture and light: grain tile asset, `Grain` and `Glow` surface components with opacity tokens; reduced-transparency handling.
- **2.6** Icon pipeline: build-time inlined SVG, `Icon` component, stroke 1.5; initial set limited to icons actually needed.
- **2.7** `Text`, `Kbd`, `Link`, `Button` (primary, secondary, ghost) with all states: hover, focus-visible, active, disabled.
- **2.8** `/lab/specimen` (dev only): every token, type style, primitive and state. Playwright screenshot baseline with grain disabled in test mode.
- **2.9** Token contrast unit test.
- **2.10** Fill `references/inspiration.md`: per reference, the principle taken and the specific things not to take.

**Depends on.** Phase 1; M4, M6, M7.

**Acceptance.** Specimen approved by the owner; contrast test green; no font-induced CLS; typography shows a clear display/metadata contrast with no weak middle hierarchy.

---

### Phase 3: Hero and visual-grammar spike

**Objective.** Validate the signature visual and extract the diagram vocabulary that every later section reuses. This is a design-validation phase; code quality may be lower, but no fake content.

**Tasks.**

- **3.1** Build the five-plane "exploded page" hero in `/lab/hero` with CSS 3D and real layer content (tokens, component tree, routes/schema, pipeline with build info).
- **3.2** Evaluate against criteria: legible at rest; convincing depth without WebGL; ≥ 55 fps on a 4× CPU-throttled profile during tilt; reduced-motion fallback coherent; mobile recomposition plausible. If depth/lighting fails, prototype the same scene in OGL and compare cost.
- **3.3** Extract the diagram primitives (`Node`, `Edge`, `Plane`, `Panel`, `Annotation`, `Measure`, `Label`) with tokens.
- **3.4** Explore two non-hero uses of the grammar (e.g. a case-study architecture diagram, a services "how I work" flow) to prove reuse.
- **3.5** Owner review; record the approved hero direction and grammar in `DESIGN_SYSTEM.md` (new section).

**Depends on.** Phase 2; M5.

**Acceptance.** Owner signs off on the hero direction; the 3D technique is decided; the primitives exist as components and are shown on the specimen page.

---

### Phase 4: Shell and navigation

**Objective.** The persistent frame every page lives in.

**Tasks.**

- **4.1** `routes.ts` manifest; nav, footer and later the palette read from it. Nav shows only routes that exist.
- **4.2** Header: brand mark (M8), primary nav with `aria-current`, scroll state via an `IntersectionObserver` sentinel (no scroll listener), backdrop blur within budget.
- **4.3** Mobile menu (D10): native `<dialog>`, focus management, includes the future search entry slot.
- **4.4** Footer: links, real build info, availability flag (D13), slot for the shortcut hint.
- **4.5** `StatusLine` component (polite live region), rendered empty until Phase 9.
- **4.6** `404` page: clear route home and to Work; the `command not found` tone is allowed, but usability comes first.
- **4.7** Cross-document View Transitions with reduced-motion handling.
- **4.8** Fill `COMPONENT_RULES.md` with the component inventory, states, and when to create vs reuse.

**Depends on.** Phase 2, Phase 3 (visual grammar).

**Acceptance.** Shell is complete at all widths, keyboard-only, without JS, and in forced-colors mode.

---

### Phase 5: Content model and Work

**Objective.** Case studies as the core evidence, with publication permissions enforced by the build.

**Tasks.**

- **5.1** Zod schema for projects: a subset of the archive's `project.yaml` (title, slug, tagline, summary, period, type, context, role, responsibilities, `not_my_work`, tech, links, permissions) plus site fields (featured order, hero visual, evidence types).
- **5.2** Build-time permission guard: the build fails if a project lacks `can_publish_case_study: true`, unless it is explicitly marked anonymized with a recorded permission note. Screenshots are guarded by `can_publish_screenshots`; client names by `can_name_client`. Unit tested.
- **5.3** Local import script (`scripts/import-project.ts <slug>`) that copies only permitted fields from the archive into `src/content/projects/`. It never reads `private/` or `restricted/`.
- **5.4** Write `PROJECT_CASE_STUDY_TEMPLATE.md` (block vocabulary, adaptive section rules) against the first real case study.
- **5.5** MDX case-study blocks: ProjectMeta, RoleAndContribution (including "not my work", which is an honesty signal few portfolios show), Decision, ArchitectureDiagram (from the grammar), Figure, Outcome, Reflection.
- **5.6** `/work/[project]` layout: adaptive sections, sticky section index on desktop with mono annotations, related work.
- **5.7** `/work` index (D6): indexed rows (year, type, role, key stack, one-line outcome), hover/focus reveals a small preview. Not a card grid.
- **5.8** First complete case study end-to-end with real content.

**Depends on.** Phase 0 (inventory), Phase 4.

**Acceptance.** One real, publishable case study is live on preview; the build demonstrably fails for an unpermitted project; the Work index reads well with only 2–4 entries.

---

### Phase 6: Homepage (static hero)

**Objective.** The overview page, complete as Layer 1. The hero ships in its static, no-JS state, which is also its permanent baseline.

**Tasks.**

- **6.1** Hero static composition from Phase 3: positioning line, one primary CTA (Work), one secondary CTA (Contact or Resume), the five-plane object at rest.
- **6.2** Selected Work: the 3–4 featured projects, each with a different evidence emphasis (not identical tiles).
- **6.3** Capabilities: the five areas, outcome-phrased, each linked to the evidence that supports it. Capabilities without evidence are demoted, not padded.
- **6.4** Engineering / design evidence section: one grammar-built visual (e.g. "how a product moves from problem to production", using real project data).
- **6.5** About preview and Contact CTA.
- **6.6** Composition review against the grid at all widths, with one hero-class visual on the page.

**Depends on.** Phases 3, 4, 5; final copy from `CONTENT_STRATEGY.md`.

**Acceptance.** A first-time visitor can answer the IA §25 questions within one scroll of the hero; Lighthouse budgets pass; no JS is required.

---

### Phase 7: Services, About, Contact, 404, Resume (Layer 1 complete)

**Objective.** Every route in IA §24 exists with real content. The site is launchable at the end of this phase.

**Tasks.**

- **7.1** `/services`: intro, five capabilities, how I work (grammar flow), relevant work, collaboration fit, contact. No agency language.
- **7.2** `/about`: overview, approach, AI-native workflow, selected experience, tools. Short.
- **7.3** `/contact`: email with copy button, LinkedIn, GitHub (D11).
- **7.4** Resume PDF and links (D12).
- **7.5** Metadata per page: titles, descriptions, canonical, sitemap, robots, `Person` structured data.
- **7.6** Optional soft launch.

**Depends on.** Phase 6.

**Acceptance.** All routes are live with real content; navigation is complete without JS; the full Definition of Done passes on every route.

---

### Phase 8: Hero interactivity

**Objective.** Turn the static hero into the signature interaction without changing its baseline.

**Tasks.**

- **8.1** `<system-hero>` custom element: ARIA tablist over the five layers, arrow-key navigation, panel switching.
- **8.2** Pointer: plane separation on hover, tilt ≤ 6° via CSS variables in rAF, pointer grain reveal.
- **8.3** Scoped `1–5` shortcuts (active only while the hero is focused or in view).
- **8.4** Optional scroll-linked plane separation (scroll-driven animation, no pinning, C8).
- **8.5** Mobile variant: segmented sequence, no tilt.
- **8.6** Reduced motion: instant layer changes, no tilt or parallax.
- **8.7** Performance profile on a throttled CPU; hero JS ≤ 8 KB gz.

**Depends on.** Phase 6.

**Acceptance.** All five layers are reachable by pointer, touch and keyboard; the static baseline is unchanged without JS; budgets and INP target pass.

---

### Phase 9: Power-user layer

**Objective.** Palette, CLI, keyboard navigation and help as one coherent system built on one registry.

**Tasks.**

- **9.1** Command registry generated from `routes.ts`, projects and actions; unit tests for completeness (every nav route has a command, every command has a valid target).
- **9.2** Keyboard manager: listener, input guard, scope stack, sequence resolver, off switch (M11); unit tests for each guard case.
- **9.3** `<command-palette>`: `<dialog>` + combobox, matcher, groups, empty state, focus return, lazy chunk with prefetch; header trigger and mobile "Search" entry.
- **9.4** CLI mode: parser, aliases, `:open <project>` completion, structured result panels, `command not found` with suggestions (D9).
- **9.5** `<shortcut-help>` overlay (`?`) generated from the registry, including the off switch.
- **9.6** `j`/`k` navigation over `data-nav-item` targets with focus movement and a position marker (D8).
- **9.7** Status line feedback for commands.
- **9.8** Discovery hints (§4.5): header `⌘K`, footer `Press ? for shortcuts`, shown after the first keyboard interaction.
- **9.9** Discovery commands (`:whoami`, `:stack`, `:history`, `:system`, `:grid`), each backed by real data.
- **9.10** Playwright suites: palette keyboard flow, CLI, shortcuts disabled inside inputs, off switch, `Esc` everywhere, focus return, axe on open overlays.

**Depends on.** Phase 7 (complete route set), Phase 8 (hero scope).

**Acceptance.** Everything reachable via the palette is also reachable via normal navigation and vice versa; no shortcut fires inside inputs or with modifiers; palette opens in under 100 ms on first use; axe passes with every overlay open.

---

### Phase 10: Responsive refinement

**Objective.** Make each breakpoint look designed, not merely functional.

**Tasks.**

- **10.1** Per-route review at 375 / 768 / 1024 / 1280 / 1600 / 1920, including landscape phone.
- **10.2** Tablet-specific recompositions where the desktop asymmetry collapses badly.
- **10.3** Touch target sizes (≥ 44px for primary controls), hover-only content audit.
- **10.4** Real-device check: iOS Safari, Android Chrome, low-end Android.

**Depends on.** Phase 9.

**Acceptance.** Screenshot set approved per breakpoint; no horizontal scroll; no clipped annotations.

---

### Phase 11: Accessibility audit

**Objective.** A manual audit beyond automated checks.

**Tasks.**

- **11.1** VoiceOver + Safari and NVDA + Firefox walkthrough of every route and overlay.
- **11.2** Keyboard-only walkthrough including Layer 2 with shortcuts on and off.
- **11.3** 200% and 400% zoom, text spacing override, forced colors.
- **11.4** Fix list; record known limitations in `ACCESSIBILITY.md`.

**Depends on.** Phase 10.

**Acceptance.** No open WCAG 2.2 AA issue.

---

### Phase 12: Performance audit

**Objective.** Confirm the budgets on real conditions, not only in CI.

**Tasks.**

- **12.1** WebPageTest / Lighthouse runs on mobile profiles; trace the hero interaction.
- **12.2** Font subset and preload review; image weights; unused CSS.
- **12.3** Cache headers and CDN behaviour verified on production.
- **12.4** Record the final numbers (they become content for `:system` and a possible case study).

**Depends on.** Phase 10.

**Acceptance.** All §4.11 budgets met on production.

---

### Phase 13: Polish and launch

**Objective.** Close the gap between correct and crafted.

**Tasks.**

- **13.1** Full state audit (hover, focus, active, disabled, empty, loading, error) against DESIGN_SYSTEM §31.
- **13.2** OG images (D14), favicon set, social metadata.
- **13.3** Copy pass against POSITIONING §11 (tone) and §8 (outcomes, not technologies).
- **13.4** Motion tuning pass: remove anything that fails "cleaner without this effect".
- **13.5** Launch checklist: redirects, analytics (if any), sitemap submission, uptime check.
- **13.6** Write the portfolio's own case study (this site as a project), using the recorded decisions.

**Depends on.** Phases 11 and 12.

**Acceptance.** Owner signs off; production is live; the site's own case study is published.

---

## 6. Additional documentation

The rule: a document exists only when it holds decisions an agent would otherwise have to guess. Where a topic fits an existing document, extend that document instead.

| Document | Create? | When | Why and what it contains |
|---|---|---|---|
| `CONTENT_STRATEGY.md` (exists, empty) | **Yes, first** | Phase 0 | The biggest open risk. Project inventory with permissions and depth, featured set, capability-to-evidence map, voice and tone rules with examples, copy for the hero, CTAs and capabilities, and what not to publish. |
| `TECHNICAL_ARCHITECTURE.md` | **Yes** | Phase 0 (task 0.6) | Stack decision and rationale, directory structure, route manifest and registry design, content schema and permission guard, build metadata, hosting, CI gates, **performance budget** (as a section, not a separate file). |
| `ACCESSIBILITY.md` | **Yes, short** | Phase 0 | Target (WCAG 2.2 AA), contrast pairs, focus style, keyboard rules (input guard, off switch, scoped keys), overlay patterns, manual test matrix, known limitations. Referenced by every task's DoD. |
| `COMPONENT_RULES.md` (exists, empty) | **Yes, fill it** | Phase 4 | Component inventory, required states per component, composition rules, when to extract a component. Use this file instead of creating `COMPONENT_SYSTEM.md`. |
| `PROJECT_CASE_STUDY_TEMPLATE.md` | **Yes** | Phase 5 (task 5.4), against the first real case study | Block vocabulary, which sections are mandatory, adaptive-structure rules, evidence types, permission rules for media. Maps the archive's `case-study.md` to site blocks. |
| `MOTION_SYSTEM.md` | **No** | | Motion tokens and rules fit in a new section of `DESIGN_SYSTEM.md` (Phase 2). A separate file would split the visual source of truth. |
| `PERFORMANCE_BUDGET.md` | **No** | | Section of `TECHNICAL_ARCHITECTURE.md`; the enforceable source is the Lighthouse CI config. |
| `references/inspiration.md` (exists, empty) | **Fill or delete** | Phase 2 | Per reference: the principle taken and the concrete things not to take. This is the best guard against imitation (§7.4). |
| `AGENT_INSTRUCTIONS.md` | **Small update** | Phase 0 | Reading order and precedence (C11). |

---

## 7. Challenges to the current direction

### 7.1 The content gap is the real risk, not the design

**Problem.** The site's whole value proposition rests on case studies, but only one archived project is cleared for publication, and it is an older Drupal company site. A Raycast-grade shell around thin evidence will read as style over substance, which is the exact opposite of "real engineering underneath".

**Alternative.** Treat content as phase 0 work, not a later fill-in. Make two guaranteed case studies from self-owned work: **this portfolio** (designed and built from interface to infrastructure, with its decision log) and **Decision Watchdog** (an AI-native tool, evidence of systems thinking). Write **anonymized, diagram-only case studies** for restricted client work: architecture, decisions and the "not my work" boundary are all publishable without screenshots or client names, where permission allows. Request permission for the strongest client projects now.

### 7.2 Technical annotations have become a trend

**Problem.** `01 / SECTION`, `STATUS ● AVAILABLE`, `BUILD 2026.10`, crosshairs and mono labels are now a widespread portfolio and SaaS aesthetic. Decorative technical labels are the new gradient blob.

**Alternative.** One rule: **every annotation is real data or real navigation.** Section IDs are actual anchors used by `j`/`k` and the palette. Build stamps come from the actual build. Coordinates and measurement marks show real grid values. "Available" reflects a flag the owner controls. That turns a trend into evidence.

### 7.3 "Each section has its own visual idea" scales badly

**Problem.** Bespoke visuals per section multiply design time, weight and inconsistency, and usually end as a collection of unrelated illustrations.

**Alternative.** A **visual grammar** of six or seven primitives (node, edge, plane, panel, annotation, measure, label), defined in Phase 3 and composed everywhere. Variety comes from composition and data, not new art styles. Maximum one hero-class visual per page.

### 7.4 Raycast and Resend could become imitation

**Problem.** Dark background, a warm red-orange accent close to Raycast's brand red, grain, a glowing 3D hero object and a `⌘K` badge in the header together read as a Raycast homage. A 3D cube or object with pointer rotation reads as Resend.

**Alternative.** Keep the principles (polish, depth, custom visuals), change the vocabulary. Identity comes from the **technical-drawing language**: exploded views, construction lines, dimension marks, real grids, with a single consistent warm key light rather than glossy glass. The hero is an exploded view of a real web page, not an object. Fill `inspiration.md` with an explicit "not to take" list per reference. Test the accent next to Raycast's and decide whether to shift it slightly toward amber.

### 7.5 Geist risks the "AI-generated" look

**Problem.** Geist Sans is the default face of Next.js and v0-generated sites. The docs simultaneously prefer Geist and demand that the site not look AI-generated.

**Alternative.** Keep Geist Mono (excellent and less associated) and test one alternative sans on the Phase 2 specimen (M6). If Geist wins on the specimen, keep it; identity will then have to come from composition and the hero.

### 7.6 Vim keys: low value for most visitors, a real accessibility risk

**Problem.** Single-character shortcuts conflict with WCAG 2.1.4 and can surprise speech-input users. "Next section" that only scrolls is pointless for keyboard users because it skips focus.

**Alternative.** `j`/`k` **move focus** between declared items with a visible marker, can be switched off, and never fire in inputs or with modifiers. Hints appear only after keyboard use. The keyboard layer then improves keyboard usability, as INTERACTION §11 requires.

### 7.7 Two command surfaces would duplicate each other

**Problem.** A separate CLI input next to the palette is two UIs for one job, and terminal-style output drifts toward the "pretending to be a terminal" outcome the docs reject.

**Alternative.** One palette with a `:` mode, one registry, structured result panels. Discovery commands are capped at five and each returns true information. No `cat`/`ls` beyond aliases.

### 7.8 The hero must work before anyone interacts

**Problem.** Layer switching through hidden keys or hover means most visitors (mobile, first-time) see only the default state. If that state is abstract, the hero communicates nothing.

**Alternative.** The resting state carries the full message, all five labelled layers are visible, controls are an obvious visible tablist, and interaction only adds depth.

### 7.9 3D and dynamic grain are performance traps

**Problem.** WebGL hero (three.js ≈ 150 KB+, GPU cost, fallback complexity) and live `feTurbulence` grain (full repaints) can easily cost more than the rest of the site combined, especially on mobile.

**Alternative.** CSS 3D on real DOM, a pre-rendered grain tile, masked reveals; WebGL only if the Phase 3 spike proves CSS insufficient, and then OGL.

### 7.10 Theme switching doubles the QA surface

**Problem.** `:theme light` implies a full second palette, grain and lighting tuned for light backgrounds, and screenshots for every state.

**Alternative.** Dark only at launch (M4). Remove theme commands until a light theme is designed. Do not ship a command that does nothing.

### 7.11 Five capabilities can read as "does everything"

**Problem.** Equal weight for web products, frontend, CMS, AI and MVPs dilutes the "design-minded engineer" claim.

**Alternative.** Lead the homepage with the single integrated claim (interface to infrastructure), then show the five areas each with linked evidence. Areas without publishable evidence get less space until evidence exists.

### 7.12 Unnecessary complexity to avoid

- A client-side router or SPA transitions: native cross-document view transitions are sufficient.
- A contact form and serverless function: an email address is better for this audience.
- Search infrastructure: the palette covers it until `/notes` exists.
- A headless UI library, animation library or fuzzy-search library: each solves a problem this site is too small to have.
- Early i18n.

---

## 8. Portfolio decision tracking

This repository is not registered with Decision Watchdog and has no `.portfolio/WORKLOG.md`. Because the site itself is planned as a case study (§7.1, task 13.6), its decisions are worth capturing from Phase 0. Registering it is task 1.8 and is the owner's call.

---

## NEXT ACTION

**Task 0.1: Content inventory.** Read every project in the private archive (`project.yaml`, `case-study.md`, `README.md` only, never `private/` or `restricted/`) and write `docs/CONTENT_STRATEGY.md` §Inventory: one row per project with publication permission, possible depth (full / anonymized / mention / none), available evidence, and which POSITIONING §4 capability it proves. End with a list of capabilities that currently have no publishable evidence and the 2–3 projects for which the owner should request permission. Copy no client code, credentials or confidential details, and do not name clients where `can_name_client` is false.
