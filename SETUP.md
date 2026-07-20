# OMJ Apartment Setup Guide

This project includes:

- SQLite database (local) via Prisma
- Online reservations with availability checks
- Paystack payments (NGN) + webhook confirmation
- Resend email confirmations + contact inquiries
- Admin panel for shortlets, bookings, and blocked date ranges
- Business details via environment variables

For production launch steps, see **[GO_LIVE.md](./GO_LIVE.md)**.

## 1. Local setup

```bash
npm install
npm run db:setup
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

Default admin (change in `.env`):

- Email: `admin@omjapartment.com`
- Password: value of `ADMIN_PASSWORD` in `.env` (seed uses this)

## 2. Business details (must do)

Edit `.env` from `.env.example`:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER="2348133756976"
NEXT_PUBLIC_PHONE="+234 813 375 6976"
NEXT_PUBLIC_EMAIL="hello@omjapartment.com"
NEXT_PUBLIC_ADDRESS="Your service area or office line"
NEXT_PUBLIC_MAPS_QUERY="Victoria Island Lagos Nigeria"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
ADMIN_EMAIL="you@yourdomain.com"
ADMIN_PASSWORD="strong-password"
SESSION_SECRET="long-random-secret"
```

Restart the server after changing env vars.

## 3. Add real shortlets

1. Go to `/admin/properties`
2. Edit seeded listings or create new ones
3. Set photos (HTTPS image URLs), nightly rate in **NGN**, guests, amenities, house rules
4. Add **check-in instructions** (sent to guests after payment)

Supported image hosts include Unsplash, Cloudinary, ImgBB, Google, and S3-style URLs.

## 4. Paystack payments

1. Create account at https://dashboard.paystack.com
2. Copy keys into `.env`:

```env
PAYSTACK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_..."
```

Prices are stored and charged in **NGN** (Paystack amount = total × 100 kobo).

Without Paystack keys, reservations still save as **pending** and can be marked paid in admin.

### Webhook (recommended for production)

In Paystack Dashboard → Settings → API Keys & Webhooks, add:

`https://YOUR-DOMAIN/api/paystack/webhook`

This confirms payments even if the guest closes the browser before the success page loads.

## 5. Email confirmations (Resend)

1. Create account at https://resend.com
2. Add API key and sender:

```env
RESEND_API_KEY="re_..."
EMAIL_FROM="OMJ Apartment <bookings@yourdomain.com>"
HOST_EMAIL="hello@omjapartment.com"
```

Guest + host emails send after successful Paystack payment, or when admin marks a booking as paid.  
Contact form inquiries are emailed to `HOST_EMAIL` (or fall back to WhatsApp if Resend is missing).

## 6. Deploy to Vercel + domain

1. Push code to GitHub
2. Import project in Vercel
3. For production DB, create a free Neon/Supabase Postgres database
4. Change Prisma datasource provider to `postgresql` and set:

```env
DATABASE_URL="postgresql://..."
```

5. In Vercel project settings, add all env vars from `.env.example`
6. Deploy
7. Point your domain DNS to Vercel
8. Set `NEXT_PUBLIC_SITE_URL` to your live domain
9. Run `npx prisma db push` and `npm run db:seed` against production DB (or use Vercel CLI)

### Quick Postgres switch

In `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then:

```bash
npx prisma db push
npm run db:seed
```

## 7. SMS (optional later)

Twilio can be added on top of the existing booking confirmation flow. Email is already wired.
