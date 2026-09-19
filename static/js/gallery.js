document.addEventListener('DOMContentLoaded', function () {
  // Keep the server-rendered image links usable if the carousel cannot load.
  if (typeof window.Splide === 'function') {
    document.querySelectorAll('.splide').forEach(function (el) {
      try {
        new Splide(el, { type: 'loop', autoplay: false, speed: 500 }).mount();
      } catch (error) {
        el.classList.remove('is-initialized');
      }
    });
  }

  // Native dialogs manage keyboard focus and Escape. Older browsers retain
  // ordinary image links instead of receiving an inaccessible overlay.
  var lightbox = document.createElement('dialog');
  if (typeof lightbox.showModal !== 'function') return;
  lightbox.id = 'gallery-lightbox';
  lightbox.setAttribute('aria-label', 'Enlarged photograph');
  lightbox.innerHTML = '<button type="button" class="lightbox-close">Close photograph</button><img alt="" />';
  document.body.appendChild(lightbox);
  var image = lightbox.querySelector('img');
  var trigger;
  document.addEventListener('click', function (event) {
    var link = event.target.closest('.gallery-image-link');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    trigger = link;
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    lightbox.showModal();
  });
  lightbox.querySelector('button').addEventListener('click', function () { lightbox.close(); });
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('close', function () {
    if (trigger) trigger.focus();
  });
});
