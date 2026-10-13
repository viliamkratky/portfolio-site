/**
 * Tiny event bus over `window` so the eager keyboard module, the lazy
 * command-menu island and the hero island can talk without importing each
 * other. Events fired before the command menu hydrates are queued.
 */

export type MenuMode = 'search' | 'help';

export type BusEvents = {
  'menu:open': { mode: MenuMode; query?: string };
  'hero:layer': { index: number };
  'key:press': { key: string };
  status: { text: string };
  'grid:toggle': undefined;
  'keys:changed': { enabled: boolean };
};

declare global {
  interface Window {
    __menuQueue?: BusEvents['menu:open'][];
    __menuReady?: boolean;
  }
}

export function emit<K extends keyof BusEvents>(name: K, detail?: BusEvents[K]) {
  if (name === 'menu:open' && !window.__menuReady) {
    (window.__menuQueue ??= []).push(detail as BusEvents['menu:open']);
  }
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function on<K extends keyof BusEvents>(name: K, fn: (detail: BusEvents[K]) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<BusEvents[K]>).detail);
  window.addEventListener(name, handler);
  return () => window.removeEventListener(name, handler);
}

let statusTimer: number | undefined;

/** Writes to the single polite status line (INTERACTION_SYSTEM §12). */
export function status(text: string) {
  const el = document.getElementById('status-line');
  if (!el) return;
  el.textContent = text;
  el.dataset.visible = text ? 'true' : 'false';
  window.clearTimeout(statusTimer);
  if (text) {
    statusTimer = window.setTimeout(() => {
      el.dataset.visible = 'false';
      window.setTimeout(() => (el.textContent = ''), 300);
    }, 2400);
  }
}

const KEYS_STORAGE = 'vk:keys';

export function keysEnabled(): boolean {
  try {
    return localStorage.getItem(KEYS_STORAGE) !== 'off';
  } catch {
    return true;
  }
}

export function setKeysEnabled(enabled: boolean) {
  try {
    localStorage.setItem(KEYS_STORAGE, enabled ? 'on' : 'off');
  } catch {
    /* storage unavailable: the setting lasts for this page only */
  }
  document.documentElement.dataset.keys = enabled ? 'on' : 'off';
  emit('keys:changed', { enabled });
}

export function toggleGrid() {
  const root = document.documentElement;
  if (root.hasAttribute('data-grid')) root.removeAttribute('data-grid');
  else root.setAttribute('data-grid', '');
  return root.hasAttribute('data-grid');
}
