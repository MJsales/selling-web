// Lumière storefront — reads data/products.json and renders the catalog.
// Pure static: no build step required to view.

const CURRENCY = "USD";

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
  }).format(value);
}

async function loadCatalog() {
  const res = await fetch("data/products.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load catalog (${res.status})`);
  return res.json();
}

function priceRow(p) {
  const compare = p.compareAtPrice
    ? `<span class="compare">${money(p.compareAtPrice)}</span>`
    : "";
  return `<div class="price-row"><span class="price">${money(p.price)}</span>${compare}</div>`;
}

function productCard(p) {
  const img = (p.images && p.images[0]) || "";
  const onSale = p.compareAtPrice && p.compareAtPrice > p.price;
  return `
    <a class="card" href="product.html?id=${encodeURIComponent(p.id)}">
      <div class="card-media">
        ${onSale ? '<span class="badge">Sale</span>' : ""}
        <img src="${img}" alt="${escapeHtml(p.title)}" loading="lazy" />
      </div>
      <h3 class="card-title">${escapeHtml(p.title)}</h3>
      ${priceRow(p)}
    </a>`;
}

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

async function renderHome() {
  const grid = document.getElementById("product-grid");
  const count = document.getElementById("product-count");
  try {
    const { products } = await loadCatalog();
    if (!products || !products.length) {
      grid.innerHTML = '<p class="muted">No pieces yet. Run the importer to add products.</p>';
      return;
    }
    grid.innerHTML = products.map(productCard).join("");
    if (count) count.textContent = `${products.length} pieces`;
  } catch (err) {
    grid.innerHTML = `<p class="muted">Couldn't load the collection. ${escapeHtml(err.message)}</p>`;
  }
}

async function renderProduct() {
  const root = document.getElementById("product-root");
  const id = getParam("id");
  try {
    const { products } = await loadCatalog();
    const p = products.find((x) => x.id === id);
    if (!p) {
      root.innerHTML = '<p class="muted">Piece not found. <a href="index.html">Back to shop</a></p>';
      return;
    }
    document.title = `${p.title} — Lumière`;
    const images = p.images && p.images.length ? p.images : [""];
    const thumbs = images
      .map((src, i) => `<button class="thumb ${i === 0 ? "active" : ""}" data-src="${src}"><img src="${src}" alt="" /></button>`)
      .join("");
    const tags = (p.tags || [])
      .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
      .join("");

    root.innerHTML = `
      <div class="gallery">
        <div class="gallery-main"><img id="main-img" src="${images[0]}" alt="${escapeHtml(p.title)}" /></div>
        ${images.length > 1 ? `<div class="thumbs">${thumbs}</div>` : ""}
      </div>
      <div class="product-info">
        <a class="back-link" href="index.html#shop">← Back to shop</a>
        <h1>${escapeHtml(p.title)}</h1>
        ${priceRow(p)}
        ${tags ? `<div class="tag-row">${tags}</div>` : ""}
        <p class="desc">${escapeHtml(p.description || "")}</p>
        <a class="btn" href="#" id="buy-btn">Add to cart</a>
        <p class="notice">Checkout isn't connected yet. Wire up Stripe to enable purchases.</p>
      </div>`;

    // Thumbnail switching
    root.querySelectorAll(".thumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("main-img").src = btn.dataset.src;
        root.querySelectorAll(".thumb").forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    document.getElementById("buy-btn").addEventListener("click", (e) => {
      e.preventDefault();
      alert("Checkout coming soon — connect Stripe to enable purchases.");
    });
  } catch (err) {
    root.innerHTML = `<p class="muted">Couldn't load this piece. ${escapeHtml(err.message)}</p>`;
  }
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (document.getElementById("product-grid")) renderHome();
  if (document.getElementById("product-root")) renderProduct();
});
