# Aki Wellness site

Static site, no build step. English at `/`, Japanese at `/ja/`.

## Deploy (GitHub + Cloudflare Pages)
1. Create a GitHub repo (e.g. `aki-wellness`) and push this folder as the repo root.
2. Cloudflare dashboard: Workers & Pages, Create, Pages, Connect to Git, pick the repo.
3. Build settings: Framework preset None, build command empty, output directory `/`.
4. Deploy, then add the custom domain under the project's Custom domains tab.
5. Every push to `main` redeploys.

## Before launch
- **Domain:** find and replace `akiwellness.jp` across all files if the final domain differs.
- **Stripe:** create one Payment Link for a ¥10,000 "Booking deposit". Add custom fields: preferred date and time, hotel or address. Set "After payment" to redirect to `https://yourdomain/booked/`. Paste the link into `CONFIG.stripeDepositLink` in `assets/app.js`. The chosen treatment arrives as `client_reference_id` (e.g. `oil-90`). Until set, the Book button opens WhatsApp with the treatment prefilled. For Japanese bookings, a second link redirecting to `/ja/booked/` is optional.
- **Photos:** `assets/aki-hero.jpg` (1200x1500) and `assets/aki-portrait.jpg` (1000x1000), WebP or JPG under 250 KB. Swap the placeholder `div.photo` blocks for `<img>` with alt text. Search `REPLACE` in the HTML.
- **Reviews:** replace placeholders with real ones. Do not add Review schema for them.
- **OG image:** `assets/og.jpg` is a placeholder; replace with a 1200x630 photo.
- **Google Business Profile:** set up as a service area business (no address shown) covering Niseko and Kutchan, same hours, link to the site. Add the profile URL to `sameAs` in the schema.
- **Search Console + Bing Webmaster:** verify the domain, submit `/sitemap.xml`.

## Open questions to confirm with Aki
- Does she bring the table, towels and oil? (copy assumes yes)
- How is the balance paid on the day: cash, card, PayPay?
- Deposit refund if cancelled 2+ days ahead (copy assumes full refund)
- Any travel fee for outlying areas?
- "Replies within the hour" promise, is it realistic?
