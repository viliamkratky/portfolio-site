/**
 * Turnstile site key for the contact dialog, read at build time.
 *
 * Production and preview builds take it from PUBLIC_TURNSTILE_SITE_KEY (Pages
 * build settings; previews use Cloudflare's always-pass test key). Development
 * falls back to that test key. A production build without a key ships no form:
 * the "Let's talk" CTA stays a plain mailto: link.
 *
 * Kept apart from src/lib/contact.ts because the Pages Function imports that
 * module and has no `import.meta.env`.
 */
const TEST_SITE_KEY = '1x00000000000000000000AA';

export const turnstileSiteKey: string =
  import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || (import.meta.env.DEV ? TEST_SITE_KEY : '');

export const contactFormEnabled = Boolean(turnstileSiteKey);
