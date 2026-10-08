# Rinse & Rise Laundryrite — website

Premium marketing site, service catalogue and booking foundation for **Rinse & Rise Laundryrite** (Electronic City, Bangalore).

This folder is a new Next.js app. It does **not** change `website/`, `laundry-billing/` or `store2billing/`.

## Rate card (source of truth)

Pricing comes from `Rinse&Rise Laundryrite Rate Card.xlsx` in the parent folder.

```bash
python scripts/extract-rate-card.py
```

That writes `data/rate-card.json`. Item names, rates and units are copied as written. Do not edit prices in the UI.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Accounts & booking

Copy `.env.example` to `.env.local` and add Supabase keys. Then run `supabase/migrations/0001_init.sql` in the Supabase SQL editor.

Until those keys exist:

- the catalogue, pricing and Scroll World still work
- Login / Book a pickup explain that accounts are not switched on yet
- first-order **25%** is shown in the UI but only applied on the server when an order is created

## Design

Orange `#FF6A00` on a cream/white canvas. Soft neomorphic cards. The homepage **Scroll World** is a pinned GSAP + ScrollTrigger film of a garment moving through wash → dry → press → fold → pack.

## Scripts

| Command        | What it does              |
| -------------- | ------------------------- |
| `npm run dev`  | Development server        |
| `npm run build`| Production build          |
| `npm run start`| Serve the production build |
| `npm run lint` | ESLint                    |
