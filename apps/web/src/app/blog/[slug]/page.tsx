import { notFound } from "next/navigation";
import { db } from "@repo/db";
import { PostDetailView } from "@repo/ui";

export const dynamic = "force-dynamic";

async function getBlogPost(slug: string) {
  return db.blogPost.findUnique({ where: { slug } });
}

async function getRecentPosts(excludeSlug: string) {
  return db.blogPost.findMany({
    where: { slug: { not: excludeSlug } },
    orderBy: { publishedAt: "desc" },
    take: 6,
    select: {
      slug: true,
      title: true,
      coverIcon: true,
      coverGradient: true,
      category: true,
      readTime: true,
      publishedAt: true,
    },
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, recentPosts] = await Promise.all([
    getBlogPost(slug),
    getRecentPosts(slug),
  ]);

  if (!post) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <PostDetailView
        post={post}
        recentPosts={recentPosts}
        linkPrefix="/blog"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />
    </div>
  );
}
