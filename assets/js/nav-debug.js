// assets/js/nav-debug.js
//
// TEMPORARY diagnostic file for the iOS Chrome hamburger-menu bug (menu
// opens squeezed at the bottom of the screen, only on a cold first load).
// Safe to delete entirely, along with its <script> tag in
// _layouts/default.html and the window.__navDebugLog(...) calls in
// main.js, once the bug is understood/fixed.
//
// Inert unless the URL has ?debug=nav — visit any page with that query
// string to see a live log at the bottom of the screen showing, at each
// key moment: header.offsetHeight, the nav's computed `display`, the
// --header-height CSS variable, and (once opened) the nav panel's actual
// on-screen position.
(function () {
  var active = /[?&]debug=nav\b/.test(location.search);

  if (!active) {
    window.__navDebugLog = function () {};
    return;
  }

  var box = document.createElement('div');
  box.id = 'nav-debug-overlay';
  box.style.cssText =
    'position:fixed;bottom:0;left:0;right:0;max-height:50vh;overflow-y:auto;' +
    'background:rgba(0,0,0,0.9);color:#39ff14;font:11px/1.5 monospace;' +
    'padding:8px;z-index:999999;white-space:pre-wrap;';

  var attach = function () {
    (document.body || document.documentElement).appendChild(box);
  };
  if (document.body) {
    attach();
  } else {
    document.addEventListener('DOMContentLoaded', attach);
  }

  window.__navDebugLog = function (label) {
    var header = document.querySelector('.site-header');
    var nav = document.querySelector('[data-nav]');
    var rect = nav ? nav.getBoundingClientRect() : null;
    var headerHeightVar = getComputedStyle(document.documentElement)
      .getPropertyValue('--header-height')
      .trim();

    var line =
      '[' + performance.now().toFixed(0) + 'ms] ' + label +
      ' | header.offsetHeight=' + (header ? header.offsetHeight : 'n/a') +
      ' | nav display=' + (nav ? getComputedStyle(nav).display : 'n/a') +
      ' | --header-height=' + headerHeightVar +
      ' | innerHeight=' + window.innerHeight +
      (rect ? ' | nav top=' + Math.round(rect.top) + ' bottom=' + Math.round(rect.bottom) : '');

    // eslint-disable-next-line no-console
    if (window.console && console.log) console.log('[nav-debug]', line);

    var write = function () {
      box.appendChild(document.createTextNode(line + '\n'));
      box.scrollTop = box.scrollHeight;
    };
    if (box.isConnected) {
      write();
    } else {
      document.addEventListener('DOMContentLoaded', write, { once: true });
    }
  };

  window.__navDebugLog('nav-debug.js evaluated');
})();
