"use client";

import { useState, type ReactNode } from "react";

export default function ContentTabs({
  blogSection,
  productsSection,
  postCount,
  productCount,
}: {
  blogSection: ReactNode;
  productsSection: ReactNode;
  postCount: number;
  productCount: number;
}) {
  const [tab, setTab] = useState<"blog" | "products">("blog");

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-full sm:w-fit">
        <button
          onClick={() => setTab("blog")}
          className={`flex-1 sm:flex-none text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            tab === "blog"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Blog Posts ({postCount})
        </button>
        <button
          onClick={() => setTab("products")}
          className={`flex-1 sm:flex-none text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            tab === "products"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Products ({productCount})
        </button>
      </div>

      {/* Content */}
      {tab === "blog" ? blogSection : productsSection}
    </div>
  );
}
