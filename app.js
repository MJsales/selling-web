// Da Baby Cuts — shared site script.

// ========================= STRIPE CONFIG =========================
// After you create your Stripe Payment Link (see SETUP.md), paste the URL
// between the quotes below. Until then, the Book page falls back to "DM to book".
//   e.g. const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/abc123";
const STRIPE_PAYMENT_LINK = "";
// =================================================================

// Cut photos — drop files in /images and edit this list to add/remove.
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

function galleryTile(src) {
  return `<a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="Fresh cut at Da Baby Cuts" loading="lazy" /></a>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Full gallery (gallery page)
  const grid = document.getElementById("gallery-grid");
  if (grid) grid.innerHTML = GALLERY.map(galleryTile).join("");

  // Home preview (first 3)
  const preview = document.getElementById("preview-grid");
  if (preview) preview.innerHTML = GALLERY.slice(0, 3).map(galleryTile).join("");

  // Stripe pay button (book page)
  const pay = document.getElementById("pay-btn");
  const status = document.getElementById("pay-status");
  if (pay) {
    if (STRIPE_PAYMENT_LINK) {
      pay.href = STRIPE_PAYMENT_LINK;
      pay.target = "_blank";
      pay.rel = "noopener";
      if (status) status.textContent = "Secure checkout powered by Stripe.";
    } else {
      pay.classList.add("disabled");
      pay.setAttribute("aria-disabled", "true");
      pay.addEventListener("click", (e) => {
        e.preventDefault();
        window.open("https://www.instagram.com/dababy.cuh", "_blank", "noopener");
      });
      if (status) {
        status.innerHTML =
          "Online payment is being set up — for now, <a href='https://www.instagram.com/dababy.cuh' target='_blank' rel='noopener'>DM @dababy.cuh</a> to book.";
      }
    }
  }
});
