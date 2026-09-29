const endpoint =
  process.env.WORDPRESS_GRAPHQL_URL ||
  (process.env.WORDPRESS_URL ? process.env.WORDPRESS_URL + "/graphql" : "");

type GraphQLResponse<T> = { data?: T; errors?: Array<{ message: string }> };
type GraphQLRequestOptions = { cache?: RequestCache; revalidate?: number; headers?: Record<string, string> };

export async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>, options: GraphQLRequestOptions = {}): Promise<T> {
  const result = await graphqlRequestWithResponse<T>(query, variables, options);
  return result.data;
}

export async function graphqlRequestWithResponse<T>(query: string, variables?: Record<string, unknown>, options: GraphQLRequestOptions = {}): Promise<{ data: T; cartToken: string | null }> {
  if (!endpoint) throw new Error("WORDPRESS_GRAPHQL_URL is not configured.");
  const fetchOptions: RequestInit & { next?: { revalidate?: number } } = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(process.env.WORDPRESS_API_SECRET ? { Authorization: "Bearer " + process.env.WORDPRESS_API_SECRET } : {}), ...options.headers },
    body: JSON.stringify({ query, variables }),
  };
  if (options.cache) fetchOptions.cache = options.cache;
  else if (options.revalidate !== undefined) fetchOptions.next = { revalidate: options.revalidate };
  else fetchOptions.next = { revalidate: 60 };
  const response = await fetch(endpoint, fetchOptions);
  if (!response.ok) throw new Error("WordPress request failed with status " + response.status);
  const result = (await response.json()) as GraphQLResponse<T>;
  if (result.errors?.length) throw new Error(result.errors.map((error) => error.message).join("; "));
  if (!result.data) throw new Error("WordPress returned no GraphQL data.");
  return { data: result.data, cartToken: response.headers.get("Cart-Token") ?? response.headers.get("woocommerce-session") };
}