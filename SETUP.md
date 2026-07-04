# Setup — Stripe Payments & the DAY1 Free-Cut Code

Your site is static (GitHub Pages), so it can't safely hold a Stripe secret
key. The clean, secure way to take payments is a **Stripe Payment Link** — a
checkout page Stripe hosts for you. You create it once, paste the URL into the
site, and you're live. No server, no keys in the browser.

## 1. Create the Stripe account
Go to https://stripe.com and sign up (free). Verify your email and add your
payout bank info when prompted.

## 2. Create the $25 haircut Payment Link
1. In the Stripe Dashboard, go to **Product catalog → + Add product**.
2. Name: `Haircut`, Price: `$25.00`, one-time.
3. Save, then click **Create payment link** for that product.
4. On the payment link settings, turn **ON**: “**Allow promotion codes**”.
   (This is what lets people type `DAY1`.)
5. Optional but recommended: set a **confirmation message** or **redirect** so
   after paying the customer sees “You're booked — I'll DM you your time and the
   shop address.”
6. Copy the link URL — it looks like `https://buy.stripe.com/xxxxxxxx`.

## 3. Create the DAY1 free-cut coupon
1. Dashboard → **Product catalog → Coupons → + New**.
2. Type: **Percentage**, `100%` off. (100% = free.)
3. Save. Then under the coupon, add a **Promotion code**: `DAY1`.
4. (Optional) Limit it — e.g. “first-time customers only,” max redemptions,
   or an expiry date — so it isn't reused forever.

Now when someone enters `DAY1` at checkout, the $25 becomes **$0**.

## 4. Put the link on the site
Open `app.js`, find this line near the top:

```js
const STRIPE_PAYMENT_LINK = "";
```

Paste your link between the quotes:

```js
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/xxxxxxxx";
```

Commit and push. The **Pay & Reserve** button on the Book page turns gold and
sends customers to your Stripe checkout. Until it's filled in, the button falls
back to “DM @dababy.cuh to book.”

## How the booking flow works today
Payment Links handle **payment**, not a calendar. So the flow is:
1. Customer pays $25 (or uses `DAY1` for a free first cut) on Stripe.
2. Stripe emails them a receipt; you get a payment notification.
3. You confirm their one-hour time slot and send the exact address by DM.

### Want fully automatic scheduling later?
If you'd rather customers pick their own time slot and get the address
automatically (no manual DM), the best fit for a barber is a booking platform
like **Square Appointments** (free), **Booksy**, or **Fresha** — they combine
the calendar, payment/deposit, reminders, and even discount codes. We can embed
or link one of those from the Book page whenever you're ready.
