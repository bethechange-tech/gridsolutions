import Link from "next/link";
import type { JSX, ReactNode } from "react";

/* ─── Types ────────────────────────────────── */

export interface PostData {
  title: string;
  excerpt: string;
  content?: string | null;
  category: string;
  authorName: string;
  authorAvatar?: string | null;
  coverGradient: string;
  coverIcon: string;
  readTime: string;
  publishedAt: Date;
}

export interface RecentPost {
  slug: string;
  title: string;
  coverIcon: string;
  coverGradient: string;
  category?: string;
  readTime?: string;
  publishedAt: Date;
}

export interface PostDetailProps {
  /** The blog post to render */
  post: PostData;
  /** Recent posts for the sidebar */
  recentPosts: RecentPost[];
  /** Breadcrumb items  —  [{ label, href? }] */
  breadcrumbs: { label: string; href?: string }[];
  /** Base path for recent-post links, e.g. "/content" or "/blog" */
  linkPrefix: string;
  /** Optional actions slot rendered below the article body (e.g. admin buttons) */
  actions?: ReactNode;
}

/* ─── Helpers ──────────────────────────────── */

function fmtDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtShortDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function authorInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ─── Component ────────────────────────────── */

export function PostDetailView({
  post,
  recentPosts,
  breadcrumbs,
  linkPrefix,
  actions,
}: PostDetailProps): JSX.Element {
  return (
    <div className="space-y-0">
      {/* ═══ Hero banner ═══ */}
      <div className="relative rounded-3xl overflow-hidden mb-8">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{ background: post.coverGradient }}
        />
        {/* Decorative overlay pattern */}
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Icon watermark */}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-[120px] sm:text-[160px] opacity-[0.12] select-none pointer-events-none">
          {post.coverIcon}
        </span>

        {/* Content */}
        <div className="relative z-10 px-6 sm:px-10 pt-8 sm:pt-12 pb-10 sm:pb-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm mb-6">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-white/40">›</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/90 font-medium truncate max-w-[240px]">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* Category pill */}
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a8d1a]" />
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-white mb-6 leading-[1.2] max-w-3xl">
            {post.title}
          </h1>

          {/* Author & meta row */}
          <div className="flex items-center gap-4">
            <span
              className={`w-10 h-10 rounded-full ${post.authorAvatar ?? "bg-gradient-to-br from-emerald-400 to-emerald-600"} flex items-center justify-center text-[11px] font-bold text-white shadow-lg ring-2 ring-white/20`}
            >
              {authorInitials(post.authorName)}
            </span>
            <div>
              <p className="text-white font-semibold text-sm">{post.authorName}</p>
              <div className="flex items-center gap-2 text-white/50 text-xs mt-0.5">
                <span>{fmtDate(post.publishedAt)}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Main layout: article + sidebar ═══ */}
      <div className="flex flex-col xl:flex-row gap-8">
        {/* ── Left: Article ── */}
        <article className="flex-1 min-w-0">
          {/* Excerpt callout */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
            <div className="flex gap-4">
              <div className="w-1 shrink-0 rounded-full bg-gradient-to-b from-[#1a8d1a] to-emerald-300" />
              <blockquote className="text-[15px] sm:text-base text-gray-600 leading-relaxed italic">
                {post.excerpt}
              </blockquote>
            </div>
          </div>

          {/* Content body */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Full content */}
            {post.content && (
              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-2">
                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-[15px] whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            )}

            {/* Divider with share / back strip */}
            <div className="px-6 sm:px-8 py-5 mt-4 border-t border-gray-100 flex items-center justify-between">
              <Link
                href={linkPrefix}
                className="text-sm text-gray-500 hover:text-[#1a8d1a] transition-colors flex items-center gap-2 group"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                Back to all posts
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mr-1">Share</span>
                <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all" title="Copy link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                </button>
                <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-sky-50 flex items-center justify-center text-gray-400 hover:text-sky-500 transition-all" title="Share on Twitter">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </button>
                <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all" title="Share on LinkedIn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Author bio card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mt-6">
            <div className="flex items-center gap-4">
              <span
                className={`w-12 h-12 rounded-xl ${post.authorAvatar ?? "bg-gradient-to-br from-emerald-400 to-emerald-600"} flex items-center justify-center text-sm font-bold text-white shadow-sm`}
              >
                {authorInitials(post.authorName)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">{post.authorName}</p>
                  <span className="text-[10px] font-semibold text-[#1a8d1a] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Author</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">TENUQ Team</p>
              </div>
            </div>
          </div>

          {/* Actions slot (admin buttons etc.) */}
          {actions}
        </article>

        {/* ── Right: Sidebar ── */}
        <aside className="w-full xl:w-[300px] 2xl:w-[340px] shrink-0 space-y-5">
          {/* Table of contents style info card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Post Info</h3>
            <dl className="space-y-3.5">
              <div className="flex items-center justify-between">
                <dt className="text-xs text-gray-400 flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  Published
                </dt>
                <dd className="text-xs font-medium text-gray-700">{fmtDate(post.publishedAt)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-gray-400 flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  Read time
                </dt>
                <dd className="text-xs font-medium text-gray-700">{post.readTime}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-gray-400 flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                  Category
                </dt>
                <dd className="text-xs font-semibold text-[#1a8d1a] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">{post.category}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-gray-400 flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  Author
                </dt>
                <dd className="text-xs font-medium text-gray-700">{post.authorName}</dd>
              </div>
            </dl>
          </div>

          {/* Recent posts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#1a8d1a]"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              More Posts
            </h3>
            <div className="space-y-1">
              {recentPosts.map((rp, idx) => (
                <Link
                  key={rp.slug}
                  href={`${linkPrefix}/${rp.slug}`}
                  className="flex items-start gap-3 px-2.5 py-3 rounded-xl hover:bg-gray-50 transition-all group"
                >
                  <span
                    className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-lg shadow-sm ring-1 ring-black/5 group-hover:shadow-md group-hover:scale-105 transition-all"
                    style={{ background: rp.coverGradient }}
                  >
                    {rp.coverIcon}
                  </span>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#1a8d1a] transition-colors">
                      {rp.title}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1.5">
                      <span>{fmtShortDate(rp.publishedAt)}</span>
                      {rp.readTime && (
                        <>
                          <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                          <span>{rp.readTime}</span>
                        </>
                      )}
                    </p>
                  </div>
                </Link>
              ))}
              {recentPosts.length === 0 && (
                <div className="text-center py-6">
                  <span className="text-2xl mb-2 block">📝</span>
                  <p className="text-xs text-gray-400">No other posts yet.</p>
                </div>
              )}
            </div>

            {/* View all link */}
            <Link
              href={linkPrefix}
              className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-all group"
            >
              View all posts
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
