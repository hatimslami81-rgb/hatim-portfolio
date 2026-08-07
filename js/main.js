const header = document.getElementById('header');
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const cursorGlow = document.getElementById('cursorGlow');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const page = document.body.dataset.page;
if (page) {
  document.querySelectorAll(`[data-nav="${page}"]`).forEach((el) => el.classList.add('active'));
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    document.body.classList.toggle('nav-open');
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.classList.remove('nav-open');
    });
  });
}

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 16);
  }, { passive: true });
}

if (!prefersReduced && cursorGlow && finePointer) {
  let x = 0, y = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    cursorGlow.classList.add('on');
  }, { passive: true });

  const loop = () => {
    cx += (x - cx) * 0.12;
    cy += (y - cy) * 0.12;
    cursorGlow.style.left = `${cx}px`;
    cursorGlow.style.top = `${cy}px`;
    requestAnimationFrame(loop);
  };
  loop();
}

document.querySelectorAll('.magnetic').forEach((btn) => {
  if (prefersReduced || !finePointer) return;
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

function prepareSplitText() {
  document.querySelectorAll('.split-text').forEach((el) => {
    if (el.dataset.split === 'brand') return;

    const text = el.textContent.trim();
    if (!text || el.querySelector('.split-word')) return;

    const words = text.split(/\s+/);
    el.setAttribute('aria-label', text);
    el.innerHTML = words
      .map((word, i) => {
        const delay = el.dataset.split === 'headline' ? 0.08 + i * 0.045 : i * 0.04;
        return `<span class="split-word" style="transition-delay:${delay}s">${word}</span>`;
      })
      .join(' ');
  });

  document.querySelectorAll('.hero-brand .word').forEach((word, i) => {
    word.style.transitionDelay = `${0.05 + i * 0.14}s`;
  });
}

function revealAll() {
  const els = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-blur, .split-text');
  if (prefersReduced) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  els.forEach((el) => {
    if (el.closest('.hero')) {
      requestAnimationFrame(() => el.classList.add('is-in'));
    } else {
      io.observe(el);
    }
  });
}

function animateTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;
  if (prefersReduced) {
    items.forEach((item) => item.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.07}s`;
    io.observe(item);
  });
}

function animateSkills() {
  const skills = document.querySelectorAll('.skill-cloud li');
  if (!skills.length) return;
  if (prefersReduced) {
    skills.forEach((s) => s.classList.add('visible'));
    return;
  }

  const clouds = document.querySelectorAll('.skill-cloud');
  clouds.forEach((cloud) => {
    const items = cloud.querySelectorAll('li');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        items.forEach((skill, i) => {
          setTimeout(() => skill.classList.add('visible'), i * 40);
        });
        io.disconnect();
      });
    }, { threshold: 0.2 });
    io.observe(cloud);
  });
}

function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const run = (el) => {
    const target = Number(el.dataset.count);
    if (prefersReduced) {
      el.textContent = target;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        run(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => io.observe(c));
}

function initSpotlightCards() {
  const cards = document.querySelectorAll('.spotlight-card');
  if (!cards.length || prefersReduced || !finePointer) return;

  cards.forEach((card) => {
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--spotlight-x', `${x}%`);
      card.style.setProperty('--spotlight-y', `${y}%`);
    };

    card.addEventListener('pointerenter', () => card.classList.add('is-active'));
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-active');
      card.style.setProperty('--spotlight-x', '50%');
      card.style.setProperty('--spotlight-y', '50%');
    });
    card.addEventListener('pointermove', onMove);
  });
}

function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length || prefersReduced || !finePointer) return;

  const maxTilt = 5;

  cards.forEach((card) => {
    let raf = 0;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const tiltY = (px - 0.5) * maxTilt * 2;
      const tiltX = (0.5 - py) * maxTilt * 2;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
        card.style.setProperty('--spotlight-x', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--spotlight-y', `${(py * 100).toFixed(1)}%`);
      });
    };

    const reset = () => {
      cancelAnimationFrame(raf);
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.classList.remove('is-active');
    };

    card.addEventListener('pointerenter', () => card.classList.add('is-active'));
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', reset);
  });
}

function initWorkFilters() {
  const filters = document.querySelectorAll('.work-filters button');
  const items = document.querySelectorAll('.work-item[data-category]');
  if (!filters.length || !items.length) return;

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filters.forEach((b) => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });

      items.forEach((item) => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('is-filtered-out', !match);
      });
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const tr = window.HatimI18n ? window.HatimI18n.t : (k) => k;

    if (!name || !email || !message) {
      if (status) {
        status.textContent = tr('contact.formEmpty');
        status.classList.add('error');
      }
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const mailto = `mailto:hatimslami81@gmail.com?subject=${subject}&body=${body}`;

    if (status) {
      status.classList.remove('error');
      status.textContent = tr('contact.formOpening');
    }

    window.location.href = mailto;
    form.reset();
  });
}

function bootAnimations() {
  prepareSplitText();
  revealAll();
  animateTimeline();
  animateSkills();
  animateCounters();
}

if (window.HatimI18n) {
  window.HatimI18n.initI18n();
}

bootAnimations();
initSpotlightCards();
initTiltCards();
initWorkFilters();
initContactForm();

document.addEventListener('languagechange', () => {
  prepareSplitText();
  document.querySelectorAll('.split-text, .reveal-up, .reveal-scale, .reveal-blur').forEach((el) => {
    el.classList.add('is-in');
  });
  document.querySelectorAll('.timeline-item').forEach((el) => el.classList.add('visible'));
  document.querySelectorAll('.skill-cloud li').forEach((el) => el.classList.add('visible'));
});
