# Taalif NG website (static, PWA-ready)

RC 9893040 · Learning. Empowering. Transforming.

## Structure
- `index.html` page markup (site, sign-in view, role portal)
- `css/styles.css` design tokens, layout, components, portal, responsive rules
- `js/site.js` theme toggle, programme filter, CBT demo, contact form, mobile menu
- `js/portal.js` role-based demo login, dashboards, offline notice, install prompt
- `js/pwa.js` service-worker registration
- `sw.js`, `manifest.webmanifest`, `icons/` PWA files
- `offline.html`, `404.html`, `robots.txt`, `_headers` (Netlify security headers)

## Run locally
`python3 -m http.server 8080` then open http://localhost:8080 (service workers need localhost or HTTPS).

## Deploy
Upload the folder contents to the site root on Netlify (drag and drop), Vercel, Cloudflare Pages, GitHub Pages or cPanel. HTTPS is required for install and offline support. Bump `VERSION` in `sw.js` on every release.

## Demo sign-in (prototype only)
Emails: learner@, tutor@, school@, sponsor@, admin@ + `taalif.ng`; password `demo1234`.
This is client-side only and NOT secure. Before launch, replace it with Supabase Auth, role tables and row-level security as set out in the blueprint, and move the sample data in `portal.js` to the database.

## Before launch
Add real contact details, privacy/terms/refund policies, and replace sample programmes. The contact form does not send anywhere yet.
