# Build log

Running log of the build: what was decided, why, and what is still open.
Append-only; newest at the bottom.

---

## 2026-10-14: Overnight MVP build

### Decisions

**Stack: Astro 7 + React islands + Tailwind CSS v4** (supersedes IMPLEMENTATION_PLAN §4.1 / §4.3, owner-approved 2026-10-13).
The plan recommended vanilla TS custom elements and plain CSS, no React / Tailwind. The owner wanted to use the
shadcn / React ecosystem when it makes the site better, and to ship ASAP. Astro keeps every page static HTML; React
loads only in two islands:

- `ExplodedView` (hero figure): `client:visible`
- `CommandMenu` (⌘K palette): `client:idle`, built on **cmdk** (the library under shadcn's `Command`) + Radix Dialog for
  focus management and a11y.

Tailwind reads the design tokens through `@theme` in `src/styles/global.css`; tokens stay the single source of truth.

**Motion library: removed.** Motion was tried for the hero caption crossfade; it added ~25 KB gz for one fade. Replaced
by a CSS keyframe. Re-add only for real choreography.

**React Bits / Tailark / assistant-ui / driver.js: not used.** React Bits backgrounds (Dither, Prism, Silk) need
three.js / R3F, too heavy for one texture. The site's own dithered light (`DitherLight.astro`) is a ~2 KB Bayer dither
on a small canvas, written for this site. Tailark sections would read as a template; assistant-ui and driver.js solve
problems this site does not have.

**Hero = "this page, exploded"** (plan M5). Five opaque planes in CSS 3D (design on top → infra at the bottom), the
selected one slides out of the stack; legend is an ARIA tablist with leader lines; keys 1–5 scoped to the hero;
idle auto-cycle until the visitor interacts; no cycle under reduced motion.

**Contrast fix (plan C1):** `--color-fg-3` (#86837C) is the readable tertiary; `--color-fg-4` (#68655E) is decorative only.

**Font:** Geist Sans + Geist Mono, self-hosted via Fontsource (plan M6; specimen comparison still open, see below).

**No contact form** (plan D11). **Dark only** (plan M4), no theme command.

**Build guard:** a production build fails while `site.email` is empty (`ALLOW_MISSING_CONTACT=1` bypasses it for
previews). Projects need `permission.caseStudy: true` in frontmatter or the content schema rejects them.

### Content used

- Medical Navigator: from the private draft in `content/case-studies/` (public facts only).
- ExCoLabs: condensed from the archive case study; screenshots cleared (`can_publish_screenshots: true`).
- This website: written from the decisions above.
- Decision Watchdog: listed only (no page), description from the owner's own tool notes. **Needs owner confirmation.**

### Owner TODO before launch

1. `src/config/site.ts`: `email` (required), `github`, `linkedin`, `resume` (optional).
2. `astro.config.mjs`: real `site` domain.
3. Confirm the Decision Watchdog description (or remove `src/content/work/decision-watchdog.mdx`).
4. Review `stack` in `site.ts` (shown by `:stack`).
5. Re-check Medical Navigator numbers on the live site (548 clinics, 10 countries, 23 treatments, 16 currencies).
6. Hosting account + deploy (see README).

### Design direction, as built

- **Concept:** a technical drawing of a warm product at night. Warm near-black paper, thin construction lines
  (page rails, section rules with crosshairs), numbered mono annotations that are real anchors, one warm key light.
- **Signature elements:** FIG. 01 exploded-view hero; the five-square *layer signature* on every project (D F B A I),
  reused from the hero; dithered warm light (hero corner, contact, 404, OG image); orange used only for state.
- **Homepage order:** Hero → 01 Selected work (indexed rows) → 02 Capabilities (outcomes + evidence links) →
  03 Process (scroll-linked diagram) → 04 Instrument (live key map) → 05 Contact.
- **Case study pages:** meta strip, sticky numbered TOC, prose with numbered H2s, custom diagrams
  (`FilterStateDiagram`), cross-document view transition of the project title from the index.

### Verified

- `astro check`: 0 errors. Production build: 8 pages.
- Lighthouse (mobile, home): Accessibility 100, Best Practices 100, SEO 100.
- Performance trace (Slow 4G, 4× CPU, mobile): LCP 1.24 s, CLS 0.00.
- JS: keyboard module eager (~2 KB gz); React islands hydrate on visible / idle.
- Checked at 1440 and 390 px; no horizontal scroll; ⌘K, `:system`, `j`/`k`, `1–5`, mobile menu tested.

### Not done yet

- About page (owner wants to prepare it together; not linked anywhere yet).
- Screenshots for Medical Navigator (list of needed shots is in `content/case-studies/medical-navigator.md`).
- Decision Watchdog case study.
- Automated tests / CI (plan Phase 1.3–1.4) and deploy.

---

## 2026-10-14: Redesign, precision minimalism

### Why
Owner review of the first version: clean but forgettable and "odmerané" (cold). Too many elements per screen, flat
hierarchy (five grey text levels, mono labels everywhere), structure built from divider lines instead of space, a
"poor" palette of near-identical warm greys. The technical-drawing / paper metaphor was rejected outright.

### Process
Three typefaces and five candidate scenes were prototyped on a private `/lab` page (dev only, redirects in
production, excluded from the sitemap). The owner approved Hubot Sans with the kinetic effect and all five scenes.

### Decisions
- **Theme:** light primary (`#FAFAFA` bg, `#000` ink), dark as an explicit, persisted toggle. Accent `#FF2F00`
  (large text / UI only on light; `--accent-ink` `#D42700` for small text), signal green `#00D816` / `#00B512`.
  Palette taken from the owner's Pangram Pangram reference.
- **Type:** Hubot Sans (display, variable wght + wdth) · Mona Sans (text) · Martian Mono (terminal, labels) ·
  Doto (dot-matrix accent). All OFL via Fontsource. Neue Machina was the owner's first choice but needs a paid web
  licence, so it was rejected.
- **Structure:** one loud technique per screen, no divider lines, sections separated by space (≈20vh).
- **Home scenes:** 01 kinetic hero · 02 halftone scrollytelling · 03 work list with cursor-following dithered preview ·
  04 terminal typing real output · 05 magnetic "Let's talk".
- **Motion stack:** GSAP ScrollTrigger + Lenis (one deferred module, `src/interactive/motion.ts`). This reverses the
  earlier "no animation library" call: the scroll choreography is the product here. Reduced motion → static final states.
- **Header:** `mix-blend-mode: difference` so it reads on white and black scenes; hides on scroll down.
- **Shared element transition:** project title morphs from the work list into the case-study title
  (cross-document View Transitions).
- **Removed:** exploded-view hero (and with it the last React island besides the command menu), dither light, grain,
  rails, crosshairs, layer signatures, Capabilities / Process / Instrument sections.

---

## 2026-10-14: Pre-publication review

- Decision Watchdog description confirmed against the public resume and the public repository
  (github.com/viliamkratky/decision-watchdog); stack updated to Python, Ollama, Git, Claude Code / Codex hooks.
- Repository prepared for publication: `/lab` and its font file removed, private archive details and NDA references
  removed from docs, private drafts (`content/`) kept out of git, licence split into MIT code and all-rights-reserved
  content, resume replaced with the version without a phone number.
- Empty placeholder documents removed (`docs/CONTENT_STRATEGY.md`, `docs/COMPONENT_RULES.md`, `references/inspiration.md`). `IMPLEMENTATION_PLAN.md` still mentions them as part of its original audit.

---

## 2026-10-24: Work preview without the dither reveal

- The work-list cursor preview no longer shows a dithered accent-red version first and swaps to the image after a
  fixed 380 ms + 500 ms fade. The owner found the forced wait an anti-pattern. All previews are now fetched and decoded
  as the list approaches the viewport, and hovering shows the real image at once (fine pointers only, as before).

## 2026-10-24: Mobile polish

- Touch: the work list is static, every title at full ink. The scroll-driven focus (the row at mid-viewport stayed
  dark, the others faded to 16 %) is removed at the owner's request. Hover emphasis on fine pointers is unchanged.
- Header: hiding is a 240 ms fade with a 12 px drift up, revealing 500 ms, both on `--ease-soft` (CSS `ease`). On the
  strong `--ease-out` the reveal was 83 % visible after 125 ms and read as popping in, and an iPhone recording showed
  71 % of the drift in the first frame of the hide, then a hang while the fade continued. It no longer slides off by its own height, which iOS left half visible under the status bar.
- Header direction: a new scroll direction only counts after 24 px of travel, and overscroll past either end is
  ignored. iOS nudges `scrollY` back and forth while its toolbars resize at the start of a scroll; with the old 6 px
  per-event check the header started hiding, turned back and stalled, then hid.

---

---

## 2026-10-15: Hosting and contact form

Written on 2026-10-15 on `feature/contact-form`, rebased onto `main` on 2026-10-24.

### Hosting (resolves plan M9)

- **Cloudflare Pages** with Git integration on `github.com/viliamkratky/portfolio-site`. Cloudflare runs the build;
  a push to `main` deploys production, so changes go through a branch first (git workflow in `AGENTS.md`).
- Live at https://viliamkratky.dev, DNS on Cloudflare. The headers from `public/_headers` (CSP, HSTS, immutable
  `/_astro/*`) are served as written (checked 2026-10-15).
- The GitHub Actions quality gate recommended in M9 does not exist yet; it stays open together with tests / CI.
- Owner TODO items 1 (email, links, resume), 2 (domain) and 6 (hosting, deploy) from the MVP entry are done.

### Contact form (reverses plan D11 and §7.12)

**Why:** the "Let's talk" CTA is a `mailto:` link. A visitor on webmail, or without a configured mail client, gets
nothing or a mail app they never use. The owner wants a form on the page instead of that dead end.

- **Pattern:** with JS, the "Let's talk" CTA opens a native `<dialog>` (full height on mobile, like the menu, plan D10;
  a centred panel from `md`). Without JS it stays the `mailto:` link it was. Three fields: name, email, message. The
  message hint repeats Context / Problem / Outcome from `/contact`. No React: the command menu stays the only island.
- **Email stays visible** with its Copy button: people copy addresses, and it is the path without JS. Without JS the
  form is not shown, because Turnstile needs JS.
- **States:** sending, sent, and error with a fallback to the email address. A draft survives an accidental close.
- **Endpoint:** one Cloudflare Pages Function, `functions/api/contact.ts`. The Astro site stays `output: 'static'`,
  no adapter. Validation rules live in `src/lib/contact.ts` and are shared by the dialog and the function.
- **Switch:** the form ships only when the build has `PUBLIC_TURNSTILE_SITE_KEY` (`src/lib/turnstile.ts`). A
  production build without it is the site as before, so the code can merge before the accounts exist.
- **Bot protection, in layers:** Cloudflare Turnstile verified on the server; a honeypot field and a minimum fill
  time; server-side validation (lengths, email format) and an `Origin` check, because Pages answers with
  `access-control-allow-origin: *` by default; a WAF rate-limiting rule on `/api/contact`, because Pages Functions
  have no rate-limit binding.
- **Added 2026-10-24:** at most 3 links per message (spam written by people is almost always link lists), and with
  real Turnstile keys the function accepts only `viliamkratky.dev`. The same function also answers on `*.pages.dev`,
  where the zone's WAF rule does not apply; previews keep working because they use Cloudflare's test keys.
- **No confirmation email to the sender:** a form that mails arbitrary addresses gets abused. The visitor's address
  goes into `Reply-To` only.
- **Privacy:** one line under the submit button saying the message is used only to reply. No consent banner (M10
  still holds).

### Exceptions this creates

- **Third-party script** (plan §4.11 "no third-party scripts at launch"): Turnstile loads from
  `challenges.cloudflare.com`, and only when the contact dialog opens; ordinary page views load nothing third party.
  Owner-approved; chosen over a self-hosted proof of work (ALTCHA) because the site already runs on Cloudflare.
- **CSP:** `script-src` and `frame-src` need `https://challenges.cloudflare.com`. `connect-src 'self'` and
  `form-action 'self'` already cover the endpoint.

### Sending: Resend (owner-confirmed 2026-10-15)

Cloudflare Email Service's `send_email` binding is not available to Pages Functions (Workers only; its REST API or a
separate Worker would work, and the service is still in beta). Resend is one `fetch` call from the function, mature,
and free up to 100 emails a day. It sends from `contact@viliamkratky.dev` to `site.email`; switching providers later
touches only that call. `viliamkratky.dev` has no SPF, DKIM or DMARC records yet; verifying the domain in Resend
adds SPF and DKIM.

### Verified locally

`wrangler pages dev` with Turnstile test keys and `CONTACT_DRY_RUN=1`: foreign or missing `Origin` → 403; honeypot
and too-fast submissions → silent 200, nothing sent; invalid fields → 422 with per-field messages; missing token →
403; valid → 200 and the message logged. Re-run on 2026-10-24 after the rebase, plus: 4 links → 422, 3 links → 200;
a non-test secret on a host other than `viliamkratky.dev` → 403. In the browser: Turnstile loads under the new CSP with no console errors,
field errors, sent state, draft cleared after sending, error state with the email fallback, mobile full-height and
dark theme. A production build without the site key contains no dialog and no trigger.

### Owner setup before the form goes live

1. Turnstile (Cloudflare dashboard): add a widget, mode Managed, hostname `viliamkratky.dev`.
2. Resend: add the domain `viliamkratky.dev`, add its DNS records in Cloudflare, create an API key with sending
   access for that domain only.
3. Pages project, Production environment: build variable `PUBLIC_TURNSTILE_SITE_KEY`, secrets
   `TURNSTILE_SECRET_KEY` and `RESEND_API_KEY`. Preview environment: Cloudflare's test keys
   (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`) and `CONTACT_DRY_RUN=1`.
4. WAF rate-limiting rule: path equals `/api/contact`, method POST, by IP, block when exceeded.
5. Redeploy, then send one real message.
