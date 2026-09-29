import { cookies } from "next/headers";
import Link from "next/link";
import { graphqlRequestWithResponse } from "@/lib/wordpress/client";

const CART_COOKIE = "sessionToken";
const cartQuery = "query GetCart { cart { contents(first: 100) { itemCount nodes { key quantity total subtotal product { node { databaseId name slug image { sourceUrl altText } } } variation { node { databaseId name } } } } subtotal total } }";

export default async function CartPage() {
  const sessionToken = (await cookies()).get(CART_COOKIE)?.value ?? null;
  const result = await graphqlRequestWithResponse<any>(cartQuery, undefined, { cache: "no-store", headers: sessionToken ? { "Cart-Token": sessionToken } : undefined });
  const cart = result.data.cart;
  return (
    <main className="container">
      <div className="page-heading"><p className="eyebrow">WooCommerce</p><h1>Your cart</h1></div>
      {cart.contents.itemCount === 0 ? <div className="empty-state"><p>Your cart is empty.</p><Link className="button" href="/products">Continue shopping</Link></div> : (
        <div className="cart-layout">
          <section className="cart-items">
            {cart.contents.nodes.map((item: any) => <article className="cart-item" key={item.key}><div><Link href={"/products/" + item.product.node.slug}><h2>{item.product.node.name}</h2></Link>{item.variation?.node ? <p>{item.variation.node.name}</p> : null}<p>Quantity: {item.quantity}</p></div><strong>{item.total}</strong></article>)}
          </section>
          <aside className="cart-summary"><h2>Summary</h2><p>Subtotal <strong>{cart.subtotal}</strong></p><p>Total <strong>{cart.total}</strong></p><Link className="button" href="/checkout">Proceed to checkout</Link></aside>
        </div>
      )}
    </main>
  );
}