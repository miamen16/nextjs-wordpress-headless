import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/wordpress/queries/posts";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt
      ? post.excerpt.replace(/<[^>]*>/g, "").trim()
      : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt
        ? post.excerpt.replace(/<[^>]*>/g, "").trim()
        : undefined,
      images: post.featuredImage?.node?.sourceUrl
        ? [post.featuredImage.node.sourceUrl]
        : undefined,
    },
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date(date));
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="container">
      <article className="blog-post">
        <Link className="back-link" href="/blog">
          ← Back to blog
        </Link>

        <header className="blog-post-header">
          <p className="eyebrow">Article</p>
          <h1>{post.title}</h1>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </header>

        {post.featuredImage?.node ? (
          <img
            className="blog-post-image"
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText ?? post.title}
          />
        ) : null}

        {post.content ? (
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="empty-state">This post has no content yet.</p>
        )}
      </article>
    </main>
  );
}
