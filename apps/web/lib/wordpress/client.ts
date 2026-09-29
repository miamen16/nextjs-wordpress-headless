const endpoint =
  process.env.WORDPRESS_GRAPHQL_URL ||
  `${process.env.WORDPRESS_URL}/graphql`;

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!endpoint || endpoint === "/graphql") {
    throw new Error("WORDPRESS_GRAPHQL_URL is not configured.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.WORDPRESS_API_SECRET
        ? { Authorization: `Bearer ${process.env.WORDPRESS_API_SECRET}` }
        : {}),
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`WordPress request failed with status ${response.status}`);
  }

  const result = (await response.json()) as GraphQLResponse<T>;

  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join("; "));
  }

  if (!result.data) {
    throw new Error("WordPress returned no GraphQL data.");
  }

  return result.data;
}
