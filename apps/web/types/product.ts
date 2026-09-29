export interface Product {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  image?: {
    url: string;
    altText?: string | null;
  };
}
