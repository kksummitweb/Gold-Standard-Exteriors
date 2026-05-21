/* ============================================================
   Gold Standard Exteriors — main.js
   ============================================================ */

'use strict';

/* ── Year ───────────────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Preloader ──────────────────────────────────────────── */
const preloader = document.getElementById('preloader');
if (preloader) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('out');
      preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    }, 600);
  });
}

/* ── Scroll Progress Bar ────────────────────────────────── */
const scrollBar = document.getElementById('scrollProgress');
function updateProgress() {
  if (!scrollBar) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
  scrollBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* ── Mouse Glow ─────────────────────────────────────────── */
const glow = document.getElementById('mouseGlow');
if (glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}

/* ── Dark Mode Toggle ───────────────────────────────────── */
const htmlEl = document.documentElement;
const darkToggle = document.getElementById('darkToggle');

const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initTheme = saved || (prefersDark ? 'dark' : 'light');
htmlEl.dataset.theme = initTheme;

if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    const next = htmlEl.dataset.theme === 'dark' ? 'light' : 'dark';
    htmlEl.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
}

/* ── Sticky Header ──────────────────────────────────────── */
const header = document.getElementById('siteHeader');
let lastScroll = 0;

function onHeaderScroll() {
  if (!header) return;
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  lastScroll = y;
}
window.addEventListener('scroll', onHeaderScroll, { passive: true });
onHeaderScroll();

/* ── Mobile Menu ────────────────────────────────────────── */
const navToggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

function openMenu() {
  if (!navToggle || !mobileMenu) return;
  mobileMenu.hidden = false;
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');
  requestAnimationFrame(() => mobileMenu.removeAttribute('hidden'));
}

function closeMenu() {
  if (!navToggle || !mobileMenu) return;
  mobileMenu.hidden = true;
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });
}

// Close on mobile nav link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* ── Active Nav Links ───────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-list a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── Scroll Reveal ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('[data-reveal]');

if (revealEls.length) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObs.observe(el));
}

/* ── Animated Counters ──────────────────────────────────── */
const countEls = document.querySelectorAll('[data-count]');

function animateCount(el) {
  const target   = parseFloat(el.dataset.count);
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const val      = eased * target;
    el.textContent = prefix + val.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(step);
}

if (countEls.length) {
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => counterObs.observe(el));
}

/* ── FAQ Accordion ──────────────────────────────────────── */
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item  = btn.closest('.faq-item');
    const panel = item.querySelector('.faq-panel');
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-panel').style.maxHeight = null;
      openItem.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
    });

    // Toggle current
    if (!isOpen) {
      item.classList.add('open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── Hero Parallax ──────────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg');
if (heroBg && window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.5) {
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
    }
  }, { passive: true });
}

/* ── Quote Form ─────────────────────────────────────────── */
// Paste your deployed Google Apps Script URL here after setup:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyzkymvXT71dyNC3UBf6exNwKa7kl6n-6iUiAFii9y2-81ch7eKqr_VepC5Ll4eV__giQ/exec';

const quoteForm   = document.getElementById('quoteForm');
const formSuccess = document.getElementById('formSuccess');

if (quoteForm) {

  // Add error message element if not present
  let formError = document.getElementById('formError');
  if (!formError) {
    formError = document.createElement('div');
    formError.id = 'formError';
    formError.className = 'form-error';
    formError.style.display = 'none';
    formError.style.color = '#b00020';
    formError.style.margin = '1rem 0 0 0';
    formError.style.fontWeight = '600';
    quoteForm.appendChild(formError);
  }

  quoteForm.addEventListener('submit', async e => {
    e.preventDefault();

    // Basic validation
    const fname  = document.getElementById('fname');
    const fphone = document.getElementById('fphone');
    let valid = true;

    [fname, fphone].forEach(field => {
      if (field && !field.value.trim()) {
        field.classList.add('error');
        valid = false;
      } else if (field) {
        field.classList.remove('error');
      }
    });

    if (!valid) {
      const firstErr = quoteForm.querySelector('.error');
      if (firstErr) firstErr.focus();
      return;
    }

    // Disable form while submitting
    quoteForm.style.opacity = '0.5';
    quoteForm.style.pointerEvents = 'none';
    formError.style.display = 'none';

    // Build payload
    const payload = new URLSearchParams({
      name:    document.getElementById('fname').value.trim(),
      email:   document.getElementById('femail').value.trim(),
      phone:   document.getElementById('fphone').value.trim(),
      city: document.getElementById('fcity')?.value.trim() || '',
      location: document.getElementById('fcity')?.value.trim() || '',
      business: '', // Not collected in form
      details: document.getElementById('fmsg').value.trim(),
      submittedAt: new Date().toISOString(),
      sourcePage: window.location.href,
    });

    // Debug: log payload
    console.log('[QuoteForm] Sending payload:', payload.toString());

    let sent = false;
    try {
      const resp = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode:   'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });
      // Debug: log fetch result
      console.log('[QuoteForm] Fetch result:', resp);
      sent = true; // With no-cors, we can't check status, so assume success if no error
    } catch (err) {
      console.error('[QuoteForm] Fetch error:', err);
      sent = false;
    }

    // Show result
    quoteForm.style.opacity = '';
    quoteForm.style.pointerEvents = '';
    quoteForm.reset();
    if (sent) {
      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { formSuccess.hidden = true; }, 6000);
      }
    } else {
      formError.textContent = 'Sorry, there was a problem sending your request. Please try again or call us.';
      formError.style.display = 'block';
    }
  });

  // Remove error class on input
  quoteForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}
