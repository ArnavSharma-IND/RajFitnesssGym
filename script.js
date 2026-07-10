/* =========================================================
   RAJ FITNESS GYM — SCRIPT
   Vanilla JS only. No frameworks, no libraries.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PAGE LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      // trigger hero reveal once loader is gone
      revealHero();
    }, 1400);
  });
  document.body.style.overflow = 'hidden';

  function revealHero() {
    document.querySelectorAll('.hero .reveal-line').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), i * 150);
    });
  }

  /* ---------- SCROLL PROGRESS BAR ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }

  /* ---------- NAVBAR BLUR ON SCROLL ---------- */
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ---------- HERO PARALLAX ZOOM ---------- */
  const heroBg = document.getElementById('heroBg');
  const hero = document.querySelector('.hero');
  function updateParallax() {
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
    const scale = 1.05 + progress * 0.18;
    const translateY = progress * 60;
    heroBg.style.transform = `scale(${scale}) translateY(${translateY}px)`;
  }

  /* ---------- COMBINED SCROLL HANDLER (rAF throttled) ---------- */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbar();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link, .mobile-menu .btn').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- INTERSECTION OBSERVER — SCROLL REVEALS ---------- */
  const revealTargets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-line');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Apple-style ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- INFINITE SERVICES CAROUSEL ---------- */
  const track = document.getElementById('carouselTrack');
  if (track) {
    // Duplicate cards once so the CSS animation (-50%) loops seamlessly.
    const originalCards = Array.from(track.children);
    originalCards.forEach(card => {
      track.appendChild(card.cloneNode(true));
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* ---------- BUTTON RIPPLE EFFECT ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      this.style.setProperty('--ripple-x', x + '%');
      this.style.setProperty('--ripple-y', y + '%');
      this.classList.remove('rippling');
      // force reflow so the animation can restart
      void this.offsetWidth;
      this.classList.add('rippling');
    });
  });

  /* ---------- FALLBACK: if window never fires 'load' quickly (e.g. cached) ---------- */
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      revealHero();
    }
  }, 3500);

});
