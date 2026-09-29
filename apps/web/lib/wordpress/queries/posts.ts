import { graphqlRequest } from "../client";

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
};

type PostsQuery = {
  posts: {
    nodes: PostSummary[];
  };
};

const POSTS_QUERY = `
  query Posts {
    posts(first: 10) {
      nodes {
        id
        title
        slug
      }
    }
  }
`;

export async function getLatestPosts() {
  const data = await graphqlRequest<PostsQuery>(POSTS_QUERY);
  return data.posts.nodes;
}
