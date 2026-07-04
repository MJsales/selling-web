// Da Baby Cuts — shared site script.

// ===================== BOOKING CONFIG =====================
// Paste your Cal.com event link here after setup (see SETUP.md), e.g.
//   const CAL_LINK = "dababy-cuts/haircut";
// Stripe payment is connected inside Cal.com, so picking a time and paying
// happen together. Until this is filled in, the Book page shows "DM to book".
const CAL_LINK = "";
// ==========================================================

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

function initBooking() {
  const el = document.getElementById("booking-embed");
  if (!el) return;
  const status = document.getElementById("booking-status");

  if (!CAL_LINK) {
    el.classList.add("booking-fallback");
    el.innerHTML =
      "<div><p><strong>Online booking is being set up.</strong></p>" +
      "<p>For now, <a href='https://www.instagram.com/dababy.cuh' target='_blank' rel='noopener'>DM @dababy.cuh</a> to lock in your time.</p></div>";
    return;
  }

  // Cal.com inline embed
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal; let ar = arguments;
      if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }
        else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  Cal("init", { origin: "https://cal.com" });
  Cal("inline", { elementOrSelector: "#booking-embed", calLink: CAL_LINK, layout: "month_view" });
  Cal("ui", { theme: "dark", cssVarsPerTheme: { dark: { "cal-brand": "#e0b25a" } }, hideEventTypeDetails: false });
  if (status) status.textContent = "Secure payment powered by Stripe, via Cal.com.";
}

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const grid = document.getElementById("gallery-grid");
  if (grid) grid.innerHTML = GALLERY.map(galleryTile).join("");

  const preview = document.getElementById("preview-grid");
  if (preview) preview.innerHTML = GALLERY.slice(0, 3).map(galleryTile).join("");

  initBooking();
});
