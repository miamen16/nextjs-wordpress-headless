export default function BlogLoading() {
  return (
    <main className="container">
      <header className="page-header">
        <div className="skeleton skeleton-eyebrow" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" />
      </header>

      <div className="blog-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <article className="blog-card blog-card-skeleton" key={index}>
            <div className="skeleton blog-card-image" />
            <div className="blog-card-content">
              <div className="skeleton skeleton-small" />
              <div className="skeleton skeleton-heading" />
              <div className="skeleton skeleton-text" />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
