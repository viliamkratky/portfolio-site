/**
 * Contact form rules shared by the dialog (src/interactive/contact.ts) and the
 * Pages Function (functions/api/contact.ts), so the browser and the server
 * reject exactly the same input.
 */

export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const;
export const MESSAGE_MIN = 10;

/** More links than this reads as spam; a first message rarely needs any. */
export const MAX_LINKS = 3;

/** Submissions faster than this are treated as bots and dropped silently. */
export const MIN_FILL_MS = 2500;

/** Name of the honeypot field. Real visitors never see or fill it. */
export const HONEYPOT = 'website';

export type ContactFields = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL = /[\u0000-\u001f\u007f]/;
const LINK = /\bhttps?:\/\/|\bwww\./gi;

export function validateContact(input: Record<keyof ContactFields, unknown>): {
  data: ContactFields;
  errors: ContactErrors;
} {
  const data: ContactFields = {
    name: String(input.name ?? '').trim(),
    email: String(input.email ?? '').trim(),
    message: String(input.message ?? '').trim(),
  };
  const errors: ContactErrors = {};

  if (!data.name) errors.name = 'Tell me who you are.';
  else if (data.name.length > CONTACT_LIMITS.name) errors.name = `Keep it under ${CONTACT_LIMITS.name} characters.`;
  else if (CONTROL.test(data.name)) errors.name = 'Use a single line.';

  if (!data.email) errors.email = 'I need an address to reply to.';
  else if (data.email.length > CONTACT_LIMITS.email || !EMAIL.test(data.email))
    errors.email = 'This does not look like an email address.';

  if (data.message.length < MESSAGE_MIN) errors.message = 'A sentence or two, please.';
  else if (data.message.length > CONTACT_LIMITS.message)
    errors.message = `Keep it under ${CONTACT_LIMITS.message} characters.`;
  else if ((data.message.match(LINK) ?? []).length > MAX_LINKS)
    errors.message = `Up to ${MAX_LINKS} links, please. Describe the rest in words.`;

  return { data, errors };
}
