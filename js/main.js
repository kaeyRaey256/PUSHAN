/* ═══════════════════════════════════════════════
   PUSHAN ENTERPRISE · main.js
   pushanenterprise.com · 2026
═══════════════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPageLoad();
  initScrollProgress();
  initNavbar();
  initActiveNav();
  initDrawer();
  initReveal();
  initRuleDraw();
  initScrollIndicator();
  initSmoothScroll();
  initStickyCTA();
  initBackToTop();
  initCoffeeAnims();
  initForm();
  initCookieNotice();
});

/* ── THEME — light is always default ── */
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  // Only respect stored preference — never system preference for default
  let stored = null;
  try { stored = localStorage.getItem('pushan-theme'); } catch {}

  if (stored === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  // If no stored preference → light mode (do nothing, :root is light)

  toggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    if (next === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    try { localStorage.setItem('pushan-theme', next); } catch {}
  });
}

/* ── PAGE LOAD FADE ── */
function initPageLoad() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('loaded'); return;
  }
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('loaded'), 40));
}

/* ── SCROLL PROGRESS ── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
  }, { passive: true });
}

/* ── NAVBAR scroll state ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  let ticking = false;
  const update = () => { nav.classList.toggle('scrolled', window.scrollY > 60); ticking = false; };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();
}

/* ── ACTIVE NAV — gold underline on current section ── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id].cred-strip, div[id]');
  const links = document.querySelectorAll('.nav-links > li > a[href^="#"]');
  if (!links.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('nav-active', href === `#${id}`);
      });
    });
  }, { rootMargin: '-20% 0px -60% 0px' });

  document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
}

/* ── MOBILE DRAWER with focus trap ── */
function initDrawer() {
  const toggle    = document.querySelector('.nav-toggle');
  const drawer    = document.getElementById('drawer');
  const veil      = document.querySelector('.drawer-veil');
  const closeBtn  = document.querySelector('.drawer-x');
  if (!toggle || !drawer) return;

  const focusable = () => Array.from(
    drawer.querySelectorAll('a[href], button:not([disabled])')
  );

  const open = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    veil?.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    setTimeout(() => focusable()[0]?.focus(), 360);
  };

  const close = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    veil?.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  };

  toggle.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
  closeBtn?.addEventListener('click', close);
  veil?.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  drawer.addEventListener('keydown', e => {
    if (!drawer.classList.contains('open')) return;
    const items = focusable();
    if (!items.length) return;
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === items[0]) { e.preventDefault(); items[items.length - 1].focus(); }
      } else {
        if (document.activeElement === items[items.length - 1]) { e.preventDefault(); items[0].focus(); }
      }
    }
    if (e.key === 'Escape') close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) close(); });
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── SECTION RULE DRAW ── */
function initRuleDraw() {
  const rules = document.querySelectorAll('.s-rule');
  if (!rules.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { e.target.classList.toggle('drawn', e.isIntersecting); });
  }, { threshold: 0.5 });
  rules.forEach(r => obs.observe(r));
}

/* ── SCROLL INDICATOR ── */
function initScrollIndicator() {
  const el = document.querySelector('.scroll-indicator');
  if (!el) return;
  window.addEventListener('scroll', () => el.classList.toggle('gone', window.scrollY > 80), { passive: true });
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

/* ── STICKY MOBILE CTA ── */
function initStickyCTA() {
  const cta     = document.getElementById('sticky-cta');
  const hero    = document.getElementById('hero');
  const contact = document.getElementById('contact');
  if (!cta || !hero) return;
  window.addEventListener('scroll', () => {
    const pastHero  = window.scrollY > hero.offsetTop + hero.offsetHeight;
    const atContact = contact ? window.scrollY + window.innerHeight >= contact.offsetTop + 80 : false;
    cta.classList.toggle('visible', pastHero && !atContact);
  }, { passive: true });
}

/* ── BACK TO TOP ── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── COFFEE BEAN ANIMATIONS ── */
function initCoffeeAnims() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = [
    document.getElementById('proposition'),
    document.getElementById('farmer'),
    document.getElementById('who')
  ].filter(Boolean);

  targets.forEach(section => {
    const layer = document.createElement('div');
    layer.className = 'coffee-float-layer';
    section.style.position = 'relative';
    section.insertBefore(layer, section.firstChild);
    for (let i = 0; i < 6; i++) {
      const bean = document.createElement('div');
      bean.className = 'coffee-bean';
      const size  = 22 + Math.random() * 38;
      const left  = 4  + Math.random() * 92;
      const dur   = 20 + Math.random() * 24;
      const delay = -(Math.random() * dur);
      bean.style.cssText = `left:${left}%;width:${size}px;height:${size}px;animation-duration:${dur}s;animation-delay:${delay}s;`;
      bean.innerHTML = `<svg viewBox="0 0 40 56" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="28" rx="16" ry="24"/><path d="M20 4 C10 16 10 40 20 52"/></svg>`;
      layer.appendChild(bean);
    }
  });
}

/* ── CONTACT FORM with validation and spinner ── */
function initForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  const validate = () => {
    let valid = true;
    form.querySelectorAll('[required]').forEach(f => {
      const ok = f.value.trim() !== '';
      f.style.borderColor = ok ? '' : 'rgba(255,100,100,0.7)';
      if (!ok) valid = false;
    });
    return valid;
  };
  form.querySelectorAll('[required]').forEach(f => f.addEventListener('input', () => { f.style.borderColor = ''; }));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) {
      status.textContent = 'Please complete all required fields.';
      status.style.color = 'rgba(255,120,120,0.9)'; return;
    }

    const btn  = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    const orig = span?.textContent || 'Send enquiry';
    btn.disabled = true;
    btn.classList.add('btn--loading');
    if (span) span.textContent = 'Sending';
    status.textContent = '';

    const data = {
      type:      form.querySelector('[name="type"]')?.value   || '',
      name:      form.querySelector('[name="name"]')?.value   || '',
      email:     form.querySelector('[name="email"]')?.value  || '',
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
          status.style.color = 'var(--gold)'; form.reset();
        } else throw new Error();
      } catch {
        status.textContent = 'Something went wrong. Please email office@pushanenterprise.com directly.';
        status.style.color = 'rgba(255,120,120,0.9)';
      }
    } else {
      const sub  = encodeURIComponent(`Pushan enquiry — ${data.type}`);
      const body = encodeURIComponent(`Type: ${data.type}\nName: ${data.name}\nEmail: ${data.email}\nCountry: ${data.country}\nSector: ${data.commodity}\n\nMessage:\n${data.message}`);
      window.location.href = `mailto:office@pushanenterprise.com?subject=${sub}&body=${body}`;
      status.textContent = 'Opening your mail client...';
      status.style.color = 'var(--gold)';
    }

    btn.disabled = false;
    btn.classList.remove('btn--loading');
    if (span) span.textContent = orig;
  });
}

/* ── COOKIE NOTICE ── */
function initCookieNotice() {
  const notice = document.getElementById('cookie-notice');
  if (!notice) return;
  try { if (localStorage.getItem('pushan-cookie-ok')) return; } catch { return; }
  setTimeout(() => notice.classList.add('visible'), 1400);
  notice.querySelector('.cookie-accept')?.addEventListener('click', () => {
    notice.classList.remove('visible');
    try { localStorage.setItem('pushan-cookie-ok', '1'); } catch {}
  });
}
