import Link from "next/link";

export default function Products() {
  return (
    <section id="products" className="relative bg-white py-16 sm:py-24 lg:py-32">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-flex items-center gap-2 bg-[#f0f0f0] rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a8d1a] animate-pulse" />
            What we do
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3 sm:mb-4">
            Two things, done brilliantly
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-md mx-auto px-4 sm:px-0">
            We keep our focus narrow so you get depth, not breadth. Software consultancy and brand building — that&apos;s it.
          </p>
        </div>

        {/* Product Cards — 2 cards side-by-side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Card 1 — Software Consultancy */}
          <div className="group relative bg-[#fafafa] border border-gray-100 rounded-2xl p-5 sm:p-7 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a8d1a] to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-10 h-10 rounded-xl bg-[#1a8d1a]/10 flex items-center justify-center mb-5 group-hover:bg-[#1a8d1a] transition-colors duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
                <line x1="14" y1="4" x2="10" y2="20" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-2">Software Consultancy</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Technical strategy, architecture reviews, code audits, and fractional CTO guidance — helping you build the right thing, the right way.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-xs text-gray-500">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke="#1a8d1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Architecture & stack reviews
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-500">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke="#1a8d1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Code & security audits
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-500">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke="#1a8d1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Fractional CTO & team upskilling
              </li>
            </ul>
            <Link href="/services/software-consultancy" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-[#1a8d1a] transition-colors">
              Learn more
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Card 2 — Brand Building */}
          <div className="group relative bg-[#fafafa] border border-gray-100 rounded-2xl p-5 sm:p-7 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a8d1a] to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-10 h-10 rounded-xl bg-[#1a8d1a]/10 flex items-center justify-center mb-5 group-hover:bg-[#1a8d1a] transition-colors duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-2">Brand Building</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Compelling digital brands — from visual identity and messaging to high-performance websites — that help you stand out and scale.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-xs text-gray-500">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke="#1a8d1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Brand strategy & visual identity
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-500">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke="#1a8d1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Marketing website design & build
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-500">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke="#1a8d1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Content, copy & social kits
              </li>
            </ul>
            <Link href="/services/brand-building" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-[#1a8d1a] transition-colors">
              Learn more
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10 sm:mt-14">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#1a8d1a] transition-colors group"
          >
            View pricing
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
