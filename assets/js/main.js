// assets/js/main.js
// Intentionally minimal: mobile nav toggle, mega-menu touch support, and a
// small scroll-triggered fade-in. If you add new interactivity later,
// prefer a new, small, focused file over growing this one.

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');
  var header = document.querySelector('.site-header');

  // The mobile menu is a full-screen panel that starts right below the
  // logo/toggle bar, so that bar (and the close "X") stays visible the
  // whole time. --header-height lets the CSS position it there without
  // hardcoding a pixel value that would drift if the logo/font ever changes.
  if (header) {
    var setHeaderHeight = function () {
      document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', isOpen);
    });

    // If the viewport crosses into the desktop layout while the mobile
    // panel is open, reset it — otherwise it can get stuck open (as a
    // fixed full-screen panel) after a resize or orientation change.
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768 && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', false);
        toggle.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('nav-open');
      }
    });
  }

  // Mega-menu: hover opens dropdowns on desktop automatically (CSS only).
  // This click handler only covers touch/keyboard on devices without a
  // hover state — clicking the little caret toggles the dropdown without
  // following the parent link.
  document.querySelectorAll('[data-dropdown-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      var item = btn.closest('.site-nav__item');
      if (!item) return;
      var isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });

  // Carousel arrows: scroll the track by roughly one card width per click.
  // Native CSS scroll-snap handles settling on a card; this just moves the
  // scroll position, so no state tracking or index math is needed.
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var prevBtn = carousel.querySelector('[data-carousel-prev]');
    var nextBtn = carousel.querySelector('[data-carousel-next]');
    if (!track) return;

    var scrollByCard = function (direction) {
      var card = track.querySelector('.carousel__card');
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var amount = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.75;
      track.scrollBy({ left: direction * amount, behavior: 'smooth' });
    };

    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByCard(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollByCard(1); });
  });

  // Subtle fade-in-up as sections enter the viewport.
  var fadeTargets = document.querySelectorAll('.fade-in-up');
  if ('IntersectionObserver' in window && fadeTargets.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    fadeTargets.forEach(function (el) {
      observer.observe(el);
    });

    // Fallback sweep: a fast/instant scroll (e.g. a same-page anchor jump,
    // or "End" key) can move a section past the viewport between two
    // intersection samples, so it never registers as "intersecting" and
    // stays invisible forever. Catch any stragglers whenever the user
    // stops scrolling or resizes.
    var sweepStragglers = function () {
      fadeTargets.forEach(function (el) {
        if (!el.classList.contains('is-visible') && el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      });
    };
    var sweepTimer;
    ['scroll', 'resize'].forEach(function (evt) {
      window.addEventListener(
        evt,
        function () {
          clearTimeout(sweepTimer);
          sweepTimer = setTimeout(sweepStragglers, 200);
        },
        { passive: true }
      );
    });
  } else {
    fadeTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
});
