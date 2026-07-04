# Da Baby Cuts — Barber Website

A multi-page barber website hosted free on **GitHub Pages**.

Live at: **https://mjsales.github.io/selling-web/**

## Pages

```
index.html     Home — hero, quick info, recent work preview, about
gallery.html   Full gallery of cuts
book.html      Pricing, how booking works, Stripe checkout (+ DAY1 code)
styles.css     Shared styling
app.js         Shared script (gallery, Stripe link config)
images/        Logo + cut photos
SETUP.md       How to finish Stripe payments + the DAY1 free-cut code
```

## Add / change cut photos
Drop image files in `images/`, then edit the `GALLERY` list in `app.js`.

## Edit prices, hours, text
Plain text in the HTML — open `book.html` (pricing/hours) or `index.html`
(home) and edit directly.

## Payments
See **SETUP.md** to connect Stripe and enable the `DAY1` free-first-cut code.
Until then, the Book button falls back to “DM @dababy.cuh”.

## View locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
