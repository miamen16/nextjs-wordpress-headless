# Next.js + WordPress Headless

Production-oriented monorepo starter for a headless WordPress application.

## Architecture

- apps/web — Next.js frontend
- apps/wordpress — WordPress custom plugin code
- packages/types — shared TypeScript types
- docs — architecture, deployment, and WordPress setup

The current frontend uses WPGraphQL for server-side content fetching.

## Products

The first end-to-end feature is implemented:

WordPress Product → WPGraphQL → Next.js

Frontend routes:

- /products
- /products/[slug]

WordPress provides the Product post type, featured image, description, and price.

See docs/wordpress.md for CMS setup.

## Requirements

- Node.js 22+
- pnpm 10+
- WordPress
- WPGraphQL

## Local setup

Install dependencies:

    pnpm install

Create the frontend environment file:

    cp apps/web/.env.example apps/web/.env.local

Set WORDPRESS_URL, WORDPRESS_GRAPHQL_URL, and WORDPRESS_MEDIA_HOST to your WordPress installation.

Start Next.js:

    pnpm dev

## WordPress

Activate the Headless API plugin from:

apps/wordpress/plugins/headless-api/headless-api.php

Copy the plugin into your WordPress installation under wp-content/plugins/headless-api/.

Install and activate WPGraphQL, then create products from the WordPress admin.

## Production direction

The repository is being built incrementally toward:

- typed GraphQL operations
- authentication
- WooCommerce integration
- search and filtering
- webhook-based cache revalidation
- automated tests
- CI/CD
- production deployment

Custom WordPress code should remain in the repository rather than being edited directly in a production WordPress installation.
