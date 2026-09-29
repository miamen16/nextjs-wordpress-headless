import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/wordpress/queries/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our WooCommerce products.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="container">
      <header className="page-header">
        <p className="eyebrow">Shop</p>
        <h1>Products</h1>
        <p>Products are managed by WooCommerce and rendered by Next.js.</p>
      </header>

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products yet</h2>
          <p>Create a product in WooCommerce and it will appear here.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              {product.image ? (
                <img
                  src={product.image.sourceUrl}
                  alt={product.image.altText || product.name}
                  className="product-image"
                />
              ) : (
                <div className="product-image product-image-placeholder">
                  No image
                </div>
              )}

              <div className="product-card-content">
                <p className="product-price">
                  {product.price || "Price on request"}
                </p>

                <h2>
                  <Link href={`/products/${product.slug}`}>
                    {product.name}
                  </Link>
                </h2>

                {product.shortDescription ? (
                  <p
                    className="product-excerpt"
                    dangerouslySetInnerHTML={{
                      __html: product.shortDescription,
                    }}
                  />
                ) : null}

                <p className="product-stock">
                  {product.stockStatus === "IN_STOCK"
                    ? "In stock"
                    : product.stockStatus === "OUT_OF_STOCK"
                      ? "Out of stock"
                      : "Stock status unavailable"}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
