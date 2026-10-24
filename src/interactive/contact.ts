/**
 * Contact dialog (src/components/contact/ContactDialog.astro).
 *
 * Any [data-contact-open] link opens the dialog instead of following its
 * mailto: href. Turnstile loads on the first open only, so ordinary page views
 * load nothing from a third party. The draft survives an accidental close
 * (sessionStorage), and every failure points to the plain email address.
 */
import { validateContact, type ContactErrors, type ContactFields } from '../lib/contact';
import { status } from './bus';

type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TOKEN_TIMEOUT = 15000;
const DRAFT_STORAGE = 'vk:contact-draft';
const FIELDS: (keyof ContactFields)[] = ['name', 'email', 'message'];

const dialog = document.getElementById('contact-dialog') as HTMLDialogElement | null;
if (dialog) setup(dialog);

function lenis() {
  return (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
}

function setup(dialog: HTMLDialogElement) {
  const form = dialog.querySelector<HTMLFormElement>('[data-contact-form]')!;
  const sent = dialog.querySelector<HTMLElement>('[data-contact-sent]')!;
  const slot = dialog.querySelector<HTMLElement>('[data-turnstile]')!;
  const formError = dialog.querySelector<HTMLElement>('[data-form-error]')!;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const submitLabel = submit.querySelector<HTMLElement>('[data-submit-label]')!;
  const idleLabel = submitLabel.textContent ?? '';

  let openedAt = 0;
  let busy = false;
  let widgetId: string | undefined;
  let token = '';
  const waiting: ((token: string) => void)[] = [];
  let loading: Promise<void> | undefined;

  const control = (name: keyof ContactFields) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;

  /* ------------------------------------------------------------ draft --- */

  try {
    const draft = JSON.parse(sessionStorage.getItem(DRAFT_STORAGE) ?? '{}') as Partial<ContactFields>;
    FIELDS.forEach((f) => draft[f] && (control(f).value = draft[f]));
  } catch {
    /* no draft, or storage unavailable */
  }

  const saveDraft = () => {
    try {
      sessionStorage.setItem(
        DRAFT_STORAGE,
        JSON.stringify(Object.fromEntries(FIELDS.map((f) => [f, control(f).value]))),
      );
    } catch {
      /* storage unavailable: the draft lasts until the page closes */
    }
  };

  /* --------------------------------------------------------- open / close --- */

  document.addEventListener('click', (e) => {
    const trigger = (e.target as HTMLElement).closest('[data-contact-open]');
    if (!trigger) return;
    e.preventDefault();
    open();
  });

  function open() {
    if (dialog.open) return;
    if (!sent.hidden) {
      sent.hidden = true;
      form.hidden = false;
    }
    dialog.showModal();
    lenis()?.stop();
    openedAt ||= Date.now();
    loadTurnstile().catch(() => {});
  }

  dialog.addEventListener('close', () => lenis()?.start());
  dialog.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));
  // A click on the backdrop lands on the <dialog> itself; the content wrapper covers everything else.
  dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());

  /* ------------------------------------------------------------ Turnstile --- */

  function loadTurnstile(): Promise<void> {
    if (!loading) {
      loading = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = TURNSTILE_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
          script.remove();
          reject(new Error('Turnstile failed to load'));
        };
        document.head.append(script);
      }).then(() => {
        widgetId = window.turnstile!.render(slot, {
          sitekey: dialog.dataset.sitekey,
          theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
          size: 'flexible',
          // Invisible unless Cloudflare needs the visitor to click.
          appearance: 'interaction-only',
          callback: (t: string) => {
            token = t;
            waiting.splice(0).forEach((resolve) => resolve(t));
          },
          'expired-callback': () => (token = ''),
        });
      });
      // A failed load can be retried on the next open or submit.
      loading.catch(() => (loading = undefined));
    }
    return loading;
  }

  function getToken(): Promise<string> {
    if (token) return Promise.resolve(token);
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error('Turnstile timed out')), TOKEN_TIMEOUT);
      waiting.push((t) => {
        window.clearTimeout(timer);
        resolve(t);
      });
    });
  }

  /* ------------------------------------------------------------- states --- */

  function showErrors(errors: ContactErrors) {
    FIELDS.forEach((f) => {
      const el = form.querySelector<HTMLElement>(`[data-error-for="${f}"]`)!;
      el.textContent = errors[f] ?? '';
      el.hidden = !errors[f];
      control(f).setAttribute('aria-invalid', String(Boolean(errors[f])));
    });
    const first = FIELDS.find((f) => errors[f]);
    if (first) control(first).focus();
  }

  function showFormError(text: string) {
    formError.querySelector('[data-error-text]')!.textContent = text;
    formError.hidden = !text;
  }

  function setBusy(label: string | null) {
    busy = label !== null;
    submit.disabled = busy;
    form.setAttribute('aria-busy', String(busy));
    submitLabel.textContent = label ?? idleLabel;
  }

  form.addEventListener('input', (e) => {
    saveDraft();
    const name = (e.target as HTMLInputElement).name as keyof ContactFields;
    if (control(name)?.getAttribute('aria-invalid') === 'true') {
      control(name).setAttribute('aria-invalid', 'false');
      form.querySelector<HTMLElement>(`[data-error-for="${name}"]`)!.hidden = true;
    }
  });

  /* ------------------------------------------------------------- submit --- */

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    showFormError('');

    const body = new FormData(form);
    const { data, errors } = validateContact({
      name: body.get('name'),
      email: body.get('email'),
      message: body.get('message'),
    });
    showErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      setBusy('Checking…');
      await loadTurnstile();
      body.set('cf-turnstile-response', await getToken());
      body.set('t', String(Date.now() - openedAt));

      setBusy('Sending…');
      const res = await fetch('/api/contact', { method: 'POST', body, headers: { accept: 'application/json' } });
      const out = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: ContactErrors };

      if (out.ok) {
        form.reset();
        saveDraft();
        showErrors({});
        form.hidden = true;
        sent.querySelector('[data-sent-email]')!.textContent = data.email;
        sent.hidden = false;
        sent.focus();
        status('Message sent');
      } else if (out.fields) {
        showErrors(out.fields);
      } else if (out.error === 'captcha') {
        showFormError('The spam check did not pass. Try again, or write to me directly:');
      } else {
        showFormError('The message could not be sent. Please write to me directly:');
      }
    } catch {
      showFormError('The message could not be sent. Please write to me directly:');
    } finally {
      setBusy(null);
      // Tokens are single-use: fetch a fresh one for the next attempt.
      token = '';
      if (widgetId) window.turnstile?.reset(widgetId);
    }
  });
}
