# Bhavana Studio — Wedding Contract & Quotation Builder

A mobile-first Progressive Web App for generating professional wedding quotations and contracts in under 2 minutes.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, React Hook Form, React Router
- **Backend:** Supabase (Auth, Database, Storage)
- **Deployment:** Vercel
- **PWA:** vite-plugin-pwa

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) on your phone or browser.

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy `.env.example` to `.env` and add your credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Without Supabase configured, the app runs with built-in mock data.

## Features

- **8-step contract wizard** — Client → Event → Package → Services → Pricing → Sections → Preview → Generate
- **Package builder** — Pre-configured Silver, Gold, Premium packages
- **Service library** — Reusable services with pricing
- **Dynamic document builder** — Modular quotation components
- **Live pricing calculations** — Subtotal, discount, GST, advance, balance
- **PDF generation** — Download, share, print
- **Draft contracts** — Save and resume later
- **Duplicate contracts** — Copy and modify
- **Search** — Find contracts by client, phone, date, venue
- **PWA** — Installable on mobile devices

## Deploy to Vercel

```bash
npm run build
```

Connect your repo to Vercel and set the environment variables.

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── document/     # Dynamic quotation document blocks
│   └── contract/     # Wizard step components
├── pages/            # Route pages
├── layouts/          # App & wizard layouts
├── hooks/            # Custom React hooks
├── services/         # Supabase & mock data services
├── types/            # TypeScript types
├── utils/            # Formatting, calculations, PDF
└── supabase/         # Supabase client
```
