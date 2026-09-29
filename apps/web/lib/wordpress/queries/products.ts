import { graphqlRequest } from "@/lib/wordpress/client";

export type ProductSummary = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  shortDescription: string | null;
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  onSale: boolean;
  stockStatus: string | null;
  image: {
    sourceUrl: string;
    altText: string | null;
  } | null;
};

type ProductsResponse = {
  products: {
    nodes: ProductSummary[];
  };
};

type ProductResponse = {
  product: ProductSummary | null;
};

const productFields = `
  id
  databaseId
  name
  slug
  type
  description
  shortDescription(format: RAW)
  image {
    sourceUrl
    altText
  }
  ... on SimpleProduct {
    onSale
    price
    regularPrice
    salePrice
    stockStatus
  }
  ... on VariableProduct {
    onSale
    price
    regularPrice
    salePrice
    stockStatus
  }
`;

export async function getProducts(): Promise<ProductSummary[]> {
  const data = await graphqlRequest<ProductsResponse>(
    `
      query GetProducts {
        products(first: 24) {
          nodes {
            ${productFields}
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
  const data = await graphqlRequest<ProductResponse>(
    `
      query GetProductBySlug($slug: ID!, $idType: ProductIdTypeEnum) {
        product(id: $slug, idType: $idType) {
          ${productFields}
        }
      }
    `,
    { slug, idType: "SLUG" },
  );

  return data.product;
}
