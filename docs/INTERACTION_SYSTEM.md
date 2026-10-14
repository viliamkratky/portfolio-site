# Portfolio Interaction System

## 1. Purpose

The interaction system defines how the portfolio behaves.

The website should feel like a polished software product rather than a static brochure.

Interaction should demonstrate:

- frontend engineering
- interface design
- technical identity
- attention to detail

The system is inspired by:

- Raycast for product-like interaction quality
- developer tooling for keyboard interaction
- Vim for optional navigation patterns
- CLI interfaces for discoverable commands
- Resend for rich interactive visual elements

Do not reproduce any specific product's interaction system directly.

---

# 2. Core Rule

The site has two interaction layers.

## Layer 1 — Standard Web Interface

Always available:

- navigation
- links
- scrolling
- pointer interaction
- touch interaction
- buttons
- forms

A visitor must be able to use the entire website normally without discovering any hidden feature.

## Layer 2 — Power User Interface

Optional:

- command palette
- Vim-inspired navigation
- CLI commands
- keyboard shortcuts
- easter eggs
- hidden states
- interactive technical visualizations

This layer rewards exploration.

It must never be required.

---

# 3. Interaction Philosophy

The website should reward curiosity.

Gamification means:

**discovery, control and exploration**

not:

- XP
- scores
- badges
- meaningless achievements
- fake game mechanics

The user should occasionally discover:

> "Oh, this website can do that too."

---

# 4. Command Palette

Primary shortcut:

```text
⌘K
Ctrl+K
```

The command palette is a first-class interface feature.

It should visually match the rest of the site and feel like a polished application interface.

---

# 5. Command Palette Categories

Possible command groups:

## Navigation

```text
Go to Home
Go to Work
Go to Services
Go to About
Go to Contact
```

## External

```text
Open GitHub
Open LinkedIn
Open Resume
```

## Interface

```text
Change Theme
Show Keyboard Shortcuts
Search
```

## Discovery

```text
System Info
View Stack
Project History
```

The command list should remain concise.

Do not create commands only to make the palette look full.

---

# 6. CLI Mode

Typing:

```text
:
```

may open a small command input or switch the command palette into command mode.

Example commands:

```text
:projects
:services
:about
:contact

:open github
:open linkedin
:open <project>

:theme dark
:theme light

:whoami
:stack
:history
:system
```

Optional Unix-inspired commands:

```text
:ls projects
:cat about.txt
```

Use these only where they remain understandable.

The CLI should be playful but functional.

---

# 7. Vim-inspired Navigation

Initial shortcut model:

```text
j
```

Move to next major section or next selectable item.

```text
k
```

Move to previous section/item.

Navigation shortcuts:

```text
g h     home
g w     work
g s     services
g a     about
g c     contact
```

Utilities:

```text
/       search
:       command mode
?       shortcut help
esc     close current modal/overlay
```

---

# 8. Shortcut Discovery

Keyboard features should be discoverable gradually.

Possible subtle hint:

```text
Press ? for shortcuts
```

This can appear in:

- footer
- first desktop visit
- command palette
- small system/status area

Do not interrupt the visitor with a tutorial modal.

---

# 9. Shortcut Help

`?` opens a lightweight overlay.

Example structure:

```text
KEYBOARD

Navigation
j / k       next / previous
g w         work
g s         services
g a         about

Interface
⌘K          command palette
/           search
:           command mode
esc         close
```

Use clear grouping.

---

# 10. Input Safety

Keyboard shortcuts must not execute when the visitor is:

- typing into an input
- typing into textarea
- interacting with editable content
- using a component where the shortcut would be unexpected

Do not override important browser or operating-system shortcuts.

---

# 11. Accessibility

Every interactive feature must remain accessible.

Requirements:

- visible keyboard focus
- predictable tab order
- semantic controls
- no keyboard traps
- ESC closes overlays
- standard navigation remains available
- reduced-motion mode
- touch alternatives for hover behavior

Power-user navigation should improve keyboard usability, not reduce it.

---

# 12. Command Feedback

Commands should produce subtle feedback.

Examples:

```text
Opened Work
Theme changed to Dark
Project loaded
```

Feedback may use:

- toast
- status line
- subtle visual response

Avoid noisy notifications.

---

# 13. Status UI

A small status element may reinforce the system identity.

Possible examples:

```text
● AVAILABLE
```

or:

```text
SYSTEM READY
```

or:

```text
BUILD 2026.10
```

These elements should be small and secondary.

They should not turn the page into a fake operating system.

---

# 14. Cursor Interaction

Pointer movement may influence selected visuals.

Possible behaviors:

- subtle local lighting
- texture reveal
- symbol reveal
- 3D object rotation
- diagram depth
- visual layer shift

Interactions should remain restrained.

Do not create a custom cursor for the entire website unless a concrete interaction requires it.

---

# 15. Hover States

Hover states should communicate affordance.

Preferred effects:

- border becomes slightly stronger
- subtle background shift
- arrow translates by 2–4px
- visual layer reveals
- icon changes state
- local lighting appears

Avoid:

- large scale transforms
- bouncing
- aggressive glow
- excessive rotation

---

# 16. Section Transitions

Transitions between page sections may use:

- line expansion
- mask reveal
- controlled fade
- slight translate
- technical marker transitions
- grain / lighting transitions

Avoid animating every text block independently.

The page should not feel like a scroll animation demo.

---

# 17. Visual Interaction

Important sections may contain custom interactive visualizations.

Examples:

- architecture diagram
- product interface
- code → UI transformation
- system layers
- data flow
- dependency graph
- timeline
- interactive 3D object

Interaction may reveal deeper information.

Example:

```text
Design
Frontend
Backend
AI
Infrastructure
```

Hovering or selecting a layer may alter the visualization.

---

# 18. Hero Interaction

The hero should include one major signature interaction.

It should not simply be animated text.

Possible concept:

A multi-layer product/system object.

Layers:

```text
DESIGN
FRONTEND
BACKEND
AI
INFRA
```

The visitor may explore the layers by:

- pointer
- keyboard
- subtle scroll interaction

Optional keys:

```text
1   Design
2   Frontend
3   Backend
4   AI
5   Infrastructure
```

These shortcuts must not be necessary to understand the visual.

---

# 19. Grain Interaction

Grain can be dynamic.

Examples:

- slightly stronger under pointer
- changes density across layers
- reveals hidden symbols
- responds slowly to interaction

Keep changes subtle.

The grain itself should never become the focus.

---

# 20. Easter Eggs

Easter eggs are allowed.

They should relate to:

- programming
- software tools
- the author's work
- the website's system language

Possible ideas:

```text
:whoami
:system
:stack
```

or a hidden keyboard sequence.

Do not use easter eggs that:

- create confusion
- block content
- interfere with normal navigation
- significantly increase complexity for no value

---

# 21. 404

The 404 page may participate in the technical interaction language.

Potential copy concept:

```text
404
command not found
```

Provide clear navigation home.

The joke must not replace usability.

---

# 22. Loading States

Avoid unnecessary full-screen loading screens.

For actual asynchronous content, use system-consistent states.

Examples:

```text
Loading…
Fetching project…
```

or subtle technical variants.

Do not fake loading to make the website feel more technical.

---

# 23. Mobile Interaction

Mobile should not attempt to reproduce all desktop power-user features.

Remove or simplify:

- Vim hints
- keyboard commands
- hover-only reveals
- complex pointer interactions

Preserve:

- command/search access where useful
- tap interactions
- visual storytelling
- layered diagrams
- animations that remain performant

---

# 24. Reduced Motion

Respect:

```css
prefers-reduced-motion
```

When enabled:

- disable non-essential parallax
- disable large pointer movement
- simplify transitions
- preserve functional state changes

The site must remain visually coherent without animation.

---

# 25. Interaction Quality Test

Before shipping an interaction, ask:

1. Does it help orientation?
2. Does it reveal useful information?
3. Does it communicate technical identity?
4. Is it satisfying without becoming distracting?
5. Does the normal UI still work without it?
6. Does it work with keyboard?
7. Does it degrade gracefully on mobile?
8. Is the performance cost justified?
9. Would removing it improve clarity?

If the interaction exists only because it looks impressive, reconsider it.

---

# 26. Interaction Summary

The desired interaction model is:

```text
Standard web UI
+
Command palette
+
Optional Vim navigation
+
CLI-inspired commands
+
Technical visual exploration
+
Subtle easter eggs
```

The intended reaction is:

> This feels like a real software product.

Not:

> This portfolio is pretending to be a terminal.