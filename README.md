# Da Baby Cuts — Barber Website

A single-page barber website hosted free on **GitHub Pages**.

Live at: **https://mjsales.github.io/selling-web/**

## Structure

```
index.html          The whole site (hero, services, gallery, about, hours, book)
styles.css          Styling
app.js              Builds the gallery grid; set your photos here
images/             Photos (placeholders for now — swap in your own)
IMAGE-CREDITS.md    Licenses for the placeholder photos
```

## Add your own cut photos

The gallery currently uses free-licensed placeholder photos. To use your own
(e.g. from [@dababy.cuh](https://www.instagram.com/dababy.cuh) — your own work,
so you have full rights):

1. Download your photos from Instagram (or use the originals).
2. Drop the image files into the `images/` folder.
3. Open `app.js` and edit the `GALLERY` list to point at your filenames:
   ```js
   const GALLERY = [
     "images/my-cut-1.jpg",
     "images/my-cut-2.jpg",
     // ...
   ];
   ```
4. To change the big hero background, replace `images/cut-1.jpg` (referenced in
   `styles.css` under `.hero`), or swap the filename there.
5. Commit and push — the live site updates in a minute or two.

## Edit prices, hours, services

All of it is plain text in `index.html` — search for the section
(`Services & Prices`, `Hours`, etc.) and edit the numbers/words directly.

## View locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Next steps

- Real online **booking** (e.g. Calendly / Square Appointments embed).
- A **custom domain** (e.g. dababycuts.com) pointed at GitHub Pages.
