// Da Baby Cuts — gallery + small helpers.
// To add your own cut photos: drop image files in /images and list them here.
const GALLERY = [
  "images/cut-1.jpg",
  "images/cut-2.jpg",
  "images/cut-3.jpg",
  "images/cut-4.jpg",
];

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const grid = document.getElementById("gallery-grid");
  if (grid) {
    grid.innerHTML = GALLERY.map(
      (src) =>
        `<a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="Fresh cut at Da Baby Cuts" loading="lazy" /></a>`
    ).join("");
  }
});
