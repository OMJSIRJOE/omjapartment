# Deploy OMJ Apartment (Vercel)

GitHub repo: https://github.com/OMJSIRJOE/omjapartment

## 1. Import on Vercel (about 5 minutes)

1. Open: https://vercel.com/new
2. Sign in with **GitHub** (account `OMJSIRJOE`)
3. Import **omjapartment**
4. **Do not deploy yet** — first add a database (step 2), then env vars (step 3)

## 2. Add Postgres (required) — DONE if you see DATABASE_URL in Vercel

Neon is connected when **Settings → Environment Variables** shows `DATABASE_URL` (and usually `DATABASE_URL_UNPOOLED`).

Prisma is configured for Postgres:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}
```

After that change is on `master`, Vercel will redeploy. Then create tables + seed (see below).

## 3. Environment variables (Vercel → Settings → Environment Variables)

Copy from your local `.env`, at minimum:

| Name | Example |
|------|---------|
| `DATABASE_URL` | (from Neon / Vercel Storage) |
| `SESSION_SECRET` | long random string |
| `ADMIN_EMAIL` | your admin email |
| `ADMIN_PASSWORD` | strong password |
| `NEXT_PUBLIC_SITE_URL` | `https://omjapartment.vercel.app` first, then your domain |
| `NEXT_PUBLIC_BUSINESS_NAME` | `OMJ Apartment` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `2348133756976` |
| `NEXT_PUBLIC_PHONE` | `+234 813 375 6976` |
| `NEXT_PUBLIC_EMAIL` | `hello@omjapartment.com` |
| `NEXT_PUBLIC_INSTAGRAM` | `omjapartment` |
| `NEXT_PUBLIC_INSTAGRAM_URL` | `https://instagram.com/omjapartment` |
| `PAYSTACK_SECRET_KEY` | `sk_test_...` or `sk_live_...` |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | `pk_test_...` or `pk_live_...` |
| `RESEND_API_KEY` | `re_...` |
| `EMAIL_FROM` | `OMJ Apartment <bookings@yourdomain.com>` |
| `HOST_EMAIL` | inbox for bookings |
| `BLOB_READ_WRITE_TOKEN` | from Vercel **Storage → Blob** (for admin photo uploads) |

### Enable listing photo uploads

1. Vercel → project → **Storage** → **Create Database** / **Blob** → create a Blob store  
2. Connect it to this project (Production + Preview) — Vercel adds `BLOB_READ_WRITE_TOKEN`  
3. Redeploy  
4. In **Admin → Properties**, use **Upload photos**

## 4. Deploy

Click **Deploy**. When it succeeds, open the `.vercel.app` URL.

## 5. Create tables + seed (one time)

In Vercel → project → **Settings** → note the production URL, then locally (with production `DATABASE_URL`):

```bash
npx prisma db push
npm run db:seed
```

Or use Vercel CLI / Neon SQL console after we switch to Postgres.

## 6. Admin on the live site

`https://YOUR-VERCEL-URL/admin/login`

Same admin email/password as in Vercel env vars.

## 7. Custom domain (optional)

Vercel → **Settings** → **Domains** → add your domain → update DNS → set `NEXT_PUBLIC_SITE_URL` to that domain → redeploy.
