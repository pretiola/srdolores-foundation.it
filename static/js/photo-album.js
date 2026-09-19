document.addEventListener('DOMContentLoaded', function () {
  if (!window.matchMedia || !window.requestAnimationFrame) return;
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktop = window.matchMedia('(min-width: 1024px)');
  var pics = [];
  var active = false;
  var generation = 0;
  var ticking = false;

  document.querySelectorAll('picture').forEach(function (pic) {
    if (pic.closest('.splide') || pic.closest('[data-gallery]')) return;
    pics.push({ element: pic, angle: Math.random() * 5 - 2.5, speed: Math.random() * 0.01 - 0.005 });
  });

  function rotate() {
    var scrollY = window.scrollY || window.pageYOffset || 0;
    pics.forEach(function (pic) {
      var angle = Math.max(-3, Math.min(3, pic.angle + scrollY * pic.speed));
      pic.element.style.transform = 'rotate(' + angle.toFixed(3) + 'deg)';
      pic.element.style.filter = 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))';
    });
  }

  function configure() {
    var current = ++generation;
    active = false;
    pics.forEach(function (pic) {
      pic.element.classList.remove('photo-album-picture');
      pic.element.style.removeProperty('transform');
      pic.element.style.removeProperty('filter');
    });
    if (motion.matches || !desktop.matches) return;
    pics.forEach(function (pic) { pic.element.classList.add('photo-album-picture'); });
    // Paint the upright starting state before setting the random angles.
    // The CSS transition then eases both the rotation and shadow into place.
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (current !== generation) return;
        active = true;
        rotate();
      });
    });
  }

  window.addEventListener('scroll', function () {
    if (!active || ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      if (active) rotate();
      ticking = false;
    });
  }, { passive: true });
  [motion, desktop].forEach(function (query) {
    if (query.addEventListener) query.addEventListener('change', configure);
    else if (query.addListener) query.addListener(configure);
  });
  configure();
});
