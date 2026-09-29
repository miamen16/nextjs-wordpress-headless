import { graphqlRequest } from "../client";

export type PostSummary = {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  date: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string | null;
    } | null;
  } | null;
};

type PostsQuery = {
  posts: {
    nodes: PostSummary[];
  };
};

type PostQuery = {
  post: PostSummary | null;
};

const postFields = `
  id
  databaseId
  title
  slug
  excerpt
  content
  date
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
`;

export async function getLatestPosts(): Promise<PostSummary[]> {
  const data = await graphqlRequest<PostsQuery>(
    `
      query GetLatestPosts {
        posts(first: 12, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            ${postFields}
          }
        }
      }
    `,
  );

  return data.posts.nodes;
}

export async function getPostBySlug(
  slug: string,
): Promise<PostSummary | null> {
  const data = await graphqlRequest<PostQuery>(
    `
      query GetPostBySlug($slug: ID!, $idType: PostIdType) {
        post(id: $slug, idType: $idType) {
          ${postFields}
        }
      }
    `,
    {
      slug,
      idType: "SLUG",
    },
  );

  return data.post;
}
