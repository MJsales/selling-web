# Setup — Booking + Stripe Payments

Your site is static (GitHub Pages), so it uses **Cal.com** for the booking
calendar and connects **your Stripe** inside Cal.com. Customers pick a time and
pay in one flow. You set it up once and paste one link into the site.

## 1. Create a Cal.com account
Go to https://cal.com and sign up (free). Pick a username like `dababy-cuts`.

## 2. Connect your Stripe
1. Create a Stripe account at https://stripe.com (free) if you don't have one.
2. In Cal.com: **Settings → Apps/Integrations → Stripe → Install/Connect**, and
   log in to your Stripe. This links payouts to your bank.

## 3. Make the $25 haircut event
1. Cal.com → **Event Types → + New**.
2. Title: `Haircut`, Duration: **60 min**.
3. **Buffers:** set an **after-event buffer of 10 min** (your cleaning time).
4. Availability: **Mon–Sat, 9:00a–5:00p**.
5. Under the event's **Apps/Payments**, enable **Stripe** and set price **$25**,
   “require payment to book.”
6. Save. Your event link looks like `dababy-cuts/haircut`.

## 4. Put the link on the site
Open `app.js`, find near the top:

```js
const CAL_LINK = "";
```

Paste your event link (the `username/event` part, no https):

```js
const CAL_LINK = "dababy-cuts/haircut";
```

Commit and push. The Book page now shows a live calendar; picking a slot takes
payment through your Stripe. Until it's filled in, the page shows “DM to book.”

## The private free-cut (your old “DAY1”)
Since you don't want a public code, make it a **separate hidden link** instead:

1. Cal.com → duplicate the Haircut event → title it `First Cut` (or similar).
2. Set its price to **$0** (or just don't require payment).
3. **Don't** link it anywhere on the site. Share that link *directly* with the
   people you want to give a free first cut. Only people you send it to can use it.

That gives you the same “free first cut” without advertising a code to everyone.

## Want the all-in-one paid option instead?
**Acuity Scheduling** (~$20/mo) does booking + Stripe + real typed coupon codes +
reminders in one place. If you'd rather use that, say so and we'll wire it up the
same way (one embed link).
