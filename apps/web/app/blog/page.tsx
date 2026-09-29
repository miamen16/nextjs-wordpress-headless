import Link from "next/link";
import { getLatestPosts } from "@/lib/wordpress/queries/posts";

export const metadata = {
  title: "Blog",
  description: "Latest articles and updates.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export default async function BlogPage() {
  const posts = await getLatestPosts();

  return (
    <main className="container">
      <header className="page-header">
        <p className="eyebrow">Journal</p>
        <h1>Blog</h1>
        <p>Latest articles, updates, and insights from our WordPress content.</p>
      </header>

      {posts.length === 0 ? (
        <section className="empty-state">
          <h2>No posts yet</h2>
          <p>Publish a post in WordPress and it will appear here.</p>
        </section>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => (
            <article className="blog-card" key={post.id}>
              <Link className="blog-card-image-link" href={`/blog/${post.slug}`}>
                {post.featuredImage?.node ? (
                  <img
                    className="blog-card-image"
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText ?? post.title}
                  />
                ) : (
                  <div className="blog-card-image blog-image-placeholder">
                    No image
                  </div>
                )}
              </Link>

              <div className="blog-card-content">
                <p className="blog-date">{formatDate(post.date)}</p>
                <h2>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                {post.excerpt ? (
                  <div
                    className="blog-excerpt"
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                ) : null}
                <Link className="blog-read-more" href={`/blog/${post.slug}`}>
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
