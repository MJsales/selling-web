// Da Baby Cuts — gallery + small helpers.
// To add/remove cut photos: drop image files in /images and edit this list.
const GALLERY = [
  "images/cut-a.jpg",
  "images/cut-b.jpg",
  "images/cut-c.jpg",
  "images/cut-d.jpg",
  "images/cut-e.jpg",
  "images/cut-f.jpg",
  "images/cut-g.jpg",
  "images/cut-h.jpg",
  "images/cut-i.jpg",
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
