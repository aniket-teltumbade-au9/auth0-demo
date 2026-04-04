# Auth0 Client Demo

High-fidelity Auth0 demo built with Next.js App Router, TypeScript, Tailwind CSS, Lucide React, and MongoDB.

## Included

- Premium-style landing page with hero, pricing, and FAQ
- Protected Auth Demo page for social login, passwordless triggers, and enterprise SSO storytelling
- Auth0 middleware, callback hook, and connected accounts support
- MongoDB-backed user sync and editable settings profile
- Deployment-ready environment template

## Auth0 dashboard checklist

Add these URLs for local development:

- Allowed Callback URL: `http://localhost:3000/auth/callback`
- Allowed Logout URL: `http://localhost:3000`
- Allowed Web Origin: `http://localhost:3000`

Enable the following as needed:

- Google social connection
- Facebook social connection
- Email passwordless connection
- SMS passwordless connection
- Connected Accounts / account linking
- Offline Access for social connections used in linking

## Run locally

1. Install dependencies with `npm install`
2. Copy `.env.local.example` to `.env.local` and fill in real values
3. Start the dev server with `npm run dev`
