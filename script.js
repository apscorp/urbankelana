/* ═══════════════════════════════════════════════════
   URBAN KELANA — script.js
═══════════════════════════════════════════════════ */

// ── NAV scroll effect ───────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile burger ───────────────────────────────────
const burger    = document.getElementById('burger');
const navMobile = document.getElementById('nav-mobile');
burger.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});
// Close on link click
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    burger.classList.remove('open');
  });
});

// ── Reveal on scroll ────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const siblings = entry.target.closest('.pillars-grid, .about-cards, .kpi-grid, .days-grid');
      const delay = siblings
        ? Array.from(siblings.children).indexOf(entry.target) * 80
        : 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ── Route line animation ────────────────────────────
const routeLine = document.getElementById('route-line-inner');
if (routeLine) {
  const routeObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      routeLine.classList.add('animated');
      routeObs.disconnect();
    }
  }, { threshold: 0.5 });
  routeObs.observe(routeLine);
}

// ── Animated counters (KPI section) ────────────────
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quart
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(eased * target);

    if (target >= 1000) {
      el.textContent = current >= 1000
        ? (current / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
        : current;
    } else {
      el.textContent = current;
    }

    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const kpiNums = document.querySelectorAll('.kpi-num[data-target]');
const kpiObs  = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      kpiObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
kpiNums.forEach(el => kpiObs.observe(el));

// ── Week tabs ────────────────────────────────────────
const weekTabs   = document.querySelectorAll('.week-tab');
const weekPanels = document.querySelectorAll('.week-panel');

weekTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const week = tab.dataset.week;

    weekTabs.forEach(t => t.classList.remove('active'));
    weekPanels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    document.querySelector(`.week-panel[data-week="${week}"]`).classList.add('active');
  });
});

// ── Smooth active nav link highlight ────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObs.observe(s));

// ── Pillar card stagger on load (above fold check) ──
document.querySelectorAll('.pillar-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 60}ms`;
});
