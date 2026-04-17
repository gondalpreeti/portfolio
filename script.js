/**
 * PREETI GONDAL — Premium Portfolio v2
 * Interaction & Motion System
 *
 * Modules:
 *  1. Custom magnetic cursor
 *  2. Scroll reveal (IntersectionObserver)
 *  3. Parallax (portrait + hero elements)
 *  4. Nav scroll state
 *  5. Accordion (experience items)
 *  6. Smooth entrance sequence (hero load)
 *  7. Cursor label on hover (projects)
 *  8. Active nav link tracking
 */

'use strict';

/* ============================================================
   UTILITIES
============================================================ */
const qs  = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
const isMobile = () => window.matchMedia('(pointer: coarse)').matches;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const lerp  = (a, b, t) => a + (b - a) * t;

/* ============================================================
   0. CLEAN STALE LOADER ARTIFACTS
   Removes any leftover loader nodes/text from previous edits.
============================================================ */
function clearStaleLoaderArtifacts() {
  const staleNodes = qsa('#siteLoader, .site-loader, .site-loader-inner, .site-loader-progress, .site-loader-percent');
  staleNodes.forEach(node => node.remove());

  const bodyTextNodes = [...document.body.childNodes]
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .filter(node => /Loading portfolio|Experience assembling|IT Engineer Portfolio|\bPG\b/.test(node.textContent || ''));

  bodyTextNodes.forEach(node => node.remove());

  // If a stray non-classed element contains old loader text, remove it too.
  [...document.body.children].forEach(el => {
    const txt = (el.textContent || '').trim();
    if (!txt) return;
    if (txt.includes('Loading portfolio') || txt.includes('Experience assembling')) {
      el.remove();
    }
  });
}

/* ============================================================
   1. CUSTOM CURSOR
============================================================ */
function initCursor() {
  if (isMobile()) return;

  const cursor   = qs('#cursor');
  const dot      = qs('.cursor-dot',  cursor);
  const ring     = qs('.cursor-ring', cursor);
  const textEl   = qs('.cursor-text', cursor);

  let mx = -100, my = -100; // mouse raw
  let dx =  -100, dy = -100; // dot position (snappy)
  let rx =  -100, ry = -100; // ring position (lagged)
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function tick() {
    // Dot: near-instant
    dx = lerp(dx, mx, 0.85);
    dy = lerp(dy, my, 0.85);
    // Ring: slightly lagged
    rx = lerp(rx, mx, 0.14);
    ry = lerp(ry, my, 0.14);

    cursor.style.left = '0px';
    cursor.style.top  = '0px';
    dot.style.transform  = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    textEl.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

    rafId = requestAnimationFrame(tick);
  }
  tick();

  // Hover states
  const linkTargets = 'a, button, .proj-featured, .proj-card, .skill, .exp-head';

  document.addEventListener('mouseover', e => {
    const el = e.target.closest(linkTargets);
    if (!el) return;

    const label = el.dataset.cursorLabel;
    if (label) {
      textEl.textContent = label;
      document.body.classList.add('cursor-hover');
    } else {
      document.body.classList.add('cursor-link');
    }
  });

  document.addEventListener('mouseout', e => {
    const el = e.target.closest(linkTargets);
    if (!el) return;
    document.body.classList.remove('cursor-hover', 'cursor-link');
    textEl.textContent = '';
  });

  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-hover', 'cursor-link');
  });
}

/* ============================================================
   2. SCROLL REVEAL
============================================================ */
function initScrollReveal() {
  const items = qsa('[data-reveal]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay ?? el.dataset.revealDelay ?? 0, 10);
      setTimeout(() => {
        el.classList.add('is-visible');
      }, delay);
      observer.unobserve(el);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  items.forEach(el => observer.observe(el));
}

/* ============================================================
   3. HERO ENTRANCE SEQUENCE
   Fires once on page load — staggered reveals for hero
============================================================ */
function initHeroEntrance() {
  // Hero items trigger on load (not scroll), with their data-delay as ms
  const heroItems = qsa('#hero [data-reveal]');

  // Small initial pause then fire
  setTimeout(() => {
    heroItems.forEach(el => {
      const delay = parseInt(el.dataset.delay ?? 0, 10);
      setTimeout(() => {
        el.classList.add('is-visible');
      }, delay);
    });
  }, 120);
}

/* ============================================================
   4. PARALLAX (portrait + hero year)
============================================================ */
function initParallax() {
  if (isMobile()) return;

  const portraitWrap = qs('.hero-portrait-wrap');
  const heroYear     = qs('.hero-year');
  const manifesto    = qs('.hero-manifesto-card');

  if (!portraitWrap) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroH   = qs('#hero')?.offsetHeight ?? window.innerHeight;

      if (scrollY < heroH) {
        const progress = scrollY / heroH;

        // Portrait floats up gently
        portraitWrap.style.transform = `translateY(${-scrollY * 0.12}px)`;

        // Year drifts down
        if (heroYear) {
          heroYear.style.transform = `translateY(${scrollY * 0.06}px)`;
        }

        // Manifesto card drifts slightly
        if (manifesto) {
          manifesto.style.transform = `translateY(${-scrollY * 0.05}px)`;
        }
      }

      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

/* ============================================================
   5. NAV SCROLL STATE
============================================================ */
function initNav() {
  const nav = qs('#nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init state
}

/* ============================================================
   6. ACTIVE NAV LINK
============================================================ */
function initActiveNav() {
  const sections = qsa('section[id]');
  const links    = qsa('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.style.color = isActive ? 'var(--ink)' : '';
      });
    });
  }, { threshold: 0.45 });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   7. EXPERIENCE ACCORDION
============================================================ */
function initAccordion() {
  const items = qsa('[data-exp]');

  items.forEach(item => {
    const btn  = qs('.exp-head', item);
    const body = qs('.exp-body', item);
    if (!btn || !body) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      items.forEach(other => {
        const otherBtn  = qs('.exp-head', other);
        const otherBody = qs('.exp-body', other);
        if (otherBtn && otherBody) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherBody.classList.remove('is-open');
        }
      });

      // Toggle clicked
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        body.classList.add('is-open');
      }
    });
  });

  // Open first item by default
  const firstBtn  = qs('.exp-item--featured .exp-head');
  const firstBody = qs('.exp-item--featured .exp-body');
  if (firstBtn && firstBody) {
    firstBtn.setAttribute('aria-expanded', 'true');
    firstBody.classList.add('is-open');
  }
}

/* ============================================================
   8. MARQUEE PAUSE ON HOVER
============================================================ */
function initMarquee() {
  const band = qs('.marquee-band');
  if (!band) return;
  const inner = qs('.marquee-inner', band);
  if (!inner) return;

  band.addEventListener('mouseenter', () => {
    inner.style.animationPlayState = 'paused';
  });
  band.addEventListener('mouseleave', () => {
    inner.style.animationPlayState = 'running';
  });
}

/* ============================================================
   9. PROJECT CARD TILT (subtle 3D feel)
============================================================ */
function initCardTilt() {
  if (isMobile()) return;

  const cards = qsa('.proj-featured, .proj-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;

      const rx = clamp(-y * 6, -4, 4);
      const ry = clamp( x * 6, -4, 4);

      card.style.transform = `
        perspective(800px)
        rotateX(${rx}deg)
        rotateY(${ry}deg)
        translateY(-6px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { card.style.transition = ''; }, 600);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ============================================================
   10. SKILL CHIP RANDOM DELAY on entry
   Makes the chip cloud feel organic, not systematic
============================================================ */
function initSkillChips() {
  const chips = qsa('.skill');
  chips.forEach((chip, i) => {
    // Assign a slight random offset to base delay
    const base  = parseInt(chip.style.getPropertyValue('--delay') ?? '0', 10);
    const jitter = Math.random() * 60;
    chip.style.transitionDelay = `${jitter}ms`;
    // Reset after hover
    chip.addEventListener('mouseleave', () => {
      chip.style.transitionDelay = '0ms';
    });
  });
}

/* ============================================================
   11. SMOOTH SCROLL (catch all internal anchors)
============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   12. FOOTER BACK-TO-TOP
============================================================ */
function initBackToTop() {
  const btn = qs('.footer-top');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   13. PAGE LOAD — body fade in
============================================================ */
function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
}

/* ============================================================
   INIT ALL
============================================================ */
function init() {
  clearStaleLoaderArtifacts();
  initPageLoad();
  initCursor();
  initScrollReveal();
  initHeroEntrance();
  initParallax();
  initNav();
  initActiveNav();
  initAccordion();
  initMarquee();
  initCardTilt();
  initSkillChips();
  initSmoothScroll();
  initBackToTop();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ============================================================
   LOADING SCREEN
============================================================ */
(function () {
  const loader = document.getElementById('loader');
  const loaderName = document.getElementById('loaderName');
  const name = 'Preeti Gondal';
  const minVisibleMs = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 400 : 2800;
  const startedAt = performance.now();

  // Prevent scroll during loader
  document.body.style.overflow = 'hidden';

  // Animate letters one by one
  name.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${i * 0.08}s`;
    loaderName.appendChild(span);
  });

  // Hide loader after animation
  const hideLoader = () => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  };

  const hideAfterMinTime = () => {
    const elapsed = performance.now() - startedAt;
    const wait = Math.max(0, minVisibleMs - elapsed);
    setTimeout(hideLoader, wait);
  };

  // Hide on load event
  if (document.readyState === 'complete') {
    hideAfterMinTime();
  } else {
    window.addEventListener('load', hideAfterMinTime, { once: true });
  }

  // Fallback: always hide after max time
  setTimeout(hideLoader, 3500);
})();

