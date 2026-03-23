import Link from "next/link";
import TopBar from "@/components/TopBar";
import { getBlogPosts, getProducts, fmtGBP, fmtDate } from "@/lib/data";
import {
  deleteBlogPost,
  toggleBlogFeatured,
  toggleProductPopular,
} from "@/lib/actions";
import DeleteProductButton from "./DeleteProductButton";
import ContentTabs from "./ContentTabs";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const [posts, products] = await Promise.all([getBlogPosts(), getProducts()]);

  return (
    <>
      <TopBar title="Content" />
      <div className="p-4 sm:p-6">
        <ContentTabs
          blogSection={<BlogSection posts={posts} />}
          productsSection={<ProductsSection products={products} />}
          postCount={posts.length}
          productCount={products.length}
        />
      </div>
    </>
  );
}

/* ── Blog posts table ── */

function BlogSection({ posts }: { posts: Awaited<ReturnType<typeof getBlogPosts>> }) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <span className="text-3xl mb-3 block">📝</span>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No blog posts yet</h3>
        <p className="text-sm text-gray-500">Blog posts will appear here once created.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* List header */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_100px_100px_90px] xl:grid-cols-[1fr_110px_120px_100px_90px] gap-2 px-4 xl:px-5 py-2.5 border-b border-gray-100 bg-gray-50/60">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Post</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden xl:block">Author</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Published</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {posts.map((p) => (
          <div
            key={p.id}
            className="group hover:bg-gray-50/60 transition-colors"
          >
            {/* Row layout: responsive grid */}
            <div className="px-4 xl:px-5 py-3.5 sm:grid sm:grid-cols-[1fr_100px_100px_90px] xl:grid-cols-[1fr_110px_120px_100px_90px] sm:items-center gap-2">
              {/* Title + icon + featured badge */}
              <div className="flex items-center gap-3 min-w-0 mb-2 sm:mb-0">
                <span className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 group-hover:shadow-sm transition-all">
                  {p.coverIcon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <Link
                      href={`/content/${p.slug}`}
                      className="text-sm font-semibold text-gray-900 truncate hover:text-[#1a8d1a] transition-colors"
                    >
                      {p.title}
                    </Link>
                    {p.featured && (
                      <span className="shrink-0 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">
                        ★
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{p.slug}</p>
                </div>
              </div>

              {/* Category */}
              <div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium whitespace-nowrap">
                  {p.category}
                </span>
              </div>

              {/* Author (xl+ only) */}
              <div className="hidden xl:block">
                <p className="text-xs text-gray-500 truncate">{p.authorName}</p>
              </div>

              {/* Published */}
              <div>
                <p className="text-[11px] text-gray-400 whitespace-nowrap">{fmtDate(p.publishedAt)}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1.5 mt-2 sm:mt-0">
                <form
                  action={async () => {
                    "use server";
                    await toggleBlogFeatured(p.id, !p.featured);
                  }}
                >
                  <button
                    type="submit"
                    className={`text-[11px] px-2 py-1 rounded-md border font-medium transition-all ${
                      p.featured
                        ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                        : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600"
                    }`}
                    title={p.featured ? "Remove featured" : "Mark as featured"}
                  >
                    {p.featured ? "★" : "☆"}
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteBlogPost(p.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-[11px] px-2 py-1 rounded-md border border-transparent text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
                    title="Delete post"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </form>
              </div>
            </div>

            {/* Mobile-only meta row (below sm) */}
            <div className="sm:hidden flex flex-wrap items-center gap-2 px-4 pb-3 -mt-1">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
                {p.category}
              </span>
              <span className="text-[11px] text-gray-400">{p.authorName}</span>
              <span className="text-[11px] text-gray-400">{fmtDate(p.publishedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Product cards grid ── */

function ProductsSection({ products }: { products: Awaited<ReturnType<typeof getProducts>> }) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <span className="text-3xl mb-3 block">📦</span>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No products yet</h3>
        <p className="text-sm text-gray-500">Products will appear here once added.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((p) => (
        <div
          key={p.id}
          className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 p-5 flex flex-col transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0 flex-1 mr-2">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{p.name}</h3>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">{p.subtitle}</p>
            </div>
            <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100 font-medium capitalize">
              {p.category}
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
            {p.description}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-4 bg-gray-50/60 rounded-xl p-3 border border-gray-50">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Base</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">
                {fmtGBP(p.basePrice)}
              </p>
              <p className="text-[10px] text-gray-400">/{p.billingCycle}</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Consult</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">
                {fmtGBP(p.consultationPrice)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Orders</p>
              <p className="text-sm font-bold text-[#1a8d1a] mt-0.5">
                {p._count.orders}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {p.features.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium"
              >
                {f}
              </span>
            ))}
            {p.features.length > 3 && (
              <span className="text-[10px] text-gray-400 self-center">
                +{p.features.length - 3} more
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
            <form
              action={async () => {
                "use server";
                await toggleProductPopular(p.id, !p.popular);
              }}
            >
              <button
                className={`text-[11px] px-2.5 py-1 rounded-md border font-medium transition-all ${
                  p.popular
                    ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                    : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600"
                }`}
              >
                {p.popular ? "★ Popular" : "☆ Mark Popular"}
              </button>
            </form>
            <DeleteProductButton
              id={p.id}
              hasOrders={p._count.orders > 0}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
