/* HTML contains the final totals; animation is an optional visual enhancement. */
(function () {
  'use strict';
  if (!window.matchMedia || !window.requestAnimationFrame || !window.IntersectionObserver) return;
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      var node = entry.target;
      var total = Number(node.textContent);
      var accessible = document.createElement('span');
      accessible.className = 'sr-only';
      accessible.textContent = String(total);
      node.parentNode.insertBefore(accessible, node);
      node.setAttribute('aria-hidden', 'true');
      var start;
      function frame(now) {
        if (start === undefined) start = now;
        var progress = motion.matches ? 1 : Math.min((now - start) / 1400, 1);
        node.textContent = String(Math.round(total * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) window.requestAnimationFrame(frame);
      }
      window.requestAnimationFrame(frame);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count-up]').forEach(function (node) { observer.observe(node); });
}());
