# Next.js + WordPress Headless

Production-oriented monorepo starter for a Next.js frontend with WordPress as a headless CMS/backend.

## Architecture

- `apps/web` — Next.js App Router frontend
- `apps/wordpress` — WordPress custom backend code
- `packages/types` — shared TypeScript types
- WPGraphQL is the planned primary content API
- Next.js owns the public UI, routing and SEO
- WordPress owns content and backend business logic

## Requirements

- Node.js 22+
- pnpm 10+
- WordPress with WPGraphQL for the CMS/API

## Setup

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

The WordPress application is intentionally represented by custom code only. Install WordPress separately and place the plugin code under its `wp-content/plugins` directory.

## Environment

See `apps/web/.env.example`.

## Status

Initial architecture scaffold. Product queries, authentication, WooCommerce integration and webhook-driven revalidation will be added incrementally.
