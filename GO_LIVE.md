# OMJ Apartment — Go-Live Checklist

Use this after the site is working locally. Tick items as you finish them.

## A. Real inventory (you must provide)

- [ ] Photograph each shortlet (wide living room, bedroom, kitchen, bathroom, exterior)
- [ ] Host photos on Cloudinary, ImgBB, or Google Drive public links
- [ ] In `/admin/properties`, replace demo titles, addresses, NGN prices, amenities, and image URLs
- [ ] Fill **Check-in instructions** for every unit (door code, Wi-Fi, parking, arrival time)
- [ ] Deactivate demo listings you do not own
- [ ] Block maintenance / personal-use dates on `/admin/calendar` (supports date ranges)

## B. Payments (Paystack)

- [ ] Create Paystack account → switch to **Live** when ready
- [ ] Put `sk_live_...` and `pk_live_...` in production env (never commit keys)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your real domain (Paystack callback depends on it)
- [ ] Add webhook URL in Paystack Dashboard:  
  `https://YOUR-DOMAIN/api/paystack/webhook`  
  Event: `charge.success`
- [ ] Test one full booking with a small amount, then confirm admin + guest emails arrive

## C. Email (Resend)

- [ ] Verify your domain in Resend
- [ ] Set `EMAIL_FROM` to something like `OMJ Apartment <bookings@yourdomain.com>`
- [ ] Set `HOST_EMAIL` to the inbox that should receive bookings + contact form messages
- [ ] Send a contact-page inquiry and confirm it lands in `HOST_EMAIL`

## D. Domain & hosting

- [ ] Push repo to GitHub
- [ ] Deploy on Vercel (or similar)
- [ ] For production DB: Neon/Supabase Postgres → change Prisma `provider` to `postgresql` → `db push` + seed or import
- [ ] Point custom domain DNS to Vercel
- [ ] Set all env vars from `.env.example` in the host dashboard
- [ ] Change `ADMIN_PASSWORD` and `SESSION_SECRET` to strong unique values

## E. Final smoke test

- [ ] Home → bedroom sections → listing → book → Paystack → success page shows check-in notes
- [ ] Confirmation email includes address + check-in instructions
- [ ] Host email received
- [ ] Contact form delivers to host
- [ ] WhatsApp / Instagram / phone links work on mobile
- [ ] Favicon and logo look correct on dark header

## What the code already handles

- Paystack amount verification (kobo must match booking total)
- Paystack webhook fallback if guest closes the success page
- Abandoned pending bookings expire after 2 hours (dates unlock)
- Contact form emails the host (or opens WhatsApp if Resend is not configured)
- Image hosts: Unsplash, Cloudinary, ImgBB, Google, S3, Sanity
