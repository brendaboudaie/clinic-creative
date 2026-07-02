// assets/js/main.js
// Intentionally minimal: the only interactive behavior on this site is the
// mobile nav toggle. If you add new interactivity later, prefer a new,
// small, focused file over growing this one.

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
});
