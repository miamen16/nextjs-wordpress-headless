import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { graphqlRequestWithResponse } from "@/lib/wordpress/client";

const CART_COOKIE = "sessionToken";
const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };
type CartAction = "add" | "update" | "remove" | "clear";
type CartPayload = { action: CartAction; productId?: number; variationId?: number; variation?: Array<{ attributeName: string; attributeValue: string }>; quantity?: number; key?: string };

const cartSelection = "cart { contents(first: 100) { itemCount nodes { key quantity total subtotal product { node { databaseId name slug image { sourceUrl altText } } } variation { node { databaseId name } } } } subtotal total }";

async function runMutation(payload: CartPayload, sessionToken: string | null) {
  const headers = sessionToken ? { "Cart-Token": sessionToken } : undefined;
  if (payload.action === "add") return graphqlRequestWithResponse("mutation AddToCart($input: AddToCartInput!) { addToCart(input: $input) { " + cartSelection + " } }", { input: { productId: payload.productId, variationId: payload.variationId, variation: payload.variation, quantity: payload.quantity ?? 1 } }, { cache: "no-store", headers });
  if (payload.action === "update") return graphqlRequestWithResponse("mutation UpdateCart($items: [CartItemQuantityInput]!) { updateItemQuantities(input: { items: $items }) { " + cartSelection + " } }", { items: [{ key: payload.key, quantity: payload.quantity ?? 1 }] }, { cache: "no-store", headers });
  if (payload.action === "remove") return graphqlRequestWithResponse("mutation RemoveCartItem($keys: [ID]!) { removeItemsFromCart(input: { keys: $keys }) { " + cartSelection + " } }", { keys: [payload.key] }, { cache: "no-store", headers });
  return graphqlRequestWithResponse("mutation ClearCart { removeItemsFromCart(input: { all: true }) { " + cartSelection + " } }", undefined, { cache: "no-store", headers });
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(CART_COOKIE)?.value ?? null;
  const result = await graphqlRequestWithResponse("query GetCart { " + cartSelection + " }", undefined, { cache: "no-store", headers: sessionToken ? { "Cart-Token": sessionToken } : undefined });
  const response = NextResponse.json(result.data.cart);
  if (result.cartToken) response.cookies.set(CART_COOKIE, result.cartToken, cookieOptions);
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as CartPayload;
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(CART_COOKIE)?.value ?? null;
    if (payload.action === "add" && !payload.productId) return NextResponse.json({ error: "productId is required." }, { status: 400 });
    if ((payload.action === "update" || payload.action === "remove") && !payload.key) return NextResponse.json({ error: "Cart item key is required." }, { status: 400 });
    const result = await runMutation(payload, sessionToken);
    const response = NextResponse.json(result.data.cart);
    if (result.cartToken) response.cookies.set(CART_COOKIE, result.cartToken, cookieOptions);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cart request failed." }, { status: 400 });
  }
}