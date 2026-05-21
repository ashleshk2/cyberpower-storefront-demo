/* CyberPower Amazon Brand Store — Main JS */

async function loadPartials() {
  try {
    const [headerRes, footerRes] = await Promise.all([
      fetch('partials/header.html'),
      fetch('partials/footer.html')
    ]);
    const [headerHTML, footerHTML] = await Promise.all([
      headerRes.text(),
      footerRes.text()
    ]);
    const headerEl = document.getElementById('site-header');
    const footerEl = document.getElementById('site-footer');
    if (headerEl) headerEl.innerHTML = headerHTML;
    if (footerEl) footerEl.innerHTML = footerHTML;
  } catch (e) {
    console.warn('Could not load partials:', e.message);
  }
  initMobileNav();
  initActiveNav();
  initSmoothScroll();
  initNavDropdowns();
}

function initMobileNav() {
  const allBtn = document.querySelector('.amz-nav-all-btn');
  const drawer = document.querySelector('.amz-mobile-drawer');
  if (allBtn && drawer) {
    allBtn.addEventListener('click', function(e) {
      e.preventDefault();
      drawer.classList.toggle('open');
    });
  }
}

function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.brand-subnav-tabs a, .amz-mobile-drawer a').forEach(function(link) {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initNavDropdowns() {
  document.querySelectorAll('.brand-subnav-dropdown').forEach(function(dropdown) {
    var trigger = dropdown.querySelector('.brand-subnav-dropdown-trigger');
    var menu = dropdown.querySelector('.brand-subnav-dropdown-menu');
    if (!trigger || !menu) return;
    dropdown.addEventListener('mouseenter', function() {
      var rect = trigger.getBoundingClientRect();
      menu.style.top = rect.bottom + 'px';
      menu.style.left = Math.min(rect.left, window.innerWidth - 240) + 'px';
      dropdown.classList.add('open');
    });
    dropdown.addEventListener('mouseleave', function() {
      dropdown.classList.remove('open');
    });
  });
}

function initSmoothScroll() {
  const drawer = document.querySelector('.amz-mobile-drawer');
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const selector = this.getAttribute('href');
      if (!selector || selector === '#') return;
      const target = document.querySelector(selector);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (drawer) drawer.classList.remove('open');
      }
    });
  });
}

function initScrollFade() {
  var viewportH = window.innerHeight;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.section-fade').forEach(function(el) {
    var rect = el.getBoundingClientRect();
    // Only animate elements that start below the visible viewport
    if (rect.top > viewportH) {
      el.classList.add('will-fade');
      observer.observe(el);
    }
    // Elements already in view on load: leave visible (no animation needed)
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadPartials();
  initScrollFade();
});
