/* ─────────────────────────────────────────
   PUSHAN ENTERPRISE — main.js
   pushanenterprise.com
───────────────────────────────────────── */

'use strict';

// ─── DOM READY ───
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initHeroScroll();
  initContactForm();
  initSmoothScroll();
  initStepNumbers();
  initNavDropdown();
});

/* ─────────────────────────────────────────
   NAVBAR — scroll behaviour + logo swap
───────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  let ticking = false;

  const onScroll = () => {
    lastScroll = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', lastScroll > 60);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once on load
  onScroll();
}

/* ─────────────────────────────────────────
   MOBILE NAV
───────────────────────────────────────── */
function initMobileNav() {
  const toggle  = document.querySelector('.nav-toggle');
  const links   = document.querySelector('.nav-links');
  const navbar  = document.getElementById('navbar');
  if (!toggle || !links) return;

  const open = () => {
    links.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    navbar.classList.add('scrolled');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    if (window.scrollY <= 60) navbar.classList.remove('scrolled');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    links.classList.contains('open') ? close() : open();
  });

  // Close on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && links.classList.contains('open')) close();
  });
}

/* ─────────────────────────────────────────
   NAV DROPDOWN — keyboard accessible
───────────────────────────────────────── */
function initNavDropdown() {
  const item = document.querySelector('.nav-has-dropdown');
  if (!item) return;

  const trigger  = item.querySelector('.nav-dropdown-trigger');
  const dropdown = item.querySelector('.nav-dropdown');
  if (!trigger || !dropdown) return;

  // Keyboard support
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      dropdown.style.pointerEvents = expanded ? 'none' : 'auto';
    }
    if (e.key === 'Escape') {
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ─────────────────────────────────────────
   SCROLL REVEAL
   IntersectionObserver — fade up on entry
───────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -48px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────
   HERO SCROLL INDICATOR
   Hides once user starts scrolling
───────────────────────────────────────── */
function initHeroScroll() {
  const indicator = document.querySelector('.hero-scroll');
  if (!indicator) return;

  const onScroll = () => {
    if (window.scrollY > 80) {
      indicator.classList.add('hidden');
    } else {
      indicator.classList.remove('hidden');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ─────────────────────────────────────────
   STEP NUMBER COUNT-UP
   Animates 0 → N when step enters view
───────────────────────────────────────── */
function initStepNumbers() {
  const stepNums = document.querySelectorAll('.step-num[data-count]');
  if (!stepNums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      animateCount(el, 0, target, 600);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  stepNums.forEach(el => observer.observe(el));
}

function animateCount(el, from, to, duration) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quad
    const eased = 1 - Math.pow(1 - progress, 2);
    const current = Math.round(from + (to - from) * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ─────────────────────────────────────────
   SMOOTH SCROLL
   Handles all anchor links with offset
   for fixed navbar
───────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
}

/* ─────────────────────────────────────────
   CONTACT FORM
   Formspree-ready with mailto fallback
───────────────────────────────────────── */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn  = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    const originalText = span ? span.textContent : btn.textContent;

    // Loading state
    btn.disabled = true;
    if (span) span.textContent = 'Sending...';
    status.textContent = '';

    // Collect data
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
      // Formspree submission
      try {
        const res = await fetch(action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          status.textContent = 'Thank you — we will be in touch within 2 business days.';
          status.style.color = 'var(--gold)';
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch {
        status.textContent = 'Something went wrong. Please email us directly at hello@pushanenterprise.com';
        status.style.color = 'rgba(255,100,100,0.9)';
      }
    } else {
      // Mailto fallback
      const subject = encodeURIComponent(`Pushan enquiry — ${data.type}`);
      const body = encodeURIComponent(
        `Type: ${data.type}\n` +
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Country: ${data.country}\n` +
        `Coffee type / sector: ${data.commodity}\n\n` +
        `Message:\n${data.message}`
      );
      window.location.href = `mailto:hello@pushanenterprise.com?subject=${subject}&body=${body}`;
      status.textContent = 'Opening your mail client...';
    }

    // Restore button
    btn.disabled = false;
    if (span) span.textContent = originalText;
  });
}

/* ─────────────────────────────────────────
   ZONE CARD — subtle tilt on hover (desktop)
   Adds life without distracting
───────────────────────────────────────── */
(function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.zone-card, .gwu-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tx', `${x * 4}deg`);
      card.style.setProperty('--ty', `${-y * 4}deg`);
      card.style.transform = `perspective(600px) rotateY(var(--tx)) rotateX(var(--ty)) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
