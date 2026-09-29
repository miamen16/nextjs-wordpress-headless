"use client";
import { useState } from "react";

export function AddToCartButton({ productId, disabled = false }: { productId: number; disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  async function addToCart() {
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", productId, quantity: 1 }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not add product to cart.");
      setMessage("Added to cart");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not add product to cart."); }
    finally { setLoading(false); }
  }
  return <div className="cart-action"><button type="button" className="button" onClick={addToCart} disabled={disabled || loading}>{loading ? "Adding…" : "Add to cart"}</button>{message ? <p className="cart-message">{message}</p> : null}</div>;
}