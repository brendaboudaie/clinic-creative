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
  var toggleDropdown = function (item, btn) {
    var isOpen = item.classList.toggle('is-open');
    if (btn) btn.setAttribute('aria-expanded', isOpen);
    return isOpen;
  };

  document.querySelectorAll('[data-dropdown-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      var item = btn.closest('.site-nav__item');
      if (!item) return;
      toggleDropdown(item, btn);
    });
  });

  // On mobile, tapping a top-level item that has a dropdown opens the
  // dropdown instead of navigating straight to its landing page — the
  // dropdown's own "All X" link (see _includes/navigation.html) is how
  // mobile users reach that page. Desktop keeps the normal click-to-navigate
  // behavior, since the dropdown already opens there via hover.
  document.querySelectorAll('.site-nav__item.has-dropdown > .site-nav__item-row > .site-nav__link').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (window.innerWidth >= 768) return;
      event.preventDefault();
      var item = link.closest('.site-nav__item');
      if (!item) return;
      var btn = item.querySelector('[data-dropdown-toggle]');
      toggleDropdown(item, btn);
    });
  });

  // Carousel: infinite loop. We clone the full card set once before the
  // real cards and once after, so there's always more track to scroll into
  // in either direction. After scrolling settles (arrow click, swipe, or
  // manual drag), if the user has landed in a cloned set we silently jump
  // (scroll-behavior: auto, no animation) to the matching position in the
  // real set one card-set-width away — since the clone is an exact copy in
  // the same order, the jump is visually seamless.
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var prevBtn = carousel.querySelector('[data-carousel-prev]');
    var nextBtn = carousel.querySelector('[data-carousel-next]');
    if (!track) return;

    var originalCards = Array.prototype.slice.call(track.children);
    var setWidth = 0;

    if (originalCards.length > 1) {
      var cloneSet = function () {
        return originalCards.map(function (card) {
          var clone = card.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          clone.setAttribute('tabindex', '-1');
          return clone;
        });
      };

      var leadingClones = cloneSet();
      var leadingFragment = document.createDocumentFragment();
      leadingClones.forEach(function (clone) { leadingFragment.appendChild(clone); });
      track.insertBefore(leadingFragment, track.firstChild);

      var trailingFragment = document.createDocumentFragment();
      cloneSet().forEach(function (clone) { trailingFragment.appendChild(clone); });
      track.appendChild(trailingFragment);

      // Measure the real gap between one set and the next directly from
      // rendered offsets (first leading-clone card -> first real card),
      // rather than scrollWidth / 3 — the two can differ by a sub-pixel
      // rounding amount that's enough to throw off scroll-snap's own
      // correction and make a "jump one set over" overshoot by a whole
      // extra set. scrollBy (not direct scrollLeft assignment) is what
      // actually sticks once CSS scroll-snap has taken over the track's
      // scroll position — a plain "track.scrollLeft = x" gets silently
      // reverted back to wherever scroll-snap last settled.
      setWidth = originalCards[0].offsetLeft - leadingClones[0].offsetLeft;
      // Jump to the absolute target (setWidth) rather than assuming we're
      // starting from 0 — some browsers restore a track's scroll position
      // on navigation, so scrollLeft may already be nonzero here.
      track.scrollBy({ left: setWidth - track.scrollLeft, behavior: 'instant' });

      var isJumping = false;
      var settleTimer;
      track.addEventListener(
        'scroll',
        function () {
          if (isJumping) return;
          clearTimeout(settleTimer);
          settleTimer = setTimeout(function () {
            if (track.scrollLeft < setWidth - track.clientWidth / 2) {
              isJumping = true;
              track.scrollBy({ left: setWidth, behavior: 'instant' });
              requestAnimationFrame(function () { isJumping = false; });
            } else if (track.scrollLeft > setWidth * 2 - track.clientWidth / 2) {
              isJumping = true;
              track.scrollBy({ left: -setWidth, behavior: 'instant' });
              requestAnimationFrame(function () { isJumping = false; });
            }
          }, 120);
        },
        { passive: true }
      );
    }

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

  // Contact form: submit to Formspree via AJAX so we can swap in a custom
  // thank-you message instead of redirecting to Formspree's default page.
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            var note = document.querySelector('[data-form-note]');
            var success = document.getElementById('contact-form-success');
            contactForm.hidden = true;
            if (note) note.hidden = true;
            if (success) success.hidden = false;
          } else {
            if (submitBtn) submitBtn.disabled = false;
            alert('Something went wrong sending your message. Please try again or email me directly.');
          }
        })
        .catch(function () {
          if (submitBtn) submitBtn.disabled = false;
          alert('Something went wrong sending your message. Please try again or email me directly.');
        });
    });
  }
});
