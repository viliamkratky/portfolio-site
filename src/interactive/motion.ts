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

function setupStory(tl: (el: HTMLElement) => gsap.core.Timeline | null) {
  document.querySelectorAll<HTMLElement>('[data-story]').forEach((story) => {
    const canvas = story.querySelector<HTMLCanvasElement>('canvas')!;
    const ctx = canvas.getContext('2d')!;
    const state = { p: reduce ? 1 : 0 };
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

    const t = tl(story);
    if (!t) return;
    t.from(story.querySelectorAll('.s1 .word'), { yPercent: 160, rotate: 4, duration: 1, stagger: 0.12, ease: 'power3.out' })
      .to({}, { duration: 0.5 })
      .to(story.querySelector('.s1'), { opacity: 0, scale: 0.9, filter: 'blur(10px)', duration: 0.9 })
      .to(state, { p: 1, duration: 1.4, ease: 'none', onUpdate: draw }, '<0.1')
      .from(story.querySelectorAll('.s2 .word'), { yPercent: 160, rotate: 4, duration: 1, stagger: 0.15, ease: 'power3.out' }, '-=0.5')
      .to({}, { duration: 0.6 });
  });
}

/* ---------------------------------------------------- work cursor card --- */

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

function setupCursorCard() {
  const card = document.querySelector<HTMLElement>('[data-cursor-card]');
  if (!card || !finePointer) return;
  const canvas = card.querySelector<HTMLCanvasElement>('canvas')!;
  const img = card.querySelector<HTMLImageElement>('img')!;
  const empty = card.querySelector<HTMLElement>('[data-empty]')!;
  const pos = { x: mouse.x, y: mouse.y };
  let timer = 0;

  const dither = (source: HTMLImageElement) => {
    const w = 160;
    const h = Math.round((w * source.naturalHeight) / source.naturalWidth);
    canvas.width = w;
    canvas.height = h;
    const c = canvas.getContext('2d')!;
    c.drawImage(source, 0, 0, w, h);
    const d = c.getImageData(0, 0, w, h);
    for (let i = 0; i < d.data.length; i += 4) {
      const px = (i / 4) % w;
      const py = Math.floor(i / 4 / w);
      const l = (0.2126 * d.data[i] + 0.7152 * d.data[i + 1] + 0.0722 * d.data[i + 2]) / 255;
      const on = l > BAYER[(py & 3) * 4 + (px & 3)];
      d.data[i] = on ? 255 : 0;
      d.data[i + 1] = on ? 47 : 0;
      d.data[i + 2] = 0;
      d.data[i + 3] = 255;
    }
    c.putImageData(d, 0, 0);
  };

  document.querySelectorAll<HTMLElement>('[data-preview]').forEach((row) => {
    row.addEventListener('pointerenter', () => {
      clearTimeout(timer);
      card.classList.remove('resolved');
      card.classList.add('on');
      card.style.aspectRatio = row.dataset.previewRatio ?? '';
      const src = row.dataset.preview;
      if (src) {
        empty.textContent = '';
        canvas.style.display = '';
        const source = new Image();
        source.onload = () => {
          dither(source);
          img.src = src;
          timer = window.setTimeout(() => card.classList.add('resolved'), 380);
        };
        source.src = src;
      } else {
        canvas.style.display = 'none';
        img.removeAttribute('src');
        empty.textContent = row.dataset.previewLabel ?? '';
      }
    });
    row.addEventListener('pointerleave', () => card.classList.remove('on', 'resolved'));
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

/* ------------------------------------------- work focus on touch --- */

/**
 * Touch screens have no hover, so the row crossing the middle of the viewport
 * becomes the "hovered" one: the others fade back. Opacity only, no width
 * change, so nothing re-wraps while scrolling.
 */
function setupWorkFocus() {
  if (!matchMedia('(hover: none)').matches) return;
  document.querySelectorAll<HTMLElement>('.work-list').forEach((list) => {
    const rows = [...list.querySelectorAll<HTMLElement>('.work-row')];
    let ticking = false;
    const update = () => {
      ticking = false;
      const mid = innerHeight / 2;
      const box = list.getBoundingClientRect();
      let best: HTMLElement | null = null;
      if (box.top < mid && box.bottom > mid) {
        let bestD = Infinity;
        for (const r of rows) {
          const b = r.getBoundingClientRect();
          const d = Math.abs(b.top + b.height / 2 - mid);
          if (d < bestD) {
            bestD = d;
            best = r;
          }
        }
      }
      rows.forEach((r) => r.toggleAttribute('data-active', r === best));
      list.toggleAttribute('data-focus', Boolean(best));
    };
    addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  });
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
if (!reduce) setupWorkFocus();

document.fonts.ready.then(() => {
  fitAll();
  fitWorkTitles();

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

  setupStory((el) =>
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: '+=280%', scrub: 0.8, pin: true } }),
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
  if (!reduce) ScrollTrigger.refresh();
});
