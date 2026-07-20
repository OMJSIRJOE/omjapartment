# OMJ Apartment

Luxury **shortlet booking** platform for **OMJ Apartment**.

Stack: Next.js 15, React, TypeScript, Tailwind CSS, Prisma, Paystack, Resend.

## Features

- Public booking site with date/guest search and bedroom categories
- Property details, amenities, house rules, check-in instructions
- Reservations with availability blocking (pending bookings expire after 2h)
- Paystack checkout (NGN) with webhook + amount verification
- Guest + host email confirmations; contact form → host inbox
- Admin panel for shortlets, bookings, and date-range calendar blocks
- Business details via `.env`

## Quick start

```bash
npm install
npm run db:setup
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin/login

See [SETUP.md](./SETUP.md) for Paystack, Resend, domain, and Vercel steps.  
See [GO_LIVE.md](./GO_LIVE.md) for the production launch checklist.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run db:setup` — create DB + seed shortlets/admin
- `npm run db:studio` — browse database
