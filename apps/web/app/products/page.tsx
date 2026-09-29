import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/wordpress/queries/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our products.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="container">
      <header className="page-header">
        <p className="eyebrow">Catalog</p>
        <h1>Products</h1>
        <p>Products are managed in WordPress and rendered by Next.js.</p>
      </header>

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products yet</h2>
          <p>Create a Product in WordPress and it will appear here.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              {product.featuredImageUrl ? (
                <img
                  src={product.featuredImageUrl}
                  alt={product.name}
                  className="product-image"
                />
              ) : (
                <div className="product-image product-image-placeholder">
                  No image
                </div>
              )}

              <div className="product-card-content">
                <p className="product-price">
                  {product.price ? product.price : "Price on request"}
                </p>
                <h2>
                  <Link href={`/products/${product.slug}`}>
                    {product.name}
                  </Link>
                </h2>
                {product.description ? (
                  <p
                    className="product-excerpt"
                    dangerouslySetInnerHTML={{
                      __html: product.description,
                    }}
                  />
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
