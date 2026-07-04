# Lumière — Static Jewelry Dropshipping Store

A static storefront you can host free on **GitHub Pages**, with a build-time
importer that pulls products and images from **CJ Dropshipping** via their API.

Because GitHub Pages only serves static files, there's no server to hold an API
key. So products are imported ahead of time by a script you run locally (or in
CI); the site itself just reads the finished `data/products.json`. Your API key
never ships to the browser.

## Structure

```
index.html          Storefront (product grid)
product.html        Single product page (reads ?id=)
app.js              Renders the catalog from data/products.json
styles.css          Styling
data/products.json  The catalog the site displays (sample data included)
images/             Downloaded product images (created by the importer)
scripts/import-cj.mjs   CJ Dropshipping importer (run at build time)
.env.example        Template for your CJ credentials
```

## View it locally

No build step needed. Serve the folder with any static server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly via `file://` won't work because it fetches
`data/products.json` — you need a local server.)

## Deploy to GitHub Pages

1. Push this branch to GitHub.
2. Repo **Settings → Pages** → Source: *Deploy from a branch* → pick your
   branch and `/ (root)` → Save.
3. Your store goes live at `https://<user>.github.io/<repo>/`.

The included `.nojekyll` file tells Pages to serve everything as-is.

## Import real products from CJ Dropshipping

1. Create a CJ account and enable API access:
   https://developers.cjdropshipping.cn/
2. Copy your credentials:
   ```bash
   cp .env.example .env
   # edit .env with your CJ_EMAIL and CJ_API_KEY
   ```
3. Find the products you want to sell in CJ and note their product IDs (PIDs).
   Add them to `PRODUCT_IDS` in `scripts/import-cj.mjs`, or pass on the CLI.
4. Run the importer (Node 18+ for built-in `fetch`):
   ```bash
   node --env-file=.env scripts/import-cj.mjs PID1 PID2 PID3
   ```
   This downloads images into `images/`, applies your markup, and rewrites
   `data/products.json`.
5. Commit the updated `data/products.json` and `images/`, then push. Pages
   redeploys automatically.

Adjust the `MARKUP` constant in the importer to set your margin.

## Why the API (not scraping)

CJ grants resellers the right to use supplier product images for listing the
products you sell through them — that's the licensed, terms-compliant path.
Scraping images from a random Alibaba listing you're *not* buying through is
both against their terms and a copyright problem, so this store is built around
the supplier API instead.

## Next steps

- **Checkout:** wire up Stripe (Payment Links are the fastest static-site
  option; Stripe Checkout for a real cart).
- **Custom domain:** add a `CNAME` file and point your domain at Pages.
- **More products:** re-run the importer with more PIDs anytime.
