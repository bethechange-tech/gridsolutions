/* ──────────────────────────────────────────────
 *  GET /api/blog?category=All
 *  Returns blog posts, categories, and featured
 *  data for the blog page.
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import {
  BLOG_POSTS,
  BLOG_CATEGORIES,
  getFeaturedPost,
  getOtherFeaturedPosts,
  getRecentPosts,
} from "@/data/blog";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") ?? "All";

  const filteredPosts =
    category === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === category);

  return NextResponse.json({
    posts: filteredPosts,
    allPosts: BLOG_POSTS,
    categories: BLOG_CATEGORIES,
    featured: getFeaturedPost(),
    otherFeatured: getOtherFeaturedPosts(),
    recent: getRecentPosts(),
  });
}
