/* ═══════════════════════════════════════
   PUSHAN ENTERPRISE · main.js
   pushanenterprise.com · 2026
═══════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDrawer();
  initReveal();
  initScrollHint();
  initSmoothScroll();
  initForm();
});

/* ── NAVBAR ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  nav.classList.toggle('scrolled', window.scrollY > 60);
}

/* ── MOBILE DRAWER ── */
function initDrawer() {
  const toggle  = document.querySelector('.nav-toggle');
  const drawer  = document.getElementById('drawer');
  const veil    = document.querySelector('.drawer-veil');
  const closeBtn = document.querySelector('.drawer-x');
  if (!toggle || !drawer) return;

  const open = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    veil?.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    veil?.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    drawer.classList.contains('open') ? close() : open();
  });
  closeBtn?.addEventListener('click', close);
  veil?.addEventListener('click', close);

  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── SCROLL HINT ── */
function initScrollHint() {
  const hint = document.querySelector('.scroll-hint');
  if (!hint) return;
  window.addEventListener('scroll', () => {
    hint.classList.toggle('gone', window.scrollY > 80);
  }, { passive: true });
}

/* ── SMOOTH SCROLL with nav offset ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = (document.getElementById('navbar')?.offsetHeight || 80) + 16;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });
}

/* ── SECTION RULE MARK FADE ── */
(function initRuleMark() {
  const marks = document.querySelectorAll('.rule-m');
  if (!marks.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.style.opacity = e.isIntersecting ? '1' : '0.3';
    });
  }, { threshold: 0.5 });
  marks.forEach(m => {
    m.style.transition = 'opacity 0.6s ease';
    m.style.opacity = '0.3';
    obs.observe(m);
  });
})();

/* ── FORM ── */
function initForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    const orig = span?.textContent || 'Send enquiry';
    btn.disabled = true;
    if (span) span.textContent = 'Sending...';
    status.textContent = '';

    const data = {
      type:      form.querySelector('[name="type"]')?.value || '',
      name:      form.querySelector('[name="name"]')?.value || '',
      email:     form.querySelector('[name="email"]')?.value || '',
      country:   form.querySelector('[name="country"]')?.value || '',
      commodity: form.querySelector('[name="commodity"]')?.value || '',
      message:   form.querySelector('[name="message"]')?.value || '',
    };

    const action = form.getAttribute('action');

    if (action && action !== '#') {
      try {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          status.textContent = 'Thank you — we will respond within 2 business days.';
          status.style.color = 'var(--gold)';
          form.reset();
        } else throw new Error();
      } catch {
        status.textContent = 'Something went wrong. Please email us directly at office@pushanenterprise.com';
        status.style.color = 'rgba(255,120,120,0.9)';
      }
    } else {
      const sub = encodeURIComponent(`Pushan enquiry — ${data.type}`);
      const body = encodeURIComponent(`Type: ${data.type}\nName: ${data.name}\nEmail: ${data.email}\nCountry: ${data.country}\nSector: ${data.commodity}\n\nMessage:\n${data.message}`);
      window.location.href = `mailto:office@pushanenterprise.com?subject=${sub}&body=${body}`;
      status.textContent = 'Opening your mail client...';
    }

    btn.disabled = false;
    if (span) span.textContent = orig;
  });
}
