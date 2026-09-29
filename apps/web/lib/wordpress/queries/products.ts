import { graphqlRequest } from "@/lib/wordpress/client";

export type ProductSummary = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description: string | null;
  price: string | null;
  featuredImageUrl: string | null;
};

type ProductsResponse = {
  products: {
    nodes: ProductSummary[];
  };
};

export async function getProducts(): Promise<ProductSummary[]> {
  const data = await graphqlRequest<ProductsResponse>(
    `
      query GetProducts {
        products(first: 24) {
          nodes {
            id
            databaseId
            name
            slug
            description
            price
            featuredImageUrl
          }
        }
      }
    `,
  );

  return data.products.nodes;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductSummary | null> {
  const data = await graphqlRequest<ProductsResponse>(
    `
      query GetProductBySlug($slug: ID!) {
        product(id: $slug, idType: SLUG) {
          id
          databaseId
          name
          slug
          description
          price
          featuredImageUrl
        }
      }
    `,
    { slug },
  ).catch((error: unknown) => {
    if (error instanceof Error && error.message.includes("GraphQL errors")) {
      return { products: { nodes: [] } };
    }

    throw error;
  });

  return data.products.nodes[0] ?? null;
}
