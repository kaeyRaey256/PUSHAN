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
  initNavDropdowns();
  initDrawer();
  initReveal();
  initRuleDraw();
  initScrollIndicator();
  initSmoothScroll();
  initStickyCTA();
  initBackToTop();
  initCountUp();
  initMapDraw();
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
  const links = document.querySelectorAll('.nav-links > li > a[href^="#"]');
  if (!links.length) return;
  // Skip on legal pages (no matching sections)
  const hasSections = document.querySelectorAll('section[id]').length > 0;
  if (!hasSections) return;

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

/* ── NAV DROPDOWN touch/keyboard support ── */
function initNavDropdowns() {
  document.querySelectorAll('.has-drop').forEach(item => {
    const trigger = item.querySelector('a');
    const drop    = item.querySelector('.nav-drop');
    if (!trigger || !drop) return;
    // Toggle on click for touch devices
    trigger.addEventListener('click', e => {
      const isOpen = item.classList.contains('drop-open');
      // Close all others
      document.querySelectorAll('.has-drop.drop-open').forEach(d => d.classList.remove('drop-open'));
      if (!isOpen) {
        e.preventDefault();
        item.classList.add('drop-open');
      }
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!item.contains(e.target)) item.classList.remove('drop-open');
    });
  });
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

/* ── SECTION SEAL DRAW ── */
function initRuleDraw() {
  const seals = document.querySelectorAll('.section-seal');
  if (!seals.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('drawn');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  seals.forEach(s => obs.observe(s));
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
  const btt     = document.getElementById('back-to-top');
  const hero    = document.getElementById('hero');
  const contact = document.getElementById('contact');
  if (!cta || !hero) return;
  window.addEventListener('scroll', () => {
    const pastHero  = window.scrollY > hero.offsetTop + hero.offsetHeight;
    const atContact = contact ? window.scrollY + window.innerHeight >= contact.offsetTop + 80 : false;
    const ctaVisible = pastHero && !atContact;
    cta.classList.toggle('visible', ctaVisible);
    // Back-to-top: drop closer to bottom when sticky CTA is hidden
    if (btt) btt.classList.toggle('no-sticky', !ctaVisible);
  }, { passive: true });
}

/* ── BACK TO TOP ── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/* ── COUNT-UP ANIMATION ── */
function initCountUp() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3); // cubic ease-out
  const duration = 2000; // ms

  const animate = el => {
    const target  = parseInt(el.getAttribute('data-count'), 10);
    const suffix  = el.getAttribute('data-suffix') || '';
    const start   = performance.now();

    const step = now => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOut(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    };
    requestAnimationFrame(step);
  };

  // Trigger when credential strip enters viewport
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        els.forEach(el => animate(el));
        obs.disconnect(); // run once only
      }
    });
  }, { threshold: 0.4 });

  // Observe the credential strip container
  const strip = document.querySelector('.cred-strip');
  if (strip) obs.observe(strip);
}


/* ── UGANDA MAP DRAW ANIMATION ── */
function initMapDraw() {
  const svg  = document.querySelector('.uganda-map');
  const path = document.getElementById('uganda-path');
  if (!svg || !path) return;

  // Don't run on mobile
  if (window.matchMedia('(max-width: 900px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    svg.classList.add('breathing'); return;
  }

  // Get total path length
  const len = path.getTotalLength();

  // Set initial state — invisible
  path.style.strokeDasharray  = len;
  path.style.strokeDashoffset = len;
  path.style.transition       = 'none';

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;

      // Small delay for polish
      setTimeout(() => {
        path.style.transition       = 'stroke-dashoffset 2.4s cubic-bezier(0.4, 0, 0.2, 1)';
        path.style.strokeDashoffset = '0';

        // After draw completes — start breathing
        setTimeout(() => {
          svg.classList.add('breathing');
        }, 2500);
      }, 200);

      obs.disconnect();
    });
  }, { threshold: 0.3 });

  obs.observe(svg);
}

/* ── COFFEE BEAN ANIMATIONS ── */
function initCoffeeAnims() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // On legal pages, target the legal body wrap
  const legalWrap = document.getElementById('legal-content');
  const targets = legalWrap ? [legalWrap] : [
    document.getElementById('proposition'),
    document.getElementById('farmer'),
    document.getElementById('who')
  ].filter(Boolean);

  targets.forEach(section => {
    const layer = document.createElement('div');
    layer.className = 'coffee-float-layer';
    section.style.position = 'relative';
    section.insertBefore(layer, section.firstChild);
    for (let i = 0; i < (legalWrap ? 4 : 6); i++) {
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
