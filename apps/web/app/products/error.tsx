"use client";

export default function ProductsError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="container">
      <div className="empty-state">
        <p className="eyebrow">Catalog error</p>
        <h1>We could not load the products.</h1>
        <p>Check the WordPress GraphQL connection and try again.</p>
        <button type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
