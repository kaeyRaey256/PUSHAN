/* ═══════════════════════════════════════════
   PUSHAN ENTERPRISE · main.js
   pushanenterprise.com · 2026
═══════════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initDrawer();
  initReveal();
  initRuleDividers();
  initScrollIndicator();
  initSmoothScroll();
  initStickyCTA();
  initCoffeeAnims();
  initForm();
  initCookieNotice();
});

/* ── SCROLL PROGRESS BAR ── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ── NAVBAR ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  let ticking = false;
  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ── MOBILE DRAWER with focus trap ── */
function initDrawer() {
  const toggle   = document.querySelector('.nav-toggle');
  const drawer   = document.getElementById('drawer');
  const veil     = document.querySelector('.drawer-veil');
  const closeBtn = document.querySelector('.drawer-x');
  if (!toggle || !drawer) return;

  const focusable = () => Array.from(
    drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
  ).filter(el => !el.hasAttribute('disabled'));

  const open = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    veil?.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus first item after transition
    setTimeout(() => { focusable()[0]?.focus(); }, 320);
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

  // Focus trap
  drawer.addEventListener('keydown', e => {
    if (!drawer.classList.contains('open')) return;
    const items = focusable();
    if (!items.length) return;
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === items[0]) {
          e.preventDefault(); items[items.length - 1].focus();
        }
      } else {
        if (document.activeElement === items[items.length - 1]) {
          e.preventDefault(); items[0].focus();
        }
      }
    }
    if (e.key === 'Escape') close();
  });

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

/* ── SECTION RULE DIVIDERS ── */
function initRuleDividers() {
  const rules = document.querySelectorAll('.s-rule');
  if (!rules.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.classList.toggle('in-view', e.isIntersecting);
    });
  }, { threshold: 0.5 });
  rules.forEach(r => obs.observe(r));
}

/* ── SCROLL INDICATOR HIDE ── */
function initScrollIndicator() {
  const el = document.querySelector('.scroll-indicator');
  if (!el) return;
  window.addEventListener('scroll', () => {
    el.classList.toggle('gone', window.scrollY > 80);
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
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
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
    const pastHero    = window.scrollY > (hero.offsetTop + hero.offsetHeight);
    const atContact   = contact ? window.scrollY + window.innerHeight >= contact.offsetTop : false;
    cta.classList.toggle('visible', pastHero && !atContact);
  }, { passive: true });
}

/* ── COFFEE BEAN ANIMATIONS ── */
function initCoffeeAnims() {
  // Only in sections WITHOUT the pattern — proposition, farmer, who
  const targets = [
    document.getElementById('proposition'),
    document.getElementById('farmer'),
    document.getElementById('who')
  ].filter(Boolean);

  // Prefer-reduced-motion check
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  targets.forEach(section => {
    const layer = document.createElement('div');
    layer.className = 'coffee-float-layer';
    section.style.position = 'relative';
    section.appendChild(layer);

    const count = 5;
    for (let i = 0; i < count; i++) {
      const bean = document.createElement('div');
      bean.className = 'coffee-bean';

      const size   = 18 + Math.random() * 28; // 18-46px
      const left   = 5  + Math.random() * 90; // 5-95% horizontal
      const dur    = 18 + Math.random() * 22; // 18-40s
      const delay  = Math.random() * -dur;    // stagger start

      bean.style.cssText = `
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
        color: var(--teal);
      `;

      // SVG coffee bean — oval with centre crease
      bean.innerHTML = `
        <svg viewBox="0 0 40 56" width="${size}" height="${size}"
             fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="20" cy="28" rx="16" ry="24"/>
          <path d="M20 4 C10 14 10 42 20 52"/>
        </svg>`;

      layer.appendChild(bean);
    }
  });
}

/* ── CONTACT FORM with validation ── */
function initForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  // Validate required fields
  const validate = () => {
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      const ok = field.value.trim() !== '';
      field.style.borderColor = ok ? '' : 'rgba(255,100,100,0.7)';
      if (!ok) valid = false;
    });
    return valid;
  };

  // Clear error styling on input
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) {
      status.textContent  = 'Please complete all required fields.';
      status.style.color  = 'rgba(255,120,120,0.9)';
      return;
    }

    const btn  = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    const orig = span?.textContent || 'Send enquiry';
    btn.disabled = true;
    if (span) span.textContent = 'Sending...';
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
          status.style.color = 'var(--gold)';
          form.reset();
        } else throw new Error('server');
      } catch {
        status.textContent = 'Something went wrong. Please email office@pushanenterprise.com directly.';
        status.style.color = 'rgba(255,120,120,0.9)';
      }
    } else {
      const sub  = encodeURIComponent(`Pushan enquiry — ${data.type}`);
      const body = encodeURIComponent(
        `Type: ${data.type}\nName: ${data.name}\nEmail: ${data.email}\n` +
        `Country: ${data.country}\nSector: ${data.commodity}\n\nMessage:\n${data.message}`
      );
      window.location.href = `mailto:office@pushanenterprise.com?subject=${sub}&body=${body}`;
      status.textContent = 'Opening your mail client...';
      status.style.color = 'var(--gold)';
    }

    btn.disabled = false;
    if (span) span.textContent = orig;
  });
}

/* ── COOKIE NOTICE ── */
function initCookieNotice() {
  const notice = document.getElementById('cookie-notice');
  if (!notice) return;
  try {
    if (localStorage.getItem('pushan-cookie-ok')) return;
  } catch { return; }

  // Show after a short delay
  setTimeout(() => notice.classList.add('visible'), 1200);

  const btn = notice.querySelector('.cookie-accept');
  btn?.addEventListener('click', () => {
    notice.classList.remove('visible');
    try { localStorage.setItem('pushan-cookie-ok', '1'); } catch {}
  });
}
