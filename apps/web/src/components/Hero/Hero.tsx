import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle radial gradient behind hero */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-b from-[#1a8d1a]/[0.04] to-transparent blur-3xl" />
      </div>

      <div className="flex flex-col items-center text-center pt-14 sm:pt-20 lg:pt-28 pb-20 sm:pb-28 lg:pb-36 px-5 sm:px-8 relative z-10">
        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-10">
          <span className="flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#1a8d1a] sm:w-4 sm:h-4">
              <path d="M3 3L7 1L11 3V8L7 10L3 8V3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M7 10V15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M3 8L1 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M11 8L13 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Software Consultancy
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#1a8d1a] sm:w-4 sm:h-4">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 5V8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Brand Building
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 max-w-xs sm:max-w-lg md:max-w-2xl leading-[1.1] sm:leading-[1.1] mb-4 sm:mb-6">
          Software consultancy &{" "}
          <span className="relative">
            brand{" "}
            <span className="text-[#1a8d1a] relative inline-block">
              building
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0 7 Q25 0, 50 4 T100 2" stroke="#1a8d1a" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.3" />
              </svg>
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-10 sm:mb-14 lg:mb-16 max-w-sm sm:max-w-md md:max-w-lg px-2">
          Technical strategy, architecture guidance, and compelling brand identities — for founders and growing teams.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-xs sm:max-w-2xl lg:max-w-3xl w-full mb-10 sm:mb-14 lg:mb-16">
          <div className="group flex flex-col items-center text-center px-4 sm:px-5 py-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100/60 hover:shadow-lg hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300">
            <div className="mb-3 w-11 h-11 rounded-xl bg-[#1a8d1a]/10 flex items-center justify-center group-hover:bg-[#1a8d1a] transition-colors duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#1a8d1a] group-hover:text-white transition-colors duration-300">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8V12L15 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Technical Strategy</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Architecture reviews, stack selection, and fractional CTO guidance
            </p>
          </div>

          <div className="group flex flex-col items-center text-center px-4 sm:px-5 py-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100/60 hover:shadow-lg hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300">
            <div className="mb-3 w-11 h-11 rounded-xl bg-[#1a8d1a]/10 flex items-center justify-center group-hover:bg-[#1a8d1a] transition-colors duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#1a8d1a] group-hover:text-white transition-colors duration-300">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Brand Identity</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Visual identity, messaging, and web presence that converts
            </p>
          </div>

          <div className="group flex flex-col items-center text-center px-4 sm:px-5 py-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100/60 hover:shadow-lg hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300">
            <div className="mb-3 w-11 h-11 rounded-xl bg-[#1a8d1a]/10 flex items-center justify-center group-hover:bg-[#1a8d1a] transition-colors duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#1a8d1a] group-hover:text-white transition-colors duration-300">
                <path d="M22 12C22 17.5228 17.5228 22 12 22C10.4003 22 8.88837 21.6244 7.54753 20.9565L2 22L3.04348 16.4525C2.37565 15.1116 2 13.5997 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12H8.01" strokeLinecap="round" />
                <path d="M12 12H12.01" strokeLinecap="round" />
                <path d="M16 12H16.01" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Founder-Friendly</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Work directly with senior consultants — no agencies, no middlemen
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/pricing"
            className="group relative bg-[#1a8d1a] text-white rounded-full px-8 py-3.5 text-sm font-bold hover:bg-[#157a15] transition-all duration-300 w-full sm:w-auto text-center shadow-xl shadow-[#1a8d1a]/20 hover:shadow-2xl hover:shadow-[#1a8d1a]/30 hover:-translate-y-0.5"
          >
            <span className="relative z-10">Book a Consultation</span>
            <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            href="/#products"
            className="border border-gray-200 bg-white/60 backdrop-blur-sm text-gray-700 rounded-full px-8 py-3.5 text-sm font-semibold hover:border-gray-400 hover:text-gray-900 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Learn More
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-gray-400 font-medium">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            40+ Companies Advised
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            60+ Brands Launched
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            92% Client Retention
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            4.9/5 Rating
          </div>
        </div>
      </div>

      {/* Wave / curve decoration */}
      <div className="absolute bottom-6 sm:bottom-12 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path
            d="M0 120C240 40 480 0 720 40C960 80 1200 40 1440 120"
            stroke="#e5e5e5"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
    </section>
  );
}
