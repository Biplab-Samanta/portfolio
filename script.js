(() => {
  'use strict';

  /* =====================================================
     LOADER
  ===================================================== */
  const finishLoading = () => {
    document.body.classList.add('loaded');
    document.body.classList.remove('pre-load');
  };
  window.addEventListener('load', () => setTimeout(finishLoading, 550));
  // fallback in case 'load' is delayed (slow assets, offline preview, etc.)
  setTimeout(finishLoading, 2500);

  /* =====================================================
     THEME TOGGLE (dark / light, persisted)
  ===================================================== */
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');

  const getInitialTheme = () => {
    const saved = localStorage.getItem('bs-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark'; // brand default
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('bs-theme', theme);
    themeBtn.setAttribute('aria-pressed', theme === 'light');
  };

  applyTheme(getInitialTheme());

  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
  });

  /* =====================================================
     MOBILE NAV
  ===================================================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');
  const navScrim = document.getElementById('navScrim');

  const closeNav = () => {
    mainNav.classList.remove('open');
    navScrim.classList.remove('open');
  };
  const toggleNav = () => {
    mainNav.classList.toggle('open');
    navScrim.classList.toggle('open');
  };

  hamburgerBtn.addEventListener('click', toggleNav);
  navScrim.addEventListener('click', closeNav);
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  /* highlight active nav link on scroll */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const setActiveLink = () => {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => { if (sec.offsetTop <= scrollPos) currentId = sec.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + currentId));
  };
  document.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* =====================================================
     TYPING EFFECT (hero role line)
  ===================================================== */
  const roles = [
    'Frontend Engineer',
    'WordPress Specialist',
    'React Developer',
    'UI/UX Enthusiast'
  ];
  const typedEl = document.getElementById('typedRole');
  let roleIndex = 0, charIndex = 0, deleting = false;

  const typeTick = () => {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(typeTick, 1500);
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        return setTimeout(typeTick, 400);
      }
    }
    setTimeout(typeTick, deleting ? 35 : 65);
  };
  if (typedEl) setTimeout(typeTick, 900);

  /* =====================================================
     SCROLL REVEAL
  ===================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* =====================================================
     STAT COUNTERS
  ===================================================== */
  const statNums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNums.forEach(animateCount);
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  const statsBar = document.getElementById('statsBar');
  if (statsBar) statsObserver.observe(statsBar);

  /* =====================================================
     GLOBAL SEARCH (command palette)
  ===================================================== */
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const iconFor = (type) => {
    const icons = {
      section: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18"/>',
      project: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
      skill: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${icons[type] || icons.section}</svg>`;
  };

  const searchIndex = [
    { title: 'Home', sub: 'Back to the top', type: 'section', target: '#top' },
    { title: 'About', sub: 'Bio, tech stack & facts', type: 'section', target: '#about' },
    { title: 'Projects', sub: 'Featured work', type: 'section', target: '#projects' },
    { title: 'Experience', sub: 'Professional journey', type: 'section', target: '#experience' },
    { title: 'Testimonials', sub: 'What clients say', type: 'section', target: '#testimonials' },
    { title: 'Contact', sub: 'Get in touch', type: 'section', target: '#contact' },
    { title: 'MultiVendorX', sub: 'E-commerce Marketplace — React, PHP, WordPress', type: 'project', target: '#projects' },
    { title: 'DualCube', sub: 'Business Website — HTML, CSS, JavaScript', type: 'project', target: '#projects' },
    { title: 'Bravo Charlie', sub: 'Restaurant & Bar — WordPress, PHP, SEO', type: 'project', target: '#projects' },
    { title: 'Nibas Garden', sub: 'Gardening & Landscaping — WordPress, SEO, UI/UX', type: 'project', target: '#projects' },
    { title: 'Frontend', sub: 'HTML5, CSS3, JavaScript, React.js, Tailwind', type: 'skill', target: '#about' },
    { title: 'Backend', sub: 'PHP, Firebase, REST API, WordPress', type: 'skill', target: '#about' },
    { title: 'CMS & Platforms', sub: 'WordPress, Elementor, Divi, Shopify, WooCommerce', type: 'skill', target: '#about' },
    { title: 'Tools', sub: 'Git, GitHub, Figma, VS Code, Webpack, Vite', type: 'skill', target: '#about' },
    { title: 'Email', sub: 'biplabs776@gmail.com', type: 'skill', target: '#contact' },
    { title: 'Resume', sub: 'Download résumé', type: 'skill', target: '#contact' }
  ];

  let activeIndex = -1;
  let currentResults = [];

  const renderResults = (query) => {
    const q = query.trim().toLowerCase();
    currentResults = q
      ? searchIndex.filter(item => (item.title + ' ' + item.sub).toLowerCase().includes(q))
      : searchIndex.slice(0, 6);
    activeIndex = currentResults.length ? 0 : -1;

    if (!currentResults.length) {
      searchResults.innerHTML = `<div class="search-empty">No results for “${query}”. Try “projects”, “React” or “contact”.</div>`;
      return;
    }
    searchResults.innerHTML = currentResults.map((item, i) => `
      <div class="search-item${i === 0 ? ' active' : ''}" data-index="${i}">
        ${iconFor(item.type)}
        <div class="search-item-text"><strong>${item.title}</strong><span>${item.sub}</span></div>
      </div>
    `).join('');
  };

  const highlightActive = () => {
    searchResults.querySelectorAll('.search-item').forEach((el, i) => {
      el.classList.toggle('active', i === activeIndex);
    });
    const activeEl = searchResults.querySelector('.search-item.active');
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
  };

  const goToResult = (item) => {
    if (!item) return;
    closeSearch();
    setTimeout(() => {
      const el = document.querySelector(item.target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const openSearch = () => {
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    searchInput.value = '';
    renderResults('');
    setTimeout(() => searchInput.focus(), 60);
  };
  const closeSearch = () => {
    searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  searchBtn.addEventListener('click', openSearch);
  searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });

  searchInput.addEventListener('input', () => renderResults(searchInput.value));

  searchResults.addEventListener('click', (e) => {
    const item = e.target.closest('.search-item');
    if (!item) return;
    goToResult(currentResults[parseInt(item.dataset.index, 10)]);
  });

  document.addEventListener('keydown', (e) => {
    const isTypingField = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);

    // open with Ctrl/Cmd+K, or plain "/" when not already typing
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isTypingField && !searchOverlay.classList.contains('open'))) {
      e.preventDefault();
      openSearch();
      return;
    }

    if (!searchOverlay.classList.contains('open')) return;

    if (e.key === 'Escape') { closeSearch(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentResults.length) { activeIndex = (activeIndex + 1) % currentResults.length; highlightActive(); }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentResults.length) { activeIndex = (activeIndex - 1 + currentResults.length) % currentResults.length; highlightActive(); }
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      goToResult(currentResults[activeIndex]);
    }
  });

  /* =====================================================
     SCROLL TO TOP
  ===================================================== */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  document.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

})();
