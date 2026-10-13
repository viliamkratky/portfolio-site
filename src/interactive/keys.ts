/**
 * Keyboard manager: the only global keydown listener (plan §4.5).
 *
 * Layer 2 only: everything here has a pointer / touch equivalent.
 * Guards: never inside editable fields, never with Ctrl/Alt/Meta (except
 * ⌘K / Ctrl+K), never during IME composition, and single-key shortcuts can
 * be switched off from the help overlay (WCAG 2.1.4).
 */
import { emit, keysEnabled, status, toggleGrid } from './bus';

type RouteKey = { key: string; href: string; label: string };

const routes: RouteKey[] = JSON.parse(document.getElementById('route-keys')?.textContent ?? '[]');

const SEQUENCE_TIMEOUT = 800;
let pendingG = false;
let pendingTimer: number | undefined;
let lastMove = 0;

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target.closest('[data-keys="off"]')) return true;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function overlayOpen(): boolean {
  return Boolean(document.querySelector('[cmdk-dialog], dialog[open]'));
}

function navTargets(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('[data-nav-item]')].filter(
    (el) => el.offsetParent !== null,
  );
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function moveFocus(direction: 1 | -1) {
  const targets = navTargets();
  if (!targets.length) return;
  const line = window.innerHeight * 0.3;
  const current = targets.findIndex((el) => el.classList.contains('is-nav-current'));
  let from = current;
  // Trust the last target while a smooth scroll may still be running;
  // otherwise re-anchor to what the visitor is looking at.
  const recent = performance.now() - lastMove < 1500;
  if (from === -1 || (!recent && Math.abs(targets[from].getBoundingClientRect().top) > window.innerHeight)) {
    // Start from the item currently at the reading line.
    from = -1;
    targets.forEach((el, i) => {
      if (el.getBoundingClientRect().top <= line + 4) from = i;
    });
  }
  const next = Math.max(0, Math.min(targets.length - 1, from + direction));
  lastMove = performance.now();
  const el = targets[next];
  targets.forEach((t) => t.classList.remove('is-nav-current', 'is-nav-target'));
  el.classList.add('is-nav-current');
  void el.offsetWidth;
  el.classList.add('is-nav-target');
  if (!el.hasAttribute('tabindex') && !/^(A|BUTTON)$/.test(el.tagName)) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -96 });
  else el.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
  const label = el.dataset.navItem || el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 40);
  if (label) status(`${next + 1}/${targets.length} · ${label}`);
}

function heroInView() {
  return document.documentElement.dataset.heroInView === 'true';
}

function go(href: string, label: string) {
  status(`Opening ${label}`);
  window.location.href = href;
}

document.addEventListener('keydown', (e) => {
  if (e.isComposing || e.defaultPrevented) return;

  // ⌘K / Ctrl+K works everywhere, including inside inputs.
  if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    emit('menu:open', { mode: 'search' });
    return;
  }

  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (isEditable(e.target) || overlayOpen()) return;

  document.documentElement.dataset.kbd = 'true';
  emit('key:press', { key: e.key });

  if (!keysEnabled()) return;

  if (pendingG) {
    pendingG = false;
    window.clearTimeout(pendingTimer);
    const route = routes.find((r) => r.key === e.key.toLowerCase());
    if (route) {
      e.preventDefault();
      go(route.href, route.label);
    } else {
      status('');
    }
    return;
  }

  switch (e.key) {
    case 'j':
      e.preventDefault();
      moveFocus(1);
      break;
    case 'k':
      e.preventDefault();
      moveFocus(-1);
      break;
    case 'g':
      pendingG = true;
      status('g…');
      pendingTimer = window.setTimeout(() => {
        pendingG = false;
        status('');
      }, SEQUENCE_TIMEOUT);
      break;
    case '/':
      e.preventDefault();
      emit('menu:open', { mode: 'search' });
      break;
    case ':':
      e.preventDefault();
      emit('menu:open', { mode: 'search', query: ':' });
      break;
    case '?':
      e.preventDefault();
      emit('menu:open', { mode: 'help' });
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
      if (heroInView()) emit('hero:layer', { index: Number(e.key) - 1 });
      break;
  }
});

window.addEventListener('grid:toggle', () => {
  status(toggleGrid() ? 'Grid overlay on' : 'Grid overlay off');
});

// Command-menu triggers (header, mobile menu, instrument section).
document.addEventListener('click', (e) => {
  const trigger = (e.target as HTMLElement).closest<HTMLElement>('[data-menu-open]');
  if (!trigger) return;
  e.preventDefault();
  const mode = trigger.dataset.menuOpen === 'help' ? 'help' : 'search';
  emit('menu:open', { mode, query: trigger.dataset.menuQuery });
});

document.querySelectorAll<HTMLElement>('[data-js-only]').forEach((el) => el.removeAttribute('hidden'));
document.documentElement.dataset.keys = keysEnabled() ? 'on' : 'off';

// Copy-to-clipboard buttons.
document.addEventListener('click', async (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-copy]');
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(btn.dataset.copy ?? '');
    status(`Copied ${btn.dataset.copyLabel ?? 'to clipboard'}`);
    btn.dataset.copied = 'true';
    window.setTimeout(() => delete btn.dataset.copied, 1600);
  } catch {
    status('Copy failed. Select the text instead.');
  }
});
