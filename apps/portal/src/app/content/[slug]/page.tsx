import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import { getBlogPostBySlug, getRecentBlogPosts } from "@/lib/data";
import { deleteBlogPost, toggleBlogFeatured } from "@/lib/actions";
import { redirect } from "next/navigation";
import { PostDetailView } from "@repo/ui";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, recentPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getRecentBlogPosts(slug),
  ]);

  if (!post) notFound();

  return (
    <>
      <TopBar title="Post Details" />
      {/*
        portal-post-detail: overrides PostDetailView's lg → xl breakpoints
        because the portal sidebar already consumes 260px at lg widths.
      */}
      <div className="p-4 sm:p-6 portal-post-detail">
        <PostDetailView
          post={post}
          recentPosts={recentPosts}
          linkPrefix="/content"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Content", href: "/content" },
            { label: "Details" },
          ]}
          actions={
            <div className="flex items-center gap-3 mt-4">
              <form
                action={async () => {
                  "use server";
                  await toggleBlogFeatured(post.id, !post.featured);
                }}
              >
                <button
                  type="submit"
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                    post.featured
                      ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {post.featured ? "★ Featured" : "☆ Feature"}
                </button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await deleteBlogPost(post.id);
                  redirect("/content");
                }}
              >
                <button
                  type="submit"
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </form>
            </div>
          }
        />
      </div>
    </>
  );
}
