document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("picture").forEach(function (pic) {
    // Skip pictures inside gallery carousels
    if (pic.closest("[data-gallery]")) return;
    var angle = (Math.random() * 5 - 2.5);
    pic.style.display = "block";
    pic.style.transform = "rotate(" + angle.toFixed(2) + "deg)";
    pic.style.filter = "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))";
  });
});
