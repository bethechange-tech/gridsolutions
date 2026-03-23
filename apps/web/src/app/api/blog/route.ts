/* ──────────────────────────────────────────────
 *  GET /api/blog?category=All
 *  Returns blog posts, categories, and featured
 *  data for the blog page.
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") ?? "All";

  const allPosts = await db.blogPost.findMany({ orderBy: { publishedAt: "desc" } });

  // Reshape flat DB fields into the nested shape the UI expects
  const mapPost = (p: (typeof allPosts)[number]) => ({
    ...p,
    date: p.publishedAt.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    author: { name: p.authorName, avatar: p.authorAvatar },
  });

  const mapped = allPosts.map(mapPost);

  const filteredPosts =
    category === "All"
      ? mapped
      : mapped.filter((p) => p.category === category);

  // Derive categories from data
  const categorySet = new Set(mapped.map((p) => p.category));
  const categories = ["All", ...Array.from(categorySet).sort()];

  // Featured posts
  const featured = mapped.find((p) => p.featured) ?? mapped[0] ?? null;
  const otherFeatured = mapped.filter((p) => p.featured && p.id !== featured?.id).slice(0, 3);
  const recent = mapped.slice(0, 5);

  return NextResponse.json({
    posts: filteredPosts,
    allPosts: mapped,
    categories,
    featured,
    otherFeatured,
    recent,
  });
}
