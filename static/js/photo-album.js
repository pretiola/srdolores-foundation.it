document.addEventListener("DOMContentLoaded", function () {
  var pics = [];
  document.querySelectorAll("picture").forEach(function (pic) {
    // Skip pictures inside gallery carousels
    if (pic.closest(".splide") || pic.closest("[data-gallery]")) return;
    
    var baseAngle = (Math.random() * 5 - 2.5);
    pic.dataset.baseAngle = baseAngle;
    // Subliminal shift speed between -0.005 and 0.005
    pic.dataset.shiftSpeed = (Math.random() * 0.01 - 0.005).toString();

    pic.style.display = "block";
    pic.style.transform = "rotate(" + baseAngle.toFixed(2) + "deg)";
    pic.style.filter = "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))";
    
    pics.push(pic);
  });

  var ticking = false;
  window.addEventListener("scroll", function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        var scrollY = window.scrollY;
        pics.forEach(function(pic) {
          var baseAngle = parseFloat(pic.dataset.baseAngle);
          var shiftSpeed = parseFloat(pic.dataset.shiftSpeed);
          var currentAngle = baseAngle + (scrollY * shiftSpeed);
          pic.style.transform = "rotate(" + currentAngle.toFixed(3) + "deg)";
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
});
