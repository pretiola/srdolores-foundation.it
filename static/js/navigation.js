(function () {
  'use strict';
  var nav = document.getElementById('navbar');
  var toggle = nav.querySelector('.mobile-menu-toggle');
  if (!window.matchMedia) return;
  var mobile = window.matchMedia('(max-width: 639px)');
  function close(returnFocus) {
    nav.classList.remove('mobile-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }
  toggle.hidden = false;
  nav.classList.add('mobile-menu-ready');
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('mobile-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && mobile.matches) close(true);
  });
  document.addEventListener('click', function (event) {
    if (!nav.contains(event.target)) close(false);
  });
  nav.addEventListener('focusout', function (event) {
    if (event.relatedTarget && !nav.contains(event.relatedTarget)) close(false);
  });
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) close(false);
  });
  function resize() { close(false); }
  if (mobile.addEventListener) mobile.addEventListener('change', resize);
  else if (mobile.addListener) mobile.addListener(resize);
}());
