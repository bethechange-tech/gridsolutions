/* ──────────────────────────────────────────────
 *  ServicePage — premium full-page layout
 *  Receives a Service object and renders a
 *  polished landing page for that service.
 *  Used by every /services/[slug] route.
 * ────────────────────────────────────────────── */

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Service } from "@/data/services";

/* ─── Scroll-reveal hook ──────────────────────
   Adds .revealed class to children when visible */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ─── Icon Map ────────────────────────────────
   Maps service.icon string → inline SVG        */
function ServiceIcon({ icon, size = 28 }: { icon: string; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "cloud":
      return (
        <svg {...props}>
          <path d="M17.5 19H9.5C6.46 19 4 16.54 4 13.5C4 10.89 5.84 8.71 8.3 8.14C9.21 5.71 11.56 4 14.32 4C17.75 4 20.53 6.78 20.53 10.22C20.53 10.52 20.51 10.82 20.47 11.11C21.42 11.86 22 13.03 22 14.33C22 16.91 19.91 19 17.33 19" />
          <path d="M12 13V19M12 13L15 16M12 13L9 16" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" />
          <path d="M9 12L11 14L15 10" />
        </svg>
      );
    case "chart":
      return (
        <svg {...props}>
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20V14" />
        </svg>
      );
    case "code":
      return (
        <svg {...props}>
          <path d="M8 3H5C3.9 3 3 3.9 3 5V8" />
          <path d="M16 3H19C20.1 3 21 3.9 21 5V8" />
          <path d="M21 16V19C21 20.1 20.1 21 19 21H16" />
          <path d="M3 16V19C3 20.1 3.9 21 5 21H8" />
          <path d="M8 12L11 15L16 9" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

/* ─── Feature Icons ───────────────────────────
   6 unique icons for feature cards              */
const featureIcons = [
  // Bolt / Lightning
  <svg key="bolt" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  // Shield
  <svg key="shield" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  // Layers
  <svg key="layers" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
  // Settings
  <svg key="settings" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  // Target
  <svg key="target" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  // Sparkles
  <svg key="sparkles" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L14.5 8.5L20 9.27L16 13.14L16.94 18.64L12 16L7.06 18.64L8 13.14L4 9.27L9.5 8.5L12 3Z" /></svg>,
];

export default function ServicePage({ service }: { service: Service }) {
  const wrapperRef = useReveal();

  return (
    <div ref={wrapperRef}>
      {/* ─── Breadcrumb ────────────────────── */}
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <ol className="flex items-center gap-1.5 text-xs text-gray-400">
          <li>
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              className="text-gray-300"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </li>
          <li>
            <Link href="/#products" className="hover:text-gray-600 transition-colors">
              Services
            </Link>
          </li>
          <li>
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              className="text-gray-300"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </li>
          <li className="text-gray-600 font-medium">{service.name}</li>
        </ol>
      </nav>

      {/* ─── Hero ──────────────────────────── */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 sm:pb-24">
        {/* Animated background grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #1a8d1a 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Gradient orbs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#1a8d1a]/[0.06] via-[#1a8d1a]/[0.02] to-transparent -translate-y-1/3 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#1a8d1a]/[0.04] to-transparent translate-y-1/3 -translate-x-1/4 blur-2xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Animated icon */}
          <div className="reveal inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1a8d1a]/15 to-[#1a8d1a]/5 text-[#1a8d1a] mb-7 ring-1 ring-[#1a8d1a]/10 shadow-lg shadow-[#1a8d1a]/5">
            <ServiceIcon icon={service.icon} size={34} />
          </div>

          <p className="reveal text-[#1a8d1a] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-4">
            {service.tagline}
          </p>
          <h1 className="reveal text-3xl sm:text-4xl lg:text-[3.5rem] lg:leading-[1.1] font-extrabold text-gray-900 mb-5">
            {service.name}
          </h1>
          <p className="reveal text-gray-500 max-w-2xl mx-auto text-sm sm:text-[15px] leading-relaxed mb-10">
            {service.longDescription}
          </p>

          <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/pricing"
              className="group relative bg-[#1a8d1a] text-white rounded-full px-9 py-4 text-sm font-bold hover:bg-[#157a15] transition-all duration-300 shadow-xl shadow-[#1a8d1a]/25 hover:shadow-2xl hover:shadow-[#1a8d1a]/30 hover:-translate-y-0.5"
            >
              {service.cta}
              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/contact"
              className="border border-gray-200 bg-white/60 backdrop-blur-sm text-gray-700 rounded-full px-9 py-4 text-sm font-semibold hover:border-gray-400 hover:text-gray-900 hover:-translate-y-0.5 transition-all duration-300"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────── */}
      <section className="reveal relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gray-900 rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl overflow-hidden relative">
            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {service.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`text-center ${i < service.stats.length - 1 ? "lg:border-r lg:border-white/10" : ""}`}
                >
                  <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1.5 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal">
            <span className="inline-flex items-center gap-2 bg-white text-[11px] font-bold text-[#1a8d1a] uppercase tracking-[0.15em] px-4 py-1.5 rounded-full border border-[#1a8d1a]/15 shadow-sm mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a8d1a] animate-pulse" />
              What&apos;s Included
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Each engagement is tailored to your goals. Here&apos;s what a typical package includes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {service.features.map((f, i) => (
              <div
                key={f.title}
                className="reveal group bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Hover gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a8d1a] to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1a8d1a]/10 text-[#1a8d1a] flex items-center justify-center shrink-0 group-hover:bg-[#1a8d1a] group-hover:text-white transition-colors duration-300">
                    {featureIcons[i % featureIcons.length]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1.5 text-[15px]">
                      {f.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Process ───────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal">
            <span className="inline-flex items-center gap-2 bg-[#f0f0f0] text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              Our Process
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
              How we work together
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              A proven six-step framework. Transparent milestones, no surprises.
            </p>
          </div>

          <div className="space-y-0">
            {service.process.map((step, i) => (
              <div key={i} className="reveal flex gap-5 sm:gap-6 group">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <div className="relative w-12 h-12 rounded-2xl bg-[#1a8d1a] text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-lg shadow-[#1a8d1a]/20 group-hover:scale-110 transition-transform duration-300">
                    {String(i + 1).padStart(2, "0")}
                    {/* Ping on first item */}
                    {i === 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
                    )}
                  </div>
                  {i < service.process.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-[#1a8d1a]/30 to-[#1a8d1a]/5 min-h-8" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-10 pt-1">
                  <p className="font-bold text-gray-900 text-[15px] mb-1">
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Technologies ──────────────────── */}
      <section className="py-16 sm:py-20 reveal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
            Technologies &amp; Tools
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {service.technologies.map((tech) => (
              <span
                key={tech}
                className="group relative px-5 py-2.5 rounded-full bg-white border border-gray-100 text-sm font-medium text-gray-600 hover:border-[#1a8d1a]/40 hover:text-[#1a8d1a] hover:shadow-md hover:shadow-[#1a8d1a]/5 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <span className="absolute inset-0 rounded-full bg-[#1a8d1a]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">{tech}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Social Proof Strip ──────────────── */}
      <section className="reveal pb-8 sm:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 rounded-2xl bg-white border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                    style={{
                      backgroundColor: ["#1a8d1a", "#16a34a", "#059669", "#0d9488"][i],
                    }}
                  >
                    {["JC", "OB", "ML", "KR"][i]}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900">Trusted by 50+ teams</p>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="#f59e0b"
                      stroke="none"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-[11px] text-gray-400 ml-1 font-medium">4.9/5</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-gray-100" />
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a8d1a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>SOC 2 &amp; ISO 27001 compliant processes</span>
            </div>
            <div className="hidden sm:block w-px h-10 bg-gray-100" />
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a8d1a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Enterprise-grade security</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────── */}
      <section className="reveal pb-16 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-3xl p-10 sm:p-14 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#1a8d1a]/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-[#1a8d1a]/5 blur-2xl" />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
            </div>
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#1a8d1a]/20 text-[#1a8d1a] flex items-center justify-center mx-auto mb-6">
                <ServiceIcon icon={service.icon} size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">
                Ready to get started?
              </h2>
              <p className="text-sm sm:text-[15px] text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed">
                Book a free discovery call or explore our pricing plans. No commitment, no pressure — just a conversation about what&apos;s possible.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/pricing"
                  className="group relative bg-[#1a8d1a] text-white rounded-full px-10 py-4 text-sm font-bold hover:bg-[#157a15] transition-all duration-300 shadow-xl shadow-[#1a8d1a]/30 hover:shadow-2xl hover:shadow-[#1a8d1a]/40 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">View Pricing</span>
                  <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/contact"
                  className="border border-white/15 bg-white/5 backdrop-blur-sm text-white rounded-full px-10 py-4 text-sm font-semibold hover:border-white/30 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
