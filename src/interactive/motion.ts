/**
 * Motion layer: smooth scroll, kinetic typography and scroll scenes.
 *
 * Progressive enhancement only: every scene is complete and legible as static
 * HTML. Under prefers-reduced-motion nothing here animates; scenes render in
 * their final state.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(any-hover: hover) and (any-pointer: fine)').matches;
const root = document.documentElement;

export const mouse = { x: -9999, y: -9999, moved: 0 };
addEventListener(
  'pointermove',
  (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.moved = performance.now();
  },
  { passive: true },
);

/* ------------------------------------------------------------ fit text --- */

/** Scales `.fit` lines so they fill their container's content width at rest. */
function fitAll() {
  document.querySelectorAll<HTMLElement>('.fit').forEach((el) => {
    const parent = el.parentElement!;
    const cs = getComputedStyle(parent);
    const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    el.style.fontSize = '100px';
    el.style.display = 'inline-block';
    const w = el.getBoundingClientRect().width;
    el.style.display = '';
    if (!w || !avail) return;
    const ratio = Number(el.dataset.fit ?? 0.96);
    el.style.fontSize = `${Math.floor(((100 * avail) / w) * ratio)}px`;
  });
}

/**
 * Work titles stretch on hover (wdth 125, wght 800). Size them so the widest
 * title still fits its cell in that state; otherwise hover would re-wrap the line.
 */
function fitWorkTitles() {
  const titles = [...document.querySelectorAll<HTMLElement>('.work-title')];
  if (!titles.length) return;
  titles.forEach((t) => (t.style.fontSize = ''));
  if (!matchMedia('(min-width: 48rem) and (any-hover: hover)').matches) return;
  const base = parseFloat(getComputedStyle(titles[0]).fontSize);
  let ratio = 1;
  for (const t of titles) {
    const inner = t.firstElementChild as HTMLElement | null;
    if (!inner) continue;
    const prev = t.style.cssText;
    t.style.transition = 'none';
    t.style.fontStretch = '125%';
    t.style.fontWeight = '800';
    const need = inner.getBoundingClientRect().width;
    const have = t.clientWidth;
    t.style.cssText = prev;
    if (need > 0 && have > 0) ratio = Math.min(ratio, have / need);
  }
  if (ratio < 1) titles.forEach((t) => (t.style.fontSize = `${Math.floor(base * ratio * 0.98)}px`));
}

/* ------------------------------------------------- kinetic typography --- */

type Char = { el: HTMLElement; w: number; s: number };
const kinetics: { el: HTMLElement; chars: Char[]; rest: number; max: number }[] = [];

function splitKinetic() {
  document.querySelectorAll<HTMLElement>('[data-kinetic]').forEach((el) => {
    const text = el.textContent!.trim();
    el.textContent = '';
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', text);
    const rest = Number(el.dataset.rest ?? 560);
    const chars: Char[] = [];
    for (const ch of text) {
      const span = document.createElement('span');
      span.className = 'k';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = ch === ' ' ? ' ' : ch;
      span.style.fontVariationSettings = `"wght" ${rest}, "wdth" 100`;
      el.appendChild(span);
      chars.push({ el: span, w: rest, s: 100 });
    }
    kinetics.push({ el, chars, rest, max: Number(el.dataset.max ?? 900) });
  });
}

function kineticLoop(now: number) {
  const idle = !finePointer || now - mouse.moved > 2500;
  for (const k of kinetics) {
    const r = k.el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) continue;
    const fs = parseFloat(k.el.style.fontSize || getComputedStyle(k.el).fontSize);
    const radius = Math.max(200, fs * 2.1);
    k.chars.forEach((c, i) => {
      let t: number;
      if (idle) {
        t = (Math.sin(now / 900 - i * 0.45) + 1) / 2;
        t = t * t * 0.5;
      } else {
        const b = c.el.getBoundingClientRect();
        const d = Math.hypot(mouse.x - (b.left + b.width / 2), mouse.y - (b.top + b.height / 2));
        t = Math.max(0, 1 - d / radius);
        t = t * t * (3 - 2 * t);
      }
      const tw = k.rest + (k.max - k.rest) * t;
      const ts = 92 + 33 * t;
      c.w += (tw - c.w) * 0.14;
      c.s += (ts - c.s) * 0.14;
      c.el.style.fontVariationSettings = `"wght" ${c.w.toFixed(1)}, "wdth" ${c.s.toFixed(1)}`;
    });
  }
  requestAnimationFrame(kineticLoop);
}

/* ------------------------------------------------------- halftone story --- */

/** Where the field stops: solid from the bottom, still halftone across the top third. */
const STORY_END = 0.72;

/**
 * Gives both story beats one font size, the largest at which no word is wider
 * than the content box and neither beat is taller than most of the small viewport.
 * On a phone the longest word sets it; on a wide screen the height does.
 */
function fitStory() {
  document.querySelectorAll<HTMLElement>('[data-story]').forEach((story) => {
    const beats = [...story.querySelectorAll<HTMLElement>('.s1, .s2')];
    const maxH = root.clientHeight * 0.62;
    const fits = (px: number) =>
      beats.every((el) => {
        el.style.fontSize = `${px}px`;
        const cs = getComputedStyle(el);
        const avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        return el.offsetHeight <= maxH && [...el.querySelectorAll<HTMLElement>('.mask')].every((m) => m.offsetWidth <= avail);
      });
    let lo = 32;
    let hi = 400;
    while (hi - lo > 1) {
      const mid = Math.round((lo + hi) / 2);
      if (fits(mid)) lo = mid;
      else hi = mid;
    }
    beats.forEach((el) => (el.style.fontSize = `${Math.floor(lo * 0.97)}px`));
  });
}

function setupStory(tl: (el: HTMLElement, onToggle: (self: ScrollTrigger) => void) => gsap.core.Timeline | null) {
  document.querySelectorAll<HTMLElement>('[data-story]').forEach((story) => {
    const canvas = story.querySelector<HTMLCanvasElement>('canvas')!;
    const ctx = canvas.getContext('2d')!;
    const state = { p: reduce ? STORY_END : 0 };
    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const step = 16;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = getComputedStyle(root).getPropertyValue('--invert');
      for (let y = step / 2; y < h + step; y += step) {
        const fromBottom = 1 - y / h;
        for (let x = step / 2; x < w + step; x += step) {
          const n = Math.sin(x * 0.013 + y * 0.008) * 0.08 * Math.min(1, state.p * 4);
          const local = Math.min(1, Math.max(0, state.p * 2.15 - fromBottom * 0.9 + n));
          if (local <= 0.01) continue;
          ctx.beginPath();
          ctx.arc(x, y, step * 0.74 * local, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    const size = () => {
      const dpr = Math.min(2, devicePixelRatio);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    size();
    addEventListener('resize', size);
    new MutationObserver(draw).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    // While the scene is pinned, iOS Safari can show the page below it: its floating
    // toolbar reaches past the large viewport the section covers. The page takes the
    // scene's colour once the field has filled the bottom edge (from p ≈ 0.47).
    let pinned = false;
    const edge = () => root.toggleAttribute('data-story-dark', pinned && state.p > 0.5);

    const t = tl(story, (self) => {
      pinned = self.isActive;
      edge();
    });
    if (!t) return;
    t.from(story.querySelectorAll('.s1 .word'), { yPercent: 160, rotate: 4, duration: 1, stagger: 0.12, ease: 'power3.out' })
      .to({}, { duration: 0.5 })
      .to(story.querySelector('.s1'), { opacity: 0, scale: 0.9, filter: 'blur(10px)', duration: 0.9 })
      .to(state, { p: STORY_END, duration: 1.4, ease: 'none', onUpdate: () => (draw(), edge()) }, '<0.1')
      .from(story.querySelectorAll('.s2 .word'), { yPercent: 160, rotate: 4, duration: 1, stagger: 0.15, ease: 'power3.out' }, '-=0.5')
      .to({}, { duration: 0.6 });
  });
}

/* ---------------------------------------------------- work cursor card --- */

function setupCursorCard() {
  const card = document.querySelector<HTMLElement>('[data-cursor-card]');
  const rows = [...document.querySelectorAll<HTMLElement>('[data-preview]')];
  if (!card || !rows.length || !finePointer) return;
  const empty = card.querySelector<HTMLElement>('[data-empty]')!;
  const pos = { x: mouse.x, y: mouse.y };
  const previews = new Map<HTMLElement, HTMLImageElement>();

  // Fetch and decode every preview before the list is reached, so hovering shows the image at once.
  const load = () => {
    if (previews.size) return;
    for (const row of rows) {
      if (!row.dataset.preview) continue;
      const img = new Image();
      img.alt = '';
      img.src = row.dataset.preview;
      img.decode().catch(() => {});
      card.appendChild(img);
      previews.set(row, img);
    }
  };
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      load();
    },
    { rootMargin: '100% 0px' },
  );
  io.observe(rows[0].closest('ol') ?? rows[0]);

  rows.forEach((row) => {
    row.addEventListener('pointerenter', () => {
      load();
      const img = previews.get(row);
      previews.forEach((p) => p.classList.toggle('active', p === img));
      empty.textContent = img ? '' : (row.dataset.previewLabel ?? '');
      card.style.aspectRatio = row.dataset.previewRatio ?? '';
      card.classList.add('on');
    });
    row.addEventListener('pointerleave', () => card.classList.remove('on'));
  });

  const loop = () => {
    pos.x += (mouse.x - pos.x) * 0.12;
    pos.y += (mouse.y - pos.y) * 0.12;
    const vx = mouse.x - pos.x;
    card.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(32px, -50%) rotate(${Math.max(-8, Math.min(8, vx * 0.06))}deg)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* ------------------------------------------------------------ terminal --- */

function setupTerminal() {
  document.querySelectorAll<HTMLElement>('[data-term]').forEach((term) => {
    const lines = [...term.querySelectorAll<HTMLElement>('[data-line]')];
    if (reduce) {
      lines.forEach((l) => l.insertAdjacentHTML('afterbegin', `<span class="term-prompt">${l.dataset.line}</span>`));
      return;
    }
    const outputs = lines.map((l) => l.innerHTML);
    lines.forEach((l) => {
      l.innerHTML = '';
      l.setAttribute('aria-hidden', 'true');
    });
    const sr = document.createElement('div');
    sr.className = 'sr-only';
    sr.innerHTML = lines.map((l, i) => `<p>${l.dataset.line}: ${outputs[i]}</p>`).join('');
    term.appendChild(sr);

    let typed = false;
    new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting || typed) return;
        typed = true;
        for (let i = 0; i < lines.length; i++) {
          const l = lines[i];
          const prompt = document.createElement('span');
          prompt.className = 'term-prompt';
          l.appendChild(prompt);
          const caret = document.createElement('span');
          caret.className = 'term-caret';
          for (const ch of l.dataset.line!) {
            prompt.textContent += ch;
            prompt.appendChild(caret);
            await new Promise((r) => setTimeout(r, 40 + Math.random() * 40));
          }
          await new Promise((r) => setTimeout(r, 240));
          caret.remove();
          const out = document.createElement('span');
          out.className = 'term-out';
          out.innerHTML = outputs[i];
          l.appendChild(out);
          await new Promise((r) => setTimeout(r, 120));
        }
        lines[lines.length - 1].insertAdjacentHTML('beforeend', ' <span class="term-caret"></span>');
      },
      { threshold: 0.35 },
    ).observe(term);
  });
}

/* -------------------------------------------------------------- magnet --- */

const MAGNET_MAX = 24;

function setupMagnets() {
  if (!finePointer) return;
  document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((m) => {
    const strength = Number(m.dataset.magnet || 0.3);
    // Capped travel: a large target must not drift over its neighbours and steal their clicks.
    const pull = (d: number) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, d));
    m.addEventListener('pointermove', (e) => {
      const r = m.getBoundingClientRect();
      gsap.to(m, {
        x: pull((e.clientX - (r.left + r.width / 2)) * strength),
        y: pull((e.clientY - (r.top + r.height / 2)) * strength * 1.3),
        duration: 0.6,
        ease: 'power3.out',
      });
    });
    m.addEventListener('pointerleave', () => gsap.to(m, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' }));
    m.addEventListener('pointerdown', () => gsap.fromTo(m, { scale: 0.95 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.35)' }));
  });
}

/* ------------------------------------------------------- scroll reveals --- */

function setupReveals() {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const words = el.querySelectorAll('.word');
    const targets = words.length ? words : [el];
    gsap.from(targets, {
      yPercent: words.length ? 160 : 0,
      y: words.length ? 0 : 40,
      opacity: words.length ? 1 : 0,
      duration: 1.1,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    gsap.to(el, {
      xPercent: Number(el.dataset.parallax),
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top top', end: 'bottom top', scrub: true },
    });
  });
}

/* ---------------------------------------------------------------- boot --- */

splitKinetic();
setupTerminal();

document.fonts.ready.then(() => {
  fitAll();
  fitWorkTitles();
  fitStory();

  if (reduce) {
    setupStory(() => null);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  // Mobile URL-bar show/hide changes the viewport height; don't re-layout pinned scenes for it.
  ScrollTrigger.config({ ignoreMobileResize: true });
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  (window as unknown as { __lenis: Lenis }).__lenis = lenis;

  // Anchor links go through Lenis so they stay smooth and respect the header.
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
    if (!a) return;
    const hash = a.getAttribute('href')!.replace(/^\//, '');
    if (a.getAttribute('href')!.startsWith('/#') && location.pathname !== '/') return;
    const target = hash.length > 1 ? document.querySelector(hash) : null;
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target as HTMLElement, { offset: -80 });
    history.replaceState(null, '', hash);
  });

  setupStory((el, onToggle) =>
    gsap.timeline({
      // anticipatePin applies the pin a little early on fast (touch momentum) scrolls,
      // so the scene doesn't jump as it switches to position: fixed. A thumb covers the
      // same distance with more effort than a wheel, so touch gets a shorter scene.
      scrollTrigger: { trigger: el, start: 'top top', end: finePointer ? '+=280%' : '+=180%', scrub: 0.8, pin: true, anticipatePin: 1, onToggle },
    }),
  );
  setupReveals();
  setupCursorCard();
  setupMagnets();
  requestAnimationFrame(kineticLoop);
  ScrollTrigger.refresh();
});

let lastWidth = innerWidth;
addEventListener('resize', () => {
  // Height-only changes (mobile browser chrome) need no re-fit.
  if (innerWidth === lastWidth) return;
  lastWidth = innerWidth;
  fitAll();
  fitWorkTitles();
  fitStory();
  if (!reduce) ScrollTrigger.refresh();
});
