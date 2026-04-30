// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── MOBILE NAV ───
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── FADE UP ON SCROLL ───
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
fadeEls.forEach(el => observer.observe(el));

// ─── CONTACT FORM ───
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Collect form data
  const data = {
    type: form.querySelector('[name="type"]').value,
    name: form.querySelector('[name="name"]').value,
    email: form.querySelector('[name="email"]').value,
    country: form.querySelector('[name="country"]').value,
    commodity: form.querySelector('[name="commodity"]').value,
    message: form.querySelector('[name="message"]').value,
  };

  // For GitHub Pages — form submits to Formspree (update ACTION below)
  // Or use mailto as fallback
  const action = form.getAttribute('action');
  if (action && action !== '#') {
    fetch(action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(() => {
      status.textContent = 'Thank you — we will be in touch shortly.';
      form.reset();
    })
    .catch(() => {
      status.textContent = 'Something went wrong. Please email us directly.';
    })
    .finally(() => {
      btn.textContent = 'Send enquiry →';
      btn.disabled = false;
    });
  } else {
    // Mailto fallback
    const subject = encodeURIComponent(`Pushan enquiry — ${data.type}`);
    const body = encodeURIComponent(
      `Type: ${data.type}\nName: ${data.name}\nEmail: ${data.email}\nCountry: ${data.country}\nCommodity/sector: ${data.commodity}\n\nMessage:\n${data.message}`
    );
    window.location.href = `mailto:hello@pushanenterprise.com?subject=${subject}&body=${body}`;
    status.textContent = 'Opening your mail client...';
    btn.textContent = 'Send enquiry →';
    btn.disabled = false;
  }
});

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
