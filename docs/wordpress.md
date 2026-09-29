# WordPress + WooCommerce setup

The frontend uses WordPress as the CMS and **WooCommerce as the commerce engine**. Products are not stored in a custom post type created by this repository.

## Required plugins

1. Install and activate WooCommerce.
2. Install and activate WPGraphQL.
3. Install and activate **WPGraphQL for WooCommerce (WooGraphQL)**.
4. Activate the repository's small integration plugin at:
   `apps/wordpress/plugins/headless-api/headless-api.php`
5. Confirm the GraphQL endpoint is available at:
   `https://your-cms-domain.com/graphql`

WooGraphQL extends WPGraphQL with WooCommerce products, pricing, inventory, cart, customer, order, and related commerce data. citeturn0search0turn0search4

## Product model

WooCommerce owns the product catalog.

The Next.js application queries the WooCommerce product types exposed through WooGraphQL, including:

- Product ID and slug
- Name
- Description and short description
- Product image
- Price
- Regular price
- Sale price
- Sale status
- Stock status
- Product type

Simple and variable product fields are handled through GraphQL type fragments. WooGraphQL's product documentation uses the same Product, SimpleProduct, and VariableProduct model. citeturn0search2

## Create a product

In WordPress:

1. Open **Products → Add New**.
2. Create the product using WooCommerce.
3. Set the product type.
4. Set the price and inventory.
5. Add product images.
6. Publish the product.

The product will then be available to the Next.js storefront through GraphQL.

## Next.js routes

The repository currently provides:

- `/products`
- `/products/[slug]`

Both routes now read WooCommerce data instead of the custom Product post type.

## Environment variables

In `apps/web/.env.local`:

    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    WORDPRESS_URL=https://cms.example.com
    WORDPRESS_GRAPHQL_URL=https://cms.example.com/graphql
    WORDPRESS_MEDIA_HOST=cms.example.com

## Verify GraphQL

Use WPGraphiQL or another GraphQL client to confirm that the WooCommerce Product types and queries are present in the schema before testing the Next.js storefront. WooGraphQL recommends inspecting the live schema while developing headless WooCommerce integrations. citeturn0search12

If the product query fails, check:

- WooCommerce is active.
- WPGraphQL is active.
- WooGraphQL is active.
- Headless API is active.
- The GraphQL endpoint URL is correct.
- The WordPress server allows requests from the Next.js server.

## Future commerce features

After the product catalog is stable, the next implementation should use WooGraphQL for:

- Add to cart
- Cart persistence/session handling
- Variable product selections
- Checkout
- Customer accounts
- Orders

WooGraphQL documents cart queries and mutations for headless storefronts, including `addToCart` and cart item operations. citeturn0search5
