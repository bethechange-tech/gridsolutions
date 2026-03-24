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
  post: PostData;
  recentPosts: RecentPost[];
  breadcrumbs: { label: string; href?: string }[];
  linkPrefix: string;
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

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ─── Icons (inline SVGs) ─────────────────── */

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);
const TagIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
);
const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const ArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
);
const LinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
);
const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);
const LinkedInIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
);
const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a8d1a]"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
);
const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);

/* ─── Component ────────────────────────────── */

export function PostDetailView({
  post,
  recentPosts,
  breadcrumbs,
  linkPrefix,
  actions,
}: PostDetailProps): JSX.Element {
  return (
    <div className="space-y-6">
      {/* ═══ Hero banner ═══ */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: post.coverGradient }} />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)", backgroundSize: "20px 20px" }}
        />
        {/* Strong dark overlay — guarantees white text is always readable */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.80), rgba(0,0,0,0.60), rgba(0,0,0,0.50))" }} />

        {/* Icon watermark */}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] text-[80px] sm:text-[120px] lg:text-[140px] opacity-[0.1] select-none pointer-events-none">
          {post.coverIcon}
        </span>

        {/* Content */}
        <div className="relative z-10 px-5 sm:px-8 lg:px-10 pt-6 sm:pt-10 pb-8 sm:pb-12">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm mb-4 sm:mb-6">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-white/40">›</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="text-white/60 hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/90 font-medium truncate max-w-[180px] sm:max-w-[280px]">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* Category pill */}
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full mb-4 sm:mb-5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a8d1a]" />
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight max-w-3xl">
            {post.title}
          </h1>

          {/* Author & meta */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-white shadow-lg ring-2 ring-white/20 shrink-0">
              {initials(post.authorName)}
            </span>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{post.authorName}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-white/80 text-[11px] sm:text-xs mt-0.5">
                <span>{fmtDate(post.publishedAt)}</span>
                <span className="w-1 h-1 rounded-full bg-white/50 hidden sm:block" />
                <span className="flex items-center gap-1">
                  <ClockIcon />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Mobile: Post meta strip (shown below hero on small screens) ═══ */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-2.5">
          <CalendarIcon />
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wide">Published</p>
            <p className="text-xs font-semibold text-gray-800">{fmtDate(post.publishedAt)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-2.5">
          <ClockIcon />
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wide">Read time</p>
            <p className="text-xs font-semibold text-gray-800">{post.readTime}</p>
          </div>
        </div>
      </div>

      {/* ═══ Main layout: article + sidebar ═══ */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left: Article ── */}
        <article className="flex-1 min-w-0 space-y-5">
          {/* Excerpt callout */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex gap-3 sm:gap-4">
              <div className="w-1 shrink-0 rounded-full bg-gradient-to-b from-[#1a8d1a] to-emerald-300" />
              <blockquote className="text-sm sm:text-[15px] text-black leading-relaxed italic">
                {post.excerpt}
              </blockquote>
            </div>
          </div>

          {/* Content body */}
          {post.content && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
                <div className="max-w-none text-black leading-relaxed text-sm sm:text-[15px] whitespace-pre-wrap break-words">
                  {post.content}
                </div>
              </div>
            </div>
          )}

          {/* Bottom bar: back + share */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <Link
              href={linkPrefix}
              className="text-sm text-gray-500 hover:text-[#1a8d1a] transition-colors flex items-center gap-2 group"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform"><ArrowLeft /></span>
              Back to all posts
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mr-1 hidden sm:inline">Share</span>
              <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all" title="Copy link">
                <LinkIcon />
              </button>
              <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-sky-50 flex items-center justify-center text-gray-400 hover:text-sky-500 transition-all" title="Share on X">
                <XIcon />
              </button>
              <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all" title="Share on LinkedIn">
                <LinkedInIcon />
              </button>
            </div>
          </div>

          {/* Author card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0">
                {initials(post.authorName)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">{post.authorName}</p>
                  <span className="text-[10px] font-semibold text-[#1a8d1a] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Author</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">TENUQ Team</p>
              </div>
            </div>
          </div>

          {/* Actions slot */}
          {actions}
        </article>

        {/* ── Right: Sidebar ── */}
        <aside className="w-full lg:w-[260px] xl:w-[300px] shrink-0 space-y-5">
          {/* Post info card (hidden on mobile — shown as strip above) */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Post Info</h3>
            <dl className="space-y-3">
              {[
                { icon: <CalendarIcon />, label: "Published", value: fmtDate(post.publishedAt) },
                { icon: <ClockIcon />, label: "Read time", value: post.readTime },
                { icon: <UserIcon />, label: "Author", value: post.authorName },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <dt className="text-xs text-gray-400 flex items-center gap-1.5">
                    {item.icon}
                    {item.label}
                  </dt>
                  <dd className="text-xs font-medium text-gray-700 truncate ml-2 max-w-[140px] text-right">{item.value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <dt className="text-xs text-gray-400 flex items-center gap-1.5">
                  <TagIcon />
                  Category
                </dt>
                <dd className="text-[11px] font-semibold text-[#1a8d1a] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">{post.category}</dd>
              </div>
            </dl>
          </div>

          {/* Recent posts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:sticky lg:top-20">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookIcon />
              More Posts
            </h3>

            {recentPosts.length === 0 ? (
              <div className="text-center py-6">
                <span className="text-2xl mb-2 block">📝</span>
                <p className="text-xs text-gray-400">No other posts yet.</p>
              </div>
            ) : (
              <>
                {/* Horizontal scroll on mobile, vertical list on lg+ */}
                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-1 px-1 snap-x snap-mandatory lg:snap-none">
                  {recentPosts.map((rp) => (
                    <Link
                      key={rp.slug}
                      href={`${linkPrefix}/${rp.slug}`}
                      className="flex-shrink-0 w-[200px] sm:w-[220px] lg:w-auto flex lg:flex-row items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-all group snap-start"
                    >
                      <span
                        className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-base shadow-sm ring-1 ring-black/5 group-hover:shadow-md group-hover:scale-105 transition-all"
                        style={{ background: rp.coverGradient }}
                      >
                        {rp.coverIcon}
                      </span>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#1a8d1a] transition-colors">
                          {rp.title}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1.5">
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
                </div>

                <Link
                  href={linkPrefix}
                  className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-all group"
                >
                  View all posts
                  <ChevronRight />
                </Link>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
