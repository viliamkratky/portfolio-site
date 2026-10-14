# Portfolio Design System

> **Superseded 2026-10-14.** The visual direction below (dark, warm, technical drawing) was replaced by the light "precision minimalism" direction: Hubot Sans kinetic typography, one loud idea per screen, no divider lines, palette `#FAFAFA` / `#000000` / `#FF2F00` / `#00D816`. Tokens live in `src/styles/global.css`; decisions and rationale in `docs/BUILD_LOG.md`. Interaction, accessibility and performance principles in this document still apply.

## 1. Purpose

This document is the single source of truth for the visual and interaction design of the portfolio website.

The website should not look like a generic developer portfolio, a template, or a design-agency website.

It should feel like a polished software product built by a design-minded software engineer.

The website itself is part of the portfolio and should demonstrate:

- strong visual taste
- frontend engineering quality
- attention to detail
- interaction design
- systems thinking
- technical competence
- ability to build polished digital products

The primary visual benchmark is Raycast.

Secondary references:
- Resend for custom visual elements, diagrams, product UI, dashboards, 3D and interactive objects
- Actual Source for the idea that the interface itself should reflect the creator's field
- Linear and Vercel for hierarchy, restraint, layout discipline and clarity

Do not copy any reference directly.

The goal is to create an original visual identity from the principles behind these references.

---

# 2. Brand Positioning

The portfolio represents a:

**Design-minded Full-stack Software Engineer & Product Builder**

The work spans:

- web products
- frontend and interface engineering
- CMS and content platforms
- AI-enabled software
- technical prototypes and MVPs

The visual identity must therefore balance two sides:

**Design**
- strong visual composition
- typography
- interaction
- polished UI
- thoughtful motion

**Engineering**
- structure
- systems
- technical interfaces
- code
- architecture
- data
- precision

Neither side should dominate completely.

The website must not look like:

- a pure graphic designer portfolio
- a hacker terminal theme
- a SaaS template
- a generic developer portfolio
- a crypto startup
- a cyberpunk website

---

# 3. Core Design Direction

The design direction is:

**Premium Product Interface × Engineering System × Controlled Gamification**

The visual target is approximately:

**85% premium product design**
**15% developer / technical interaction language**

The technical language should be discovered gradually.

It should never overpower the normal website experience.

---

# 4. Design Principles

## 4.1 Hierarchy over decoration

Every screen must have a clear visual hierarchy.

A visitor should immediately understand:

1. what is primary
2. what is secondary
3. what is interactive
4. where to go next

Decorative elements must never compete with content.

---

## 4.2 Rich, not busy

The website may use:

- grain
- lighting
- gradients
- 3D objects
- custom diagrams
- technical UI
- motion
- interactive visuals

but these must belong to one coherent visual system.

Avoid random visual experimentation.

Every effect must have a reason.

---

## 4.3 Structure is part of the brand

The visual identity should rely heavily on:

- grid
- alignment
- spacing
- typography
- borders
- layering
- technical annotations
- controlled asymmetry

Do not rely on a logo or one accent color to create identity.

---

## 4.4 The website should behave like software

The website should feel closer to an application or interactive system than a static brochure.

It should reward exploration.

However:

**normal mouse / touch navigation must always work.**

Keyboard navigation and gamification are enhancements, never requirements.

---

# 5. Color System

Use a dark-first palette.

The palette should feel warmer than Raycast and less purple.

## Core palette

```css
--bg-primary: #0B0B0A;
--bg-secondary: #11110F;
--bg-elevated: #171613;
--bg-hover: #1D1B18;

--text-primary: #F2F0E9;
--text-secondary: #A09C92;
--text-muted: #68655E;

--border-subtle: #24221E;
--border-default: #302D27;
--border-strong: #474239;
```

## Primary accent

Warm orange:

```css
--accent-primary: #FF7448;
--accent-secondary: #F59A59;
--accent-muted: #A95335;
```

The accent should normally occupy less than 5–10% of a screen.

Use it for:

- active states
- hover details
- selected navigation
- important diagram nodes
- small indicators
- interaction feedback
- technical markers

Do not create large flat orange sections.

---

# 6. Lighting and Effects

The site may use Raycast-like lighting and depth.

Preferred effects:

- subtle radial glows
- soft warm light
- faint colored reflections
- edge highlights
- layered translucent surfaces
- very subtle blur
- restrained gradients

Avoid:

- large rainbow gradients
- neon cyberpunk lighting
- excessive glassmorphism
- glowing every component

Light should feel atmospheric rather than decorative.

---

# 7. Grain and Texture

Grain is an important signature detail.

Use subtle grain on:

- large hero visuals
- decorative strips
- large gradient surfaces
- 3D objects
- atmospheric backgrounds

The grain should resemble premium print / film texture rather than digital noise.

Approximate opacity:

```text
1–4%
```

Never reduce text readability.

Do not apply heavy noise globally.

---

# 8. Typography

Typography should feel modern, technical and premium.

## Primary sans

Preferred:

**Geist Sans**

Alternatives:

- Inter Tight
- Söhne-like grotesk
- Neue Montreal-like grotesk

Avoid overly stylized display fonts.

## Mono

Preferred:

**Geist Mono**

Use mono for:

- metadata
- commands
- keyboard shortcuts
- labels
- technical annotations
- IDs
- timestamps
- status indicators
- code

Do not use monospace for normal paragraphs.

---

# 9. Type Scale

Suggested desktop scale:

```text
Display XL      72–96px
Display         56–72px
H1              48–64px
H2              36–48px
H3              24–32px
Body Large      18–20px
Body            16px
Small           14px
Metadata        11–13px
```

Large typography should generally use:

```text
line-height: 0.95–1.05
```

Body:

```text
line-height: 1.5–1.7
```

Use strong contrast between display type and metadata.

Avoid a weak middle hierarchy where everything is between 18px and 28px.

---

# 10. Grid

Desktop:

```text
max-width: 1280–1360px
12-column grid
24px gutters
```

The site should use controlled asymmetry.

Examples:

```text
7 columns visual
1 column gap
4 columns text
```

or:

```text
2 columns metadata
6 columns main content
4 columns supporting visual
```

Do not center everything.

The grid should be visible indirectly through alignment.

Occasional visible construction lines may reinforce the technical identity.

---

# 11. Spacing

Use a consistent spacing system.

Base:

```text
4
8
12
16
24
32
48
64
96
128
160
```

Large sections should breathe.

Approximate vertical section spacing:

```text
Desktop: 120–160px
Tablet: 80–120px
Mobile: 64–96px
```

Individual UI components may remain relatively dense.

The intended contrast is:

**spacious page composition + information-dense components**

---

# 12. Borders

Borders are preferred over shadows.

Typical border:

```css
1px solid var(--border-subtle);
```

Use borders for:

- sections
- technical panels
- cards
- UI mockups
- diagrams
- navigation
- content separation

Some large sections may intentionally share borders to create a continuous grid.

---

# 13. Radius

Use relatively restrained radii.

```text
Small UI: 4–6px
Buttons: 6–8px
Panels: 8–12px
Large visual surfaces: max ~14px
```

Avoid excessive rounded cards.

Do not make every section look like a floating SaaS card.

---

# 14. Shadows

Use shadows sparingly.

Depth should primarily come from:

- background contrast
- border highlights
- lighting
- blur
- layering

If a shadow is needed, keep it soft and large.

---

# 15. Navigation

Primary navigation must be simple and immediately understandable.

Desktop navigation should feel lightweight.

It may include:

- brand / initials
- Work
- Services
- About
- Contact
- command palette trigger

Possible utility:

```text
⌘K
```

The navigation may become slightly opaque / blurred after scrolling.

---

# 16. Command Palette

The website should include a command palette.

Shortcut:

```text
⌘K / Ctrl+K
```

Example commands:

```text
Projects
About
Services
Contact
Resume
GitHub
LinkedIn
Theme
Keyboard Shortcuts
```

Advanced commands may include:

```text
:projects
:about
:contact
:resume
:open github
:theme dark
```

The palette should feel like a real product UI, not a fake terminal.

---

# 17. Keyboard Navigation

Support optional Vim-inspired keyboard navigation.

Initial shortcut set:

```text
j       next section/item
k       previous section/item

g h     home
g w     work/projects
g s     services
g a     about

/       search
:       command mode
?       shortcut help
esc     close current overlay
```

Keyboard controls must never interfere with:

- form inputs
- text fields
- browser shortcuts
- accessibility

Always provide standard navigation as the default.

---

# 18. Gamification

Gamification should be based on exploration and discovery.

Do not use:

- XP
- points
- fake achievements
- badges
- progress bars for no reason

Preferred mechanics:

- keyboard shortcuts
- hidden commands
- easter eggs
- alternative navigation
- interactive diagrams
- reveal states
- discoverable system information
- hidden UI modes
- subtle secrets

Possible commands:

```text
:whoami
:stack
:history
:ls projects
:open <project>
:cat about.txt
:system
```

Gamification should feel natural for a software engineer portfolio.

---

# 19. Technical Interface Language

Technical elements may appear throughout the site.

Examples:

```text
SYSTEM / PORTFOLIO
BUILD 2026.10
STATUS ● AVAILABLE
```

or:

```text
01 / PROJECT
02 / SYSTEM
03 / INTERFACE
```

Use sparingly.

Do not turn the entire site into a terminal simulation.

---

# 20. Signature Details

Possible recurring brand elements:

- warm orange status dot
- small crosshair markers
- command hints
- grainy strips
- technical section IDs
- mono annotations
- thin construction lines
- subtle coordinate / measurement marks
- layered technical panels

These should recur enough to form a recognizable visual language.

---

# 21. Visualizations

Custom visualizations are highly encouraged.

Each important section should ideally have its own visual idea.

Examples:

- system architecture
- interactive product mockup
- terminal output
- animated diagrams
- network graph
- UI dashboard
- code-to-interface transformation
- data flow
- timeline
- interactive 3D object

Avoid repetitive:

```text
headline
paragraph
screenshot
```

for every section.

---

# 22. 3D

3D may be used for one or a few signature moments.

Reference quality:

Resend Rubik's cube.

3D should:

- react subtly to pointer movement
- have purpose or conceptual relevance
- integrate with the visual language
- remain performant

Do not add generic floating spheres or blobs.

---

# 23. Hero

The hero is the most important visual composition.

Primary benchmark:

**Raycast-level visual quality**

Characteristics:

- strong hierarchy
- memorable central visual
- depth
- grain
- layered surfaces
- atmospheric lighting
- restrained copy
- subtle interactive behavior

The hero should not rely on typography alone.

It should contain a signature interactive visual.

Potential concept:

A multi-layer system object representing:

```text
DESIGN
FRONTEND
BACKEND
AI
INFRASTRUCTURE
```

The visual may switch layers based on interaction.

Possible controls:

```text
1 design
2 frontend
3 backend
4 AI
```

These must remain optional.

---

# 24. Motion

Motion should feel:

- precise
- controlled
- fast
- intentional

Micro-interactions:

```text
150–250ms
ease-out
```

Larger transitions:

```text
350–700ms
```

Good motion:

- subtle translate
- opacity reveal
- border illumination
- line expansion
- mask reveal
- layered parallax
- slight pointer response
- diagram state transitions

Avoid:

- bouncing
- excessive spring animations
- scroll hijacking
- spinning UI
- animation on every element

Motion should support hierarchy.

---

# 25. Cursor Interaction

Pointer interactions may reveal additional detail.

Examples:

- local lighting
- grain reveal
- hidden symbols
- technical annotations
- visual layer changes

Reference inspiration:

Warp character reveal interaction.

Do not replace the normal cursor globally unless there is a very strong reason.

---

# 26. Icons

Icons should be:

- simple
- geometric
- thin
- consistent

Preferred stroke:

```text
1–1.5px
```

Use a restrained icon set.

Custom icons may be created for selected technical concepts.

Avoid large collections of colorful SaaS icons.

---

# 27. Responsive Design

Mobile must not be treated as a reduced desktop.

Simplify:

- 3D
- hover interactions
- dense technical panels
- keyboard-only hints

Preserve:

- hierarchy
- visual identity
- typography
- spacing
- key interactions
- performance

Interactive effects should degrade gracefully.

---

# 28. Performance

The site is a software engineering portfolio.

Performance is part of the product quality.

Targets:

- minimal unnecessary JavaScript
- responsive interaction
- optimized 3D/assets
- lazy-load heavy visuals
- no blocking animations
- reduced-motion support
- excellent Core Web Vitals where realistic

Do not sacrifice usability for visual effects.

---

# 29. Accessibility

Must include:

- keyboard accessibility
- visible focus states
- semantic HTML
- sufficient contrast
- reduced motion mode
- ARIA only when necessary
- standard navigation fallback
- no keyboard traps

Gamification must enhance accessibility rather than undermine it.

---

# 30. Anti-patterns

Do not create:

- generic developer hero with code editor screenshot
- Matrix green terminal
- endless glowing cards
- giant gradient blobs
- card grid everywhere
- skill progress bars
- oversized pill components everywhere
- fake OS desktop
- excessive typewriter effects
- overuse of monospace
- random 3D objects
- excessive animations
- overly artistic agency layouts
- marketing-SaaS template composition

---

# 31. Quality Test

Before accepting any component or page, ask:

1. Does it look like a premium software product?
2. Does it communicate design taste?
3. Does it still feel technical?
4. Is the hierarchy obvious?
5. Is the interaction purposeful?
6. Is it cleaner without this effect?
7. Does it resemble a template?
8. Would Raycast-level craft expose any weak spacing, typography or state?
9. Is the mobile version equally considered?
10. Does this component add evidence of engineering/design ability?

If the answer to #6 is yes, remove the effect.

---

# 32. Core Summary

The website should feel like:

**Raycast-level polish**
+
**Resend-quality custom visuals**
+
**technical product interface**
+
**subtle CLI/Vim interaction**
+
**warm dark visual identity**
+
**controlled gamification**

The final result should communicate:

> This person can design and build polished software products end to end.

The portfolio itself should be proof of that claim.