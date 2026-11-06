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

## Features
Course Match (4-question quiz), Course Compass (course to subjects and subjects to courses), counselling booking, searchable resource library with downloads, programme applications, role portals (learner, tutor, counsellor, institution, sponsor, admin) and a day/night theme.
Submissions are stored in the visitor's browser. To receive them by email, set `formEndpoint` in `js/config.js` (for example a Formspree URL). A shared database for the admin portal needs the Supabase backend.

## Run locally
`python3 -m http.server 8080` then open http://localhost:8080 (service workers need localhost or HTTPS).

## Deploy
Upload the folder contents to the site root on Netlify (drag and drop), Vercel, Cloudflare Pages, GitHub Pages or cPanel. HTTPS is required for install and offline support. Bump `VERSION` in `sw.js` on every release.

## Demo sign-in (prototype only)
Emails: learner@, tutor@, counsellor@, school@, sponsor@, admin@ + `taalif.ng`; password `demo1234`.
This is client-side only and NOT secure. Before launch, replace it with Supabase Auth, role tables and row-level security as set out in the blueprint, and move the sample data in `portal.js` to the database.

## Before launch
Add real contact details, privacy/terms/refund policies, and replace sample programmes. The contact form does not send anywhere yet.

## Supabase (real accounts and shared data)
1. Create a dedicated project at supabase.com (the free plan allows two active projects).
2. Open SQL Editor, paste `supabase/schema.sql` and run it.
3. Project Settings > API: copy the Project URL and the publishable (anon) key into `js/config.js` (`supabaseUrl`, `supabaseKey`). Never use a secret or service-role key.
4. Authentication > URL Configuration: set Site URL to your Vercel address.
5. Open the site, choose Log in > Create a learner account, confirm your email, then make yourself administrator by running the commented `insert into public.user_roles ...` line at the bottom of schema.sql with your email.
When both settings are filled in, the demo logins are switched off, applications, counselling requests and messages are saved to Supabase, and admins and counsellors see them in the portal. Leave them empty to stay in demo mode.

### Status of the live project
The Taalif NG project (gtggukglyxhrrjlduduk, eu-west-2) already has the schema applied and its URL and anon key are in `js/config.js`. Remaining steps: set the Site URL under Authentication > URL Configuration, redeploy, create your account, and make yourself administrator.

## Programmes and events (admin)
Sign in as administrator, open "Programmes and events", and choose Create programme. Set the title, date, venue or link, fee (0 = free, or tick Sponsored), number of seats, payment details and extra registration questions. Each programme gets a registration link (use Copy link) such as `https://your-site/#event-your-programme-123`. Every reservation reduces the seats left; when the last seat is taken the programme leaves the public list and its link says it is fully booked. Removing a registration frees the seat. Registrants can be marked paid and exported as CSV. Paid programmes show your payment details after registering; online card payment (Paystack) needs a server function and is not included yet.
