document.addEventListener("DOMContentLoaded", function () {
  // Gallery carousel with native scroll-snap, auto-progress, and lightbox
  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    var track = gallery.querySelector("[data-gallery-track]");
    var slides = track.querySelectorAll("[data-gallery-slide]");
    var prevBtn = gallery.querySelector("[data-gallery-prev]");
    var nextBtn = gallery.querySelector("[data-gallery-next]");
    var dotsContainer = gallery.querySelector("[data-gallery-dots]");
    var current = 0;
    var total = slides.length;
    var autoInterval = null;
    var scrollTimeout = null;

    // Create dots
    for (var i = 0; i < total; i++) {
      var dot = document.createElement("button");
      dot.className = "gallery-dot";
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.dataset.index = i;
      dotsContainer.appendChild(dot);
    }
    var dots = dotsContainer.querySelectorAll(".gallery-dot");

    function updateDots() {
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === current);
      });
    }

    function scrollTo(index) {
      current = ((index % total) + total) % total;
      slides[current].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      updateDots();
    }

    function next() { scrollTo(current + 1); }
    function prev() { scrollTo(current - 1); }

    function startAuto() {
      stopAuto();
      autoInterval = setInterval(next, 4000);
    }

    function stopAuto() {
      if (autoInterval) clearInterval(autoInterval);
    }

    // Detect which slide is visible after any scroll (swipe, button, or programmatic)
    track.addEventListener("scroll", function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        var trackLeft = track.scrollLeft;
        var slideWidth = track.offsetWidth;
        var newIndex = Math.round(trackLeft / slideWidth);
        if (newIndex >= 0 && newIndex < total && newIndex !== current) {
          current = newIndex;
          updateDots();
          startAuto();
        }
      }, 100);
    }, { passive: true });

    // Init
    updateDots();
    startAuto();

    // Controls
    prevBtn.addEventListener("click", function () { prev(); startAuto(); });
    nextBtn.addEventListener("click", function () { next(); startAuto(); });
    dotsContainer.addEventListener("click", function (e) {
      if (e.target.dataset.index !== undefined) {
        scrollTo(parseInt(e.target.dataset.index));
        startAuto();
      }
    });

    // Pause on hover (desktop)
    gallery.addEventListener("mouseenter", stopAuto);
    gallery.addEventListener("mouseleave", startAuto);

    // Pause auto-advance while touching
    track.addEventListener("touchstart", stopAuto, { passive: true });

    // Lightbox on image click — only if not swiping
    var touchStartX = 0;
    var touchStartY = 0;
    track.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    track.addEventListener("click", function (e) {
      var img = e.target.closest("img");
      if (!img) return;
      openLightbox(img.src, img.alt);
    });

    // Prevent lightbox from opening on swipe-end
    track.addEventListener("touchend", function (e) {
      var dx = Math.abs(e.changedTouches[0].screenX - touchStartX);
      var dy = Math.abs(e.changedTouches[0].screenY - touchStartY);
      if (dx > 10 || dy > 10) {
        // Was a swipe, suppress the click
        e.target.addEventListener("click", function suppress(ev) {
          ev.stopPropagation();
          ev.preventDefault();
          e.target.removeEventListener("click", suppress, true);
        }, { capture: true, once: true });
      }
    }, { passive: true });
  });

  // Lightbox
  var lightbox = document.createElement("div");
  lightbox.id = "gallery-lightbox";
  lightbox.innerHTML =
    '<div class="lightbox-backdrop"></div>' +
    '<div class="lightbox-content">' +
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<img src="" alt="" />' +
    '</div>';
  document.body.appendChild(lightbox);

  var lbImg = lightbox.querySelector("img");
  var lbClose = lightbox.querySelector(".lightbox-close");
  var lbBackdrop = lightbox.querySelector(".lightbox-backdrop");

  function openLightbox(src, alt) {
    // Swap to largest available variant
    lbImg.src = src.replace(/_400w\.|_800w\./, "_1200w.");
    lbImg.alt = alt || "";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  lbClose.addEventListener("click", closeLightbox);
  lbBackdrop.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });
});
