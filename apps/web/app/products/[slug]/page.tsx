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
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name,
    description: product.description
      ? product.description.replace(/<[^>]+>/g, "").slice(0, 160)
      : `View ${product.name}`,
    openGraph: product.featuredImageUrl
      ? {
          images: [{ url: product.featuredImageUrl }],
        }
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
          {product.featuredImageUrl ? (
            <img
              src={product.featuredImageUrl}
              alt={product.name}
              className="product-detail-image"
            />
          ) : (
            <div className="product-detail-image product-image-placeholder">
              No image
            </div>
          )}
        </div>

        <div className="product-detail-content">
          <p className="eyebrow">Product</p>
          <h1>{product.name}</h1>

          {product.price ? (
            <p className="product-detail-price">{product.price}</p>
          ) : null}

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
