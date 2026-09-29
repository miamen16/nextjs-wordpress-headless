# WordPress setup

The frontend expects a WordPress installation to provide the CMS and GraphQL API.

## Required plugins

1. Install and activate WPGraphQL.
2. Install and activate the repository plugin at apps/wordpress/plugins/headless-api/headless-api.php.
3. Confirm the GraphQL endpoint is available at:
   https://your-cms-domain.com/graphql

## Product model

The Headless API plugin registers:

- Post type: product
- GraphQL type: Product
- GraphQL collection: products
- Product fields: title, content, excerpt, featured image, price

The product price is managed from the Product Details box in the WordPress editor.

## Create a product

In WordPress:

1. Open Products → Add New.
2. Enter the product title.
3. Add the product description.
4. Set a featured image.
5. Enter the price in Product Details.
6. Publish the product.

The Next.js application will fetch the product through WPGraphQL.

## Environment variables

In apps/web/.env.local:

    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    WORDPRESS_URL=https://cms.example.com
    WORDPRESS_GRAPHQL_URL=https://cms.example.com/graphql
    WORDPRESS_MEDIA_HOST=cms.example.com

For local WordPress, use the actual hostname and port used by your WordPress installation.

## Verify GraphQL

Before opening /products, verify that WPGraphQL is responding and that the Product type is present in the GraphQL schema.

If the product query fails, check:

- WPGraphQL is active.
- Headless API is active.
- The Product post type appears in the WordPress admin.
- The GraphQL endpoint URL is correct.
- The WordPress server allows requests from the Next.js server.
