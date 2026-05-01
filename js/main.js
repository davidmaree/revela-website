/* =====================================================
   REVÈLA — Main JavaScript
   ===================================================== */

(function () {

  // ── Navigation ──────────────────────────────────────
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 48) {
      nav.classList.add('scrolled');
      nav.classList.remove('transparent');
    } else {
      nav.classList.remove('scrolled');
      nav.classList.add('transparent');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Mark active link
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Mobile Menu ──────────────────────────────────────
  if (hamburger && mobileMenu) {
    const spans = hamburger.querySelectorAll('span');

    function openMenu() {
      mobileMenu.classList.add('open');
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  // ── Scroll Reveal ─────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('[data-reveal], [data-stagger]').forEach(el => {
    revealObserver.observe(el);
  });

  // ── Parallax ─────────────────────────────────────────
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  function runParallax() {
    parallaxEls.forEach(el => {
      const rect  = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.parallax) || 0.25;
      const mid   = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${mid * speed}px)`;
    });
  }

  if (parallaxEls.length) {
    window.addEventListener('scroll', runParallax, { passive: true });
    runParallax();
  }

  // ── Counter Animation ─────────────────────────────────
  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1600;
    const start    = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ── Smooth Anchor Scroll ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Gallery Lightbox (Studio page) ───────────────────
  const galleryImgs = document.querySelectorAll('.gallery-img[data-src]');

  if (galleryImgs.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-bg"></div>
      <button class="lightbox-close" aria-label="Close">✕</button>
      <img class="lightbox-img" src="" alt="">
    `;
    document.body.appendChild(lightbox);

    const lbImg   = lightbox.querySelector('.lightbox-img');
    const lbBg    = lightbox.querySelector('.lightbox-bg');
    const lbClose = lightbox.querySelector('.lightbox-close');

    function openLightbox(src) {
      lbImg.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    galleryImgs.forEach(img => img.addEventListener('click', () => openLightbox(img.dataset.src)));
    lbBg.addEventListener('click', closeLightbox);
    lbClose.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  // ── Accordion (Pricing / FAQ) ─────────────────────────
  document.querySelectorAll('.accordion-item').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const body    = item.querySelector('.accordion-body');
    if (!trigger || !body) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.accordion-body').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

})();
