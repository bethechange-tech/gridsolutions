"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBlogData, type BlogResponse } from "@/services/api";
import type { BlogPost } from "@/data/blog";

/* ─── small helper: author initials ─── */
function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("");
}

/* ─── Featured card (left hero) ─── */
function FeaturedHero({ post }: { post: BlogPost }) {
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer">
      {/* gradient "image" */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${post.coverGradient} transition-transform duration-500 group-hover:scale-105`}
      />
      {/* icon overlay */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[64px] opacity-20 group-hover:opacity-30 transition-opacity duration-500 select-none">
        {post.coverIcon}
      </span>
      {/* bottom overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <span className="inline-block bg-[#1a8d1a] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
          {post.category}
        </span>
        <h2 className="text-white font-bold text-xl sm:text-2xl leading-snug max-w-md">
          {post.title}
        </h2>
        <div className="flex items-center gap-3 mt-4">
          <span
            className={`w-7 h-7 rounded-full ${post.author.avatar} flex items-center justify-center text-[10px] font-bold text-white`}
          >
            {initials(post.author.name)}
          </span>
          <span className="text-white/70 text-xs">
            {post.author.name} &middot; {post.readTime}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar featured row ─── */
function FeaturedRow({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      {/* thumbnail */}
      <div
        className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl bg-gradient-to-br ${post.coverGradient} flex items-center justify-center shrink-0 overflow-hidden group-hover:shadow-md transition-shadow duration-300`}
      >
        <span className="text-2xl opacity-40 group-hover:opacity-60 transition-opacity select-none">
          {post.coverIcon}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-[#1a8d1a] transition-colors duration-200 line-clamp-2">
        {post.title}
      </p>
    </div>
  );
}

/* ─── Post card ─── */
function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      {/* cover */}
      <div
        className={`aspect-[16/10] bg-gradient-to-br ${post.coverGradient} relative overflow-hidden`}
      >
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[48px] opacity-20 group-hover:opacity-30 transition-opacity duration-500 select-none">
          {post.coverIcon}
        </span>
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {post.category}
          </span>
        </div>
      </div>

      {/* body */}
      <div className="p-5 sm:p-6">
        <h3 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#1a8d1a] transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-3">
          <span
            className={`w-7 h-7 rounded-full ${post.author.avatar} flex items-center justify-center text-[10px] font-bold text-white`}
          >
            {initials(post.author.name)}
          </span>
          <span className="text-xs text-gray-400">
            {post.author.name} &middot; {post.readTime}
          </span>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════
   Blog Page
   ═══════════════════════════════════════════ */
export default function BlogPage() {
  const [blogData, setBlogData] = useState<BlogResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchBlogData();
      setBlogData(data);
    };
    load();
  }, []);

  if (!blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#1a8d1a] rounded-full animate-spin" />
      </div>
    );
  }

  const { featured, otherFeatured, allPosts, categories } = blogData;

  const filteredPosts =
    activeCategory === "All"
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  const recentPosts = filteredPosts.slice(featured ? 1 : 0);
  const displayedPosts = showAll ? recentPosts : recentPosts.slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* ── Page header ── */}
      <div className="mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5 shadow-sm">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1a8d1a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          Blog
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
          Insights &amp; Resources
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-xl">
          Expert perspectives on cloud, security, analytics, and modern
          engineering — straight from the Tenuq team.
        </p>
      </div>

      {/* ── Featured section ── */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 mb-16 sm:mb-20">
        <FeaturedHero post={featured} />

        <div>
          <h2 className="font-bold text-lg text-gray-900 mb-5">
            Other featured posts
          </h2>
          <div className="space-y-5">
            {otherFeatured.map((post) => (
              <FeaturedRow key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent posts ── */}
      <section>
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>

          {/* category filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setShowAll(false);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* post grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {/* show more */}
        {!showAll && recentPosts.length > 6 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-6 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              All Posts
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </section>

      {/* ── CTA banner ── */}
      <section className="mt-16 sm:mt-20 bg-gray-900 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
        {/* decorative */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#1a8d1a]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1a8d1a]/10 rounded-full blur-3xl" />

        <div className="relative">
          <h3 className="text-white font-bold text-xl sm:text-2xl mb-3">
            Want insights tailored to your business?
          </h3>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto mb-6">
            Book a free consultation and get expert recommendations specific to
            your tech stack and growth goals.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-[#1a8d1a] text-white rounded-full px-7 py-3 text-sm font-semibold hover:brightness-110 transition-all duration-300 shadow-lg shadow-[#1a8d1a]/25"
          >
            Book a Consultation
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
