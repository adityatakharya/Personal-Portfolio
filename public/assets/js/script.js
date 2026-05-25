'use strict';

/* ============================================================
   ADITYA TAKHARYA — PORTFOLIO JS
   ============================================================ */

// ---------- SMOOTH SCROLL (Lenis — nice on desktop, native on mobile) ----------
const isDesktop = window.matchMedia('(hover: hover)').matches;
let lenis = null;

if (isDesktop && typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false, // ensures native touch scroll on mobile-like desktops
  });

  function raf(time) {
    if (lenis) lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// ---------- LOADER ----------
window.initLoader = () => {
  const loaderBar = document.querySelector('.loader-bar');
  const pct = document.querySelector('.loader-percentage');
  const loader = document.getElementById('loader');
  
  if (!loader || loader.style.display === 'none') return;

  if (typeof gsap === 'undefined') {
    console.warn("GSAP not found, hiding loader immediately.");
    document.body.classList.remove('is-loading');
    loader.style.display = 'none';
    return;
  }

  let data = { val: 0 };
  const tl = gsap.timeline();

  tl.to(data, {
    val: 100,
    duration: 1.8,
    ease: 'power2.inOut',
    onUpdate() {
      const v = Math.floor(data.val);
      if (pct) pct.textContent = `${v}%`;
      if (loaderBar) loaderBar.style.width = `${v}%`;
    },
  })
  .to('.loader-content', { y: -80, opacity: 0, duration: 0.5 })
  .to(loader, {
    yPercent: -100,
    duration: 0.9,
    ease: 'expo.inOut',
    onComplete() {
      document.body.classList.remove('is-loading');
      loader.style.display = 'none';
      if (window.heroTl) window.heroTl.play();
    },
  });
};

// Fallback: if loader is still visible after 5 seconds, hide it.
setTimeout(() => {
  const loader = document.getElementById('loader');
  if (loader && loader.style.display !== 'none') {
    console.warn("Loader timeout reached, hiding loader.");
    document.body.classList.remove('is-loading');
    loader.style.display = 'none';
  }
}, 5000);

if (document.readyState === 'complete') {
  window.initLoader();
} else {
  window.addEventListener('load', window.initLoader);
}

// ---------- HAMBURGER MENU ----------
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu   = document.getElementById('mobile-menu');
const closeBtn     = document.getElementById('mobile-menu-close');
const mobileLinks  = document.querySelectorAll('.mobile-nav-item');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  if (lenis) lenis.stop();
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (lenis) lenis.start();
}

hamburgerBtn?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// ---------- DESKTOP DROPDOWN ----------
const linksToggle   = document.getElementById('links-toggle');
const linksDropdown = document.getElementById('links-dropdown');

linksToggle?.addEventListener('click', (e) => {
  e.stopPropagation();
  linksDropdown.classList.toggle('active');
});

document.addEventListener('click', () => {
  linksDropdown?.classList.remove('active');
});

// ---------- CUSTOM CURSOR (desktop only) ----------
const cursor = document.getElementById('game-cursor');

if (cursor && window.matchMedia('(hover: hover)').matches) {
  let mouseX = 0, mouseY = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  (function moveCursor() {
    cx += (mouseX - cx) * 0.18;
    cy += (mouseY - cy) * 0.18;
    cursor.style.left = `${cx}px`;
    cursor.style.top  = `${cy}px`;
    requestAnimationFrame(moveCursor);
  })();

  document.querySelectorAll('a, button, .world-card, .item-box').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      gsap.to(cursor, { scale: 1.6, duration: 0.25 });
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      gsap.to(cursor, { scale: 1, duration: 0.25 });
    });
  });

  document.addEventListener('mousedown', () => gsap.to(cursor, { scale: 0.75, duration: 0.1 }));
  document.addEventListener('mouseup',   () => gsap.to(cursor, { scale: 1,    duration: 0.2 }));
} else {
  // Touch device — hide cursor
  if (cursor) cursor.style.display = 'none';
}

// ---------- SCROLL ANIMATIONS ----------
function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance (paused initially, played after loader)
  window.heroTl = gsap.timeline({ paused: true });
  window.heroTl.from('.word-reveal', { y: 80, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.7)' })
    .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.7 }, '-=0.4')
    .from('.hero-buttons > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4');

  if (document.querySelector('.hero-platform')) {
    window.heroTl.from('.hero-platform', { scale: 0.6, opacity: 0, duration: 1.4, ease: 'elastic.out(1, 0.5)' }, '-=0.8');
  }

  // Project cards
  gsap.utils.toArray('.world-card').forEach(card => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%' },
      y: 80, opacity: 0, scale: 0.95, duration: 1, ease: 'back.out(1.4)',
    });
  });

  // Tech items pop in
  gsap.to('.item-box', {
    scrollTrigger: { trigger: '.inventory-grid', start: 'top 88%' },
    scale: 1, opacity: 1,
    stagger: { amount: 0.8, from: 'center' },
    duration: 0.7,
    ease: 'back.out(1.7)',
  });

  // Stat cards
  gsap.from('.stat-card', {
    scrollTrigger: { trigger: '.stats-board', start: 'top 88%' },
    y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
  });
}

// Initialize animations immediately so GSAP records initial `from()` states 
// (prevents flash of content before loader finishes).
if (document.readyState === 'complete') {
  initAnimations();
} else {
  window.addEventListener('DOMContentLoaded', initAnimations);
}

// ---------- MOUSE PARALLAX (desktop) ----------
if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    gsap.to('.hero-platform', { rotationY: x * 16, rotationX: -y * 10, duration: 0.9, ease: 'power2.out' });
  });
}