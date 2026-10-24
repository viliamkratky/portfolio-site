/**
 * POST /api/contact: Cloudflare Pages Function behind the contact dialog.
 *
 * The rest of the site stays static; this is its only server code. Layers, in
 * order: same-origin check, production host check, honeypot and minimum fill
 * time (dropped silently), shared validation, Turnstile verification, then
 * delivery through Resend. Rate limiting is a WAF rule on this path (Pages
 * Functions have no binding).
 *
 * Secrets (Pages settings, or .dev.vars locally): TURNSTILE_SECRET_KEY,
 * RESEND_API_KEY. CONTACT_DRY_RUN=1 logs the message instead of sending it.
 */
import { site } from '../../src/config/site';
import { HONEYPOT, MIN_FILL_MS, validateContact } from '../../src/lib/contact';

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_DRY_RUN?: string;
}

const PRODUCTION_HOST = 'viliamkratky.dev';

/** Must be an address on a domain verified in Resend. */
const FROM = `${site.name} · portfolio <contact@${PRODUCTION_HOST}>`;

/** Cloudflare's published Turnstile test secrets (always pass / fail / spent): local dev and previews. */
const TEST_SECRETS = new Set([
  '1x0000000000000000000000000000000AA',
  '2x0000000000000000000000000000000AA',
  '3x0000000000000000000000000000000AA',
]);

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  if (!res.ok) return false;
  const outcome = (await res.json()) as { success?: boolean };
  return outcome.success === true;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  // Browsers always send Origin on a POST from fetch(); a mismatch is another site or a script.
  if (request.headers.get('origin') !== new URL(request.url).origin) return json({ ok: false, error: 'origin' }, 403);

  // With real keys (production) only the custom domain is accepted. The same function also answers on
  // *.pages.dev, which the WAF rate-limit rule on viliamkratky.dev does not cover. Previews use test keys.
  const secret = env.TURNSTILE_SECRET_KEY ?? '';
  if (secret && !TEST_SECRETS.has(secret) && new URL(request.url).hostname !== PRODUCTION_HOST) {
    return json({ ok: false, error: 'host' }, 403);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // Bot signals get a normal success response, so there is nothing to learn from probing.
  const elapsed = Number(form.get('t'));
  if (String(form.get(HONEYPOT) ?? '') || !(elapsed >= MIN_FILL_MS)) return json({ ok: true });

  const { data, errors } = validateContact({
    name: form.get('name'),
    email: form.get('email'),
    message: form.get('message'),
  });
  if (Object.keys(errors).length) return json({ ok: false, error: 'invalid', fields: errors }, 422);

  if (!env.TURNSTILE_SECRET_KEY || (!env.RESEND_API_KEY && env.CONTACT_DRY_RUN !== '1')) {
    console.error('contact: missing TURNSTILE_SECRET_KEY or RESEND_API_KEY');
    return json({ ok: false, error: 'config' }, 503);
  }

  const token = String(form.get('cf-turnstile-response') ?? '');
  if (!token || !(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, request.headers.get('cf-connecting-ip')))) {
    return json({ ok: false, error: 'captcha' }, 403);
  }

  const email = {
    from: FROM,
    to: [site.email],
    // The visitor's address is only ever a reply target, never a recipient.
    reply_to: data.email,
    subject: `Portfolio: message from ${data.name}`,
    text: `${data.message}\n\n--\n${data.name} <${data.email}>\nSent from the contact form on ${new URL(request.url).host}`,
  };

  if (env.CONTACT_DRY_RUN === '1') {
    console.log('contact (dry run)', JSON.stringify(email));
    return json({ ok: true });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify(email),
  });
  if (!res.ok) {
    console.error('contact: Resend', res.status, await res.text());
    return json({ ok: false, error: 'send' }, 502);
  }
  return json({ ok: true });
}
