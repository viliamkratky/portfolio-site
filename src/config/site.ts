/**
 * Site configuration: the single place for identity, links and status.
 *
 * Values marked TODO(owner) must be filled by the owner. A production build
 * fails while `email` is missing (see src/layouts/Base.astro), because a
 * portfolio without a way to make contact is not shippable.
 */
export const site = {
  name: 'Viliam Krátky',
  initials: 'VK',
  role: 'Design-minded Full-stack Engineer',
  shortRole: 'Software Engineer & Product Builder',
  description:
    'Viliam Krátky designs and builds digital products from interface to infrastructure: web products, interface engineering, content platforms and AI-enabled software.',

  /** Public contact email. */
  email: 'viliam@kratky.sk' as string,
  /** Full profile URLs, or leave empty to hide. */
  github: 'https://github.com/viliamkratky' as string,
  linkedin: 'https://www.linkedin.com/in/viliam-kr%C3%A1tky-85b753279/' as string,
  /** Resume PDF in /public (public version, without a phone number), or empty to hide. */
  resume: '/viliam-kratky-cv.pdf' as string,

  /** Shown in the footer. Split week between the two cities (same time zone). */
  locations: ['Bratislava, Slovakia', 'Brno, Czech Republic'],
  timeZone: 'Europe/Bratislava',

  /** DESIGN_SYSTEM §19 / plan D13: a real flag, not decoration. */
  available: true,
  availability: 'Available for new projects',
} as const;

export type NavRoute = {
  id: string;
  label: string;
  href: string;
  /** Second key of the `g x` sequence. */
  key: string;
  inNav: boolean;
};

/**
 * Route manifest. Header, footer, mobile menu, command palette, `g x`
 * shortcuts and the help overlay all read from this list (plan §4.2).
 */
export const routes: NavRoute[] = [
  { id: 'home', label: 'Home', href: '/', key: 'h', inNav: false },
  { id: 'work', label: 'Work', href: '/work', key: 'w', inNav: true },
  { id: 'services', label: 'Services', href: '/services', key: 's', inNav: true },
  { id: 'contact', label: 'Contact', href: '/contact', key: 'c', inNav: true },
];

/**
 * `:stack`: tools in actual daily use, grouped. TODO(owner): review.
 * Sourced from docs/POSITIONING.md §4–§7 and the projects on this site.
 */
export const stack: { group: string; items: string[] }[] = [
  { group: 'Interface', items: ['TypeScript', 'React', 'Astro', 'CSS / Tailwind', 'Twig'] },
  { group: 'Platform', items: ['Drupal', 'PHP', 'Node.js', 'REST APIs', 'Search API & facets'] },
  { group: 'Infrastructure', items: ['Docker', 'AWS', 'CI/CD', 'Git'] },
  { group: 'AI', items: ['Claude Code', 'Codex', 'Ollama / local LLMs', 'Agent workflows', 'RAG'] },
];
