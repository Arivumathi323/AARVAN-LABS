# Aarvan Labs website

Static HTML generated with Node.js, preserving the original dark/orange design, fonts, mascot video and animation modules. Vercel serves `dist/` and deploys `api/contact.js` as a serverless function.

## Run locally

```sh
npm ci
npm run build
npm run dev
```

Open http://127.0.0.1:4173. The preview uses the generated `dist` pages, including clean routes and the contact endpoint. Rebuild after editing; the preview server does not need restarting for HTML/CSS changes.

## Edit content

- `content/site.mjs`: all service/learning descriptions, deliverables, FAQs, schedules, price placeholders, founder timeline and testimonials.
- `templates/home.html`: preserved home hero, founder and portfolio markup. Its legacy header/form/metadata are ignored by the generator.
- `build.mjs`: shared layout, service/course templates, home composition, booking/WhatsApp links, metadata, JSON-LD, sitemap, robots and llms generation.
- `css/pages.css`: additive styles; original component styles remain intact. The build bundles them into `dist/css/site.css`.
- `api/contact.js`: validated email submission via Resend, using server-only environment variables.
- `js/contact.js`, `js/pages.js`: submission feedback, pre-selected interest, accessible dropdown behavior and optional existing Vercel Analytics CTA events.
- Root `index.html`, `about.html`, `sitemap.xml` and `robots.txt` are historical inputs, not the deployed output. Use `npm run build` and `dist/`.

## Vercel configuration

Use the Other framework preset. `vercel.json` sets `npm run build`, output `dist`, clean URLs and the legacy About redirect. No SPA catch-all is used.

Set these environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Canonical origin; defaults to https://aarvanlabs.vercel.app |
| `NEXT_PUBLIC_BOOKING_URL` | Learning-session booking URL; falls back to `/contact`, preserving interest. Call buttons dial the phone in `content/site.mjs` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | International digits; absent configuration uses a Contact Aarvan link |
| `RESEND_API_KEY` | Server-only Resend key |
| `CONTACT_FROM_EMAIL` | Sender using a verified Resend domain |
| `CONTACT_TO_EMAIL` | Inbox receiving enquiries |

The public variables are read at build time: redeploy after changing them. For local environment files use Node's `--env-file` support, for example `node --env-file=.env build.mjs` and `node --env-file=.env preview.mjs`. Never put email keys in client scripts.

Resend API reference: https://resend.com/docs/api-reference/emails/send-email

The form only reports success after the provider returns a delivery ID. Missing configuration returns an honest 503 message. Provider errors are safely reported without exposing keys or upstream details. The honeypot rejects automated form filling; it is not a complete anti-abuse service.

## Checks

```sh
npm run build
npm test
node scripts/browser-check.mjs
node scripts/lighthouse-check.mjs
```

Browser/audit scripts require Microsoft Edge and the local preview running. Unit/integration checks cover all 17 HTML documents, internal references, metadata, image attributes, JSON-LD parsing and form behavior. Email provider success/failure tests are mocked: no test email is sent. Browser checks cover service-to-contact preselection, the unconfigured form state, mocked success, mobile navigation, overflow and axe accessibility.

`artifacts/` contains preview screenshots, accessibility results and a Lighthouse report. Lighthouse scores reflect local conditions and can differ on the deployed site.

## Owner TODOs before public launch

- TODO: Set booking URL and international WhatsApp number.
- TODO: Configure all three email environment variables, verify the sender domain, and make one real delivery check after deploying.
- TODO: Replace both service price tiers for each of the seven services in `content/site.mjs`.
- TODO: Set the fee for each of the four learning offerings.
- TODO: Confirm each offering's session length, total duration, batch/1:1 format and upcoming dates.
- TODO: Confirm Chennai offline availability and location.
- TODO: Confirm whether the AI automation course includes a certificate.
- TODO: Confirm the indicative service delivery/support timelines.
- TODO: Fill the three founder timeline years and review milestones.
- Founder photo added at `images/arivu.webp` from the supplied portrait.
- TODO: Supply the real Fiverr profile URL for the existing tertiary link.

No testimonials or review/rating schema are published. The testimonial renderer stays empty until real approved data is supplied.

## Structured-data verification after deployment

Local checks confirm JSON syntax and FAQ/content agreement. Google eligibility is not guaranteed; FAQ and Course markup do not automatically produce enhanced search results. Use https://search.google.com/test/rich-results and https://validator.schema.org/ with the URLs listed in `SEO-CHECKLIST.md` after deployment. Replace the origin there if `SITE_URL` changes.

## Verification result (3 October 2026)

- Build: all 17 requested static routes generated successfully.
- Automated HTML/link/metadata/schema checks: passed.
- Email handler checks: passed for validation, honeypot, missing configuration, mocked delivery success and provider failure.
- Desktop/mobile browser flow and axe checks: passed, with no page JavaScript errors or WCAG A/AA violations reported in the audited pages.
- Desktop motion controls and mobile JavaScript-disabled page: passed.
- Local mobile Lighthouse homepage: Performance 96, Accessibility 100, Best Practices 100, SEO 100. This is a local audit of the homepage, not a guarantee for every deployed page.
- Pending: deployment, real configured email delivery, and public structured-data testing.

Direct call buttons now use `tel:+918122167396`, with the number also visible in the footer. Service enquiry links continue to pre-select the relevant offering.
