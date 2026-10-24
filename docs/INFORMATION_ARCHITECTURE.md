# Portfolio Information Architecture

## 1. Purpose

This document defines the structural architecture of the portfolio.

It does not define final copy.

The goal is to create a site that is:

- easy to understand
- easy to navigate
- suitable for recruiters
- useful for potential clients
- capable of showing deep technical case studies
- compatible with command-based navigation
- scalable as new work is added

---

# 2. Primary Audiences

The website should work for several visitor types.

## 2.1 Hiring / Engineering

They want to quickly understand:

- technical ability
- engineering depth
- experience
- projects
- role
- technologies
- problem-solving ability

## 2.2 Potential Clients

They want to know:

- what can be delivered
- what types of projects are suitable
- whether design is included
- whether full implementation is possible
- examples of previous work
- how to get in contact

## 2.3 Technical Peers

They may explore:

- architecture
- decisions
- technical write-ups
- tools
- experiments
- open-source work

The architecture should serve all three without creating separate websites.

---

# 3. Primary Navigation

Recommended desktop navigation:

```text
Work
Services
About
Contact
```

Optional utilities:

```text
GitHub
⌘K
```

Avoid a crowded main navigation.

Do not include separate top-level items for:

- Tech Stack
- Skills
- Resume
- Blog
- Experience

unless future content justifies them.

These can exist inside other sections or command palette actions.

---

# 4. Core Routes

Recommended structure:

```text
/
├── work
│   └── [project]
├── services
├── about
└── contact
```

Potential future expansion:

```text
/notes
```

Do not create `/notes` until there is enough high-quality material to justify it.

---

# 5. Homepage

The homepage is the primary overview.

Its role is to answer quickly:

- who this person is
- what kind of work they do
- what they can build
- what their strongest work looks like
- what to do next

The homepage should not contain every detail.

It should route visitors into deeper pages.

Suggested structural flow:

```text
Hero
↓
Selected Work
↓
Capabilities / Services
↓
Selected Engineering / Design Evidence
↓
About Preview
↓
Contact / CTA
↓
Footer
```

The exact visual order may change during design.

---

# 6. Hero

The hero should establish:

- professional identity
- visual identity
- engineering/design combination
- signature interaction

It should contain:

- concise positioning
- one primary CTA
- one secondary CTA
- signature interactive visual

Avoid stuffing the hero with:

- long bio
- technology lists
- experience timeline
- all services
- badges
- statistics without value

---

# 7. Work

`/work`

Purpose:

Show selected work as substantial product/engineering case studies.

Projects should not be presented as identical cards.

The overview may support:

- featured work
- professional work
- personal products
- experiments

Only introduce categories if the number of projects justifies them.

---

# 8. Project Page

Route:

```text
/work/[project]
```

A project should be treated as a case study.

Potential structure:

```text
Project Hero

Overview

Context / Problem

Role / Contribution

Visual Product Story

Architecture / System

Key Decisions

Technical Challenges

Design / Interface Decisions

Result

Reflection / What I Would Change

Related Work
```

Not every project needs every section.

The page structure should adapt to the project.

Avoid forcing all projects into one rigid template.

---

# 9. Project Evidence Types

Different projects may demonstrate different abilities.

Possible evidence:

- deployed product
- interface screenshots
- design evolution
- architecture diagrams
- technical decisions
- code snippets
- CMS architecture
- deployment flow
- performance changes
- data flow
- user flow
- animation / interaction
- AI workflow
- system constraints

The portfolio should show evidence rather than merely claim skills.

---

# 10. Services

Route:

```text
/services
```

The service architecture is based on outcomes.

Recommended capability groups:

## Web Products

Complete design and implementation of websites and web applications.

## Frontend & Interface Engineering

Complex modern interfaces, redesigns and frontend implementation.

## CMS & Content Platforms

Content-heavy, multilingual and structured publishing systems.

## AI-enabled Software

Useful AI features integrated into real products.

## Technical Prototypes & MVPs

Rapid technical validation and product foundations.

The final naming may change, but these capability areas are already established.

---

# 11. Services Page Structure

Possible structure:

```text
Intro
↓
Capability areas
↓
How I work
↓
Relevant selected work
↓
Collaboration / project fit
↓
Contact
```

Do not turn the page into a generic agency services page.

Avoid:

```text
Our process
Our solutions
Transform your business
```

The tone should remain individual, technical and concrete.

---

# 12. About

Route:

```text
/about
```

Purpose:

Explain professional context and working style.

Potential areas:

```text
Professional overview
Current context
Engineering philosophy
Design perspective
AI-native workflow
Selected experience
Education
Tools / environment
```

Avoid writing a long autobiography.

The page should explain how the person works and what makes the approach distinct.

---

# 13. Contact

Route:

```text
/contact
```

Keep it simple.

Options:

- contact form, opened as a dialog from every "Let's talk" CTA (needs JS)
- email, always visible, with a copy button (the path without JS)
- LinkedIn
- GitHub

The form was added on 2026-10-15 because a `mailto:` CTA fails for visitors without a mail client. Rationale and
bot protection are in `BUILD_LOG.md`.

A potential client or employer should never need to search for contact information.

Contact should also be accessible through:

```text
⌘K
:contact
```

---

# 14. Resume

A resume does not need a top-level navigation item.

Possible access:

- About
- footer
- command palette
- direct URL
- hero secondary action if appropriate

Command:

```text
:resume
```

---

# 15. GitHub

GitHub should be easily accessible but should not replace case studies.

A repository alone rarely communicates:

- context
- decisions
- role
- constraints
- outcomes

Use GitHub as supporting evidence.

---

# 16. Footer

The footer may carry more technical personality than the primary navigation.

Possible elements:

```text
GitHub
LinkedIn
Email
Resume

Press ? for shortcuts

BUILD 2026.xx
```

Potential subtle ending:

```text
EOF
```

Use only if it remains tasteful.

---

# 17. Command Navigation Mapping

Command palette routes should mirror the information architecture.

Examples:

```text
Home
Work
Services
About
Contact
```

CLI equivalents:

```text
:home
:projects
:services
:about
:contact
```

Deep navigation:

```text
:open <project>
```

The command system should never create a second conflicting architecture.

It is only another interface to the same structure.

---

# 18. Search

If search is implemented, it should search meaningful content.

Potential searchable objects:

- projects
- services
- notes
- technologies
- case-study sections

Do not add search to a site with too little content.

The `/` shortcut may initially open navigation search / command palette rather than a separate full-text system.

---

# 19. Notes / Writing

A future `/notes` section is possible.

Suitable topics:

- technical decisions
- system design
- frontend experiments
- AI workflows
- lessons from projects
- developer tooling

Do not launch an empty blog.

Only add this section once a real body of useful writing exists.

---

# 20. Content Depth Model

Use progressive disclosure.

Homepage:

```text
summary
```

Work overview:

```text
project snapshot
```

Project detail:

```text
deep evidence
```

Technical note:

```text
optional maximum depth
```

This allows the site to remain clean without sacrificing technical substance.

---

# 21. Mobile Architecture

On mobile, preserve the same information hierarchy.

Simplify navigation.

Potential navigation:

```text
Menu
⌘K equivalent / search icon
```

Do not hide important content only because complex desktop layouts cannot be reproduced.

Recompose the layout rather than removing meaning.

---

# 22. URL Philosophy

URLs should be predictable and clean.

Good:

```text
/work/medical-navigator
/work/decision-watchdog
/services
/about
```

Avoid:

```text
/projects/project-01-final
/portfolio-items/...
```

---

# 23. Architecture Principles

The site architecture should follow these rules:

1. The homepage explains the overall identity.
2. Work proves capability.
3. Services explain commercial usefulness.
4. About explains approach and context.
5. Contact provides an obvious next step.
6. Advanced technical depth is optional.
7. Command navigation mirrors normal navigation.
8. No section should exist only because portfolios usually have it.

---

# 24. Current Sitemap

Current recommended version:

```text
/
├── /work
│   ├── /work/[project]
│   └── ...
├── /services
├── /about
└── /contact
```

Utilities:

```text
Resume
GitHub
LinkedIn
Command Palette
Search / navigation
Keyboard Help
```

Possible future:

```text
/notes
```

---

# 25. Success Test

A visitor should be able to answer these questions quickly:

```text
Who is this?
What does he build?
Is the work technically serious?
Does he have design ability?
Can he deliver a complete product?
What projects prove it?
Could I hire him?
How do I contact him?
```

If the architecture makes any of these difficult, simplify it.