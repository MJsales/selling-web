#!/usr/bin/env node
/**
 * CJ Dropshipping product importer.
 *
 * Runs at BUILD time (locally or in CI) — never in the browser — so your API
 * credentials stay secret. It authenticates with CJ, fetches your selected
 * products, downloads their images into ./images, and writes the catalog to
 * ./data/products.json, which the static site reads.
 *
 * Setup:
 *   1. Create a CJ Dropshipping account and get API access:
 *        https://developers.cjdropshipping.cn/
 *   2. Copy your credentials into a .env file (see .env.example):
 *        CJ_EMAIL=you@example.com
 *        CJ_API_KEY=xxxxxxxx
 *   3. Put the CJ product IDs (or SKUs) you want to sell in PRODUCT_IDS below,
 *      or pass them as CLI args:  node scripts/import-cj.mjs pid1 pid2 ...
 *   4. Run:  node scripts/import-cj.mjs
 *
 * Notes:
 *   - CJ grants resellers the right to use supplier images for listing their
 *     products, so this is the licensed path (unlike scraping).
 *   - The markup is applied here so your storefront price = cost * (1 + MARKUP).
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "images");
const DATA_FILE = path.join(ROOT, "data", "products.json");

const API_BASE = "https://developers.cjdropshipping.com/api2.0/v1";

// --- Config you can tweak -------------------------------------------------
const MARKUP = 2.4; // storefront price = cost * MARKUP (e.g. 2.4 = 140% margin)
const PRODUCT_IDS = [
  // "PID-from-CJ-here",
];
// -------------------------------------------------------------------------

function loadEnv() {
  const email = process.env.CJ_EMAIL;
  const apiKey = process.env.CJ_API_KEY;
  if (!email || !apiKey) {
    console.error(
      "Missing CJ_EMAIL / CJ_API_KEY. Set them as environment variables or in a .env file.\n" +
        "See .env.example and scripts/import-cj.mjs for setup instructions."
    );
    process.exit(1);
  }
  return { email, apiKey };
}

async function getAccessToken({ email, apiKey }) {
  const res = await fetch(`${API_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: apiKey }),
  });
  const json = await res.json();
  if (!json.result || !json.data?.accessToken) {
    throw new Error(`CJ auth failed: ${json.message || "unknown error"}`);
  }
  return json.data.accessToken;
}

async function fetchProduct(token, pid) {
  const url = `${API_BASE}/product/query?pid=${encodeURIComponent(pid)}`;
  const res = await fetch(url, { headers: { "CJ-Access-Token": token } });
  const json = await res.json();
  if (!json.result || !json.data) {
    throw new Error(`Fetch failed for ${pid}: ${json.message || "unknown error"}`);
  }
  return json.data;
}

async function downloadImage(url, destName) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image download failed (${res.status}): ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  await fs.writeFile(path.join(IMAGES_DIR, destName), buf);
  return `images/${destName}`;
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

// Map CJ's product shape into our storefront schema.
async function normalize(token, raw) {
  const id = slugify(raw.productNameEn || raw.pid);
  const cost = parseFloat(raw.sellPrice) || 0;
  const price = Math.round(cost * MARKUP * 100) / 100;

  const sourceImages = Array.isArray(raw.productImageSet)
    ? raw.productImageSet
    : raw.productImage
    ? [raw.productImage]
    : [];

  const images = [];
  for (let i = 0; i < sourceImages.length && i < 5; i++) {
    const ext = (sourceImages[i].split(".").pop() || "jpg").split("?")[0].slice(0, 4);
    try {
      const local = await downloadImage(sourceImages[i], `${id}-${i}.${ext}`);
      images.push(local);
    } catch (err) {
      console.warn(`  ! skipped image: ${err.message}`);
    }
  }

  return {
    id,
    title: raw.productNameEn || "Untitled",
    price,
    compareAtPrice: Math.round(price * 1.5 * 100) / 100,
    description: (raw.description || "").replace(/<[^>]*>/g, "").trim().slice(0, 600),
    tags: (raw.categoryName ? [raw.categoryName] : []).map((t) => t.toLowerCase()),
    images,
    inStock: true,
    source: { platform: "cjdropshipping", pid: raw.pid, cost },
  };
}

async function main() {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : PRODUCT_IDS;
  if (!ids.length) {
    console.error("No product IDs. Add them to PRODUCT_IDS or pass as CLI args.");
    process.exit(1);
  }

  const creds = loadEnv();
  console.log("Authenticating with CJ…");
  const token = await getAccessToken(creds);

  const products = [];
  for (const pid of ids) {
    console.log(`Importing ${pid}…`);
    try {
      const raw = await fetchProduct(token, pid);
      products.push(await normalize(token, raw));
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    }
  }

  const catalog = {
    updatedAt: new Date().toISOString().slice(0, 10),
    currency: "USD",
    products,
  };
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(catalog, null, 2) + "\n");
  console.log(`\nDone. Wrote ${products.length} products to data/products.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
