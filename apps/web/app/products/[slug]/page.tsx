import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/wordpress/queries/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  const description = product.shortDescription || product.description;
  const cleanDescription = description
    ? description.replace(/<[^>]+>/g, "").slice(0, 160)
    : `View ${product.name}`;

  return {
    title: product.name,
    description: cleanDescription,
    openGraph: product.image
      ? { images: [{ url: product.image.sourceUrl }] }
      : undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="container">
      <article className="product-detail">
        <div>
          {product.image ? (
            <img
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              className="product-detail-image"
            />
          ) : (
            <div className="product-detail-image product-image-placeholder">
              No image
            </div>
          )}
        </div>

        <div className="product-detail-content">
          <p className="eyebrow">WooCommerce Product</p>
          <h1>{product.name}</h1>

          {product.onSale && product.regularPrice ? (
            <p className="product-regular-price">
              {product.regularPrice}
            </p>
          ) : null}

          {product.price ? (
            <p className="product-detail-price">{product.price}</p>
          ) : null}

          <p className="product-stock">
            {product.stockStatus === "IN_STOCK"
              ? "In stock"
              : product.stockStatus === "OUT_OF_STOCK"
                ? "Out of stock"
                : "Stock status unavailable"}
          </p>

          {product.description ? (
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p>No description available.</p>
          )}
        </div>
      </article>
    </main>
  );
}
