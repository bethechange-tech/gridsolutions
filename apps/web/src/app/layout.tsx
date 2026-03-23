import type { Metadata } from "next";
import { Inter, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TENUQ – Scalable Software Systems & Digital Platforms",
  description: "TENUQ is a technology company focused on designing and building scalable software systems, digital platforms, and modern infrastructure for growing businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-[#f0f0f0]`}
      >
        {/* Decorative green squares — top left (all pages) */}
        <div className="fixed top-10 left-6 sm:left-10 pointer-events-none hidden sm:block z-0">
          <div className="relative w-48 h-32">
            <div className="absolute top-0 left-0 w-3 h-3 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute top-0 left-5 w-3 h-3 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute top-6 left-10 w-3 h-3 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute top-12 left-3 w-2.5 h-2.5 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute top-4 left-16 w-2.5 h-2.5 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute top-14 left-14 w-3.5 h-3.5 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute top-20 left-6 w-3 h-3 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute top-10 left-20 w-2 h-2 bg-[#1a8d1a] rounded-sm" />
          </div>
        </div>

        {/* Decorative green squares — bottom right (all pages) */}
        <div className="fixed bottom-16 right-6 sm:right-10 pointer-events-none hidden sm:block z-0">
          <div className="relative w-48 h-32">
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute bottom-0 right-6 w-3 h-3 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute bottom-6 right-12 w-3 h-3 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute bottom-2 right-16 w-2.5 h-2.5 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute bottom-8 right-3 w-3 h-3 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute bottom-12 right-8 w-2.5 h-2.5 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute bottom-10 right-20 w-3 h-3 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute bottom-16 right-14 w-3.5 h-3.5 bg-[#1a8d1a] rounded-sm" />
            <div className="absolute bottom-4 right-24 w-2 h-2 bg-[#1a8d1a] rounded-sm" />
          </div>
        </div>

        <div className="relative z-10">
          <Navbar />
          <main>{children}</main>
          {/* Global Footer */}
          <footer className="border-t border-gray-200/60 bg-white/40 backdrop-blur-sm mt-0">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
                {/* Brand */}
                <div className="col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 font-bold text-lg tracking-tight mb-3">
                    <span className="w-7 h-7 flex items-center justify-center shrink-0">
                      <svg width="22" height="24" viewBox="0 0 40 44" fill="none" className="text-gray-900"><path d="M5 4 L33 2 L35 31 L7 33 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/><line x1="19" y1="3" x2="21" y2="32" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="18" x2="34" y2="16" stroke="currentColor" strokeWidth="2"/><path d="M11 10 L16 9.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/><path d="M13.5 9.9 L13.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/><path d="M27 7 L27 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/><path d="M27 11 L24 11.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/><path d="M12 20 L12 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/><path d="M12 22 L15 21.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/><path d="M26 21 L26 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/><path d="M24 23 L29 22.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/><path d="M7 33 L35 31 L34 37 L6 39 Z" fill="currentColor"/><path d="M5 4 L7 33 L6 39 L4 10 Z" fill="currentColor"/></svg>
                    </span>
                    TENUQ
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                    Software consultancy and brand building for founders and growing teams.
                  </p>
                </div>
                {/* Services */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Services</p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li><a href="/services/software-consultancy" className="hover:text-[#1a8d1a] transition-colors">Software Consultancy</a></li>
                    <li><a href="/services/brand-building" className="hover:text-[#1a8d1a] transition-colors">Brand Building</a></li>
                  </ul>
                </div>
                {/* Company */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Company</p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li><a href="/pricing" className="hover:text-[#1a8d1a] transition-colors">Pricing</a></li>
                    <li><a href="/blog" className="hover:text-[#1a8d1a] transition-colors">Blog</a></li>
                    <li><a href="/contact" className="hover:text-[#1a8d1a] transition-colors">Contact</a></li>
                    <li><a href="/track" className="hover:text-[#1a8d1a] transition-colors">Track Order</a></li>
                  </ul>
                </div>
                {/* Legal */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Legal</p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li><span className="cursor-default">Privacy Policy</span></li>
                    <li><span className="cursor-default">Terms of Service</span></li>
                    <li><span className="cursor-default">Cookie Policy</span></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-gray-400">
                  &copy; 2024 BruceWayne Group. All rights reserved.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    SOC 2 Compliant
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    ISO 27001
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
