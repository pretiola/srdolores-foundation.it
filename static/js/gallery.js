document.addEventListener("DOMContentLoaded", function () {
  // Initialize all Splide carousels
  document.querySelectorAll(".splide").forEach(function (el) {
    var splide = new Splide(el, {
      type: "loop",
      autoplay: true,
      interval: 4000,
      pauseOnHover: true,
      pauseOnFocus: true,
      speed: 500,
      rewind: false,
    }).mount();

    // Lightbox on image click
    splide.on("click", function (slide) {
      var img = slide.slide.querySelector("img");
      if (img) openLightbox(img.src, img.alt);
    });
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
