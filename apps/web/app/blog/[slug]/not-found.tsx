import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <main className="container">
      <section className="empty-state">
        <p className="eyebrow">404</p>
        <h1>Post not found</h1>
        <p>The article you are looking for does not exist.</p>
        <Link className="button" href="/blog">
          Back to blog
        </Link>
      </section>
    </main>
  );
}
