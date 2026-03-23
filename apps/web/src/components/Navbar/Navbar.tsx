"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/track", label: "Track Order" },
  { href: "/contact", label: "Contact" },
  { href: "/charities", label: "Charities" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-6 relative z-50">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-full px-5 sm:px-8 py-3.5 shadow-sm border border-gray-100/60 max-w-2xl w-full hover:shadow-md transition-shadow duration-300">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight group">
          <span className="w-7 h-7 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <svg width="22" height="24" viewBox="0 0 40 44" fill="none" className="text-gray-900 group-hover:text-[#1a8d1a] transition-colors duration-300">
              <path d="M5 4 L33 2 L35 31 L7 33 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
              <line x1="19" y1="3" x2="21" y2="32" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="18" x2="34" y2="16" stroke="currentColor" strokeWidth="2"/>
              <path d="M11 10 L16 9.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/>
              <path d="M13.5 9.9 L13.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/>
              <path d="M27 7 L27 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/>
              <path d="M27 11 L24 11.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/>
              <path d="M12 20 L12 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/>
              <path d="M12 22 L15 21.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/>
              <path d="M26 21 L26 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/>
              <path d="M24 23 L29 22.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" fill="none"/>
              <path d="M7 33 L35 31 L34 37 L6 39 Z" fill="currentColor"/>
              <path d="M5 4 L7 33 L6 39 L4 10 Z" fill="currentColor"/>
            </svg>
          </span>
          TENUQ
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-gray-500">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`hover:text-gray-900 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#1a8d1a] after:rounded-full after:transition-all after:duration-300 ${
                isActive(href)
                  ? "text-gray-900 after:w-full"
                  : "after:w-0 hover:after:w-full"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA - Desktop */}
        <Link
          href="/pricing"
          className="hidden md:inline-flex bg-gray-900 text-white rounded-full px-6 py-2 text-[13px] font-semibold hover:bg-[#1a8d1a] transition-all duration-300 shadow-sm hover:shadow-md"
        >
          Get Started
        </Link>

        {/* Hamburger - Mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-full hover:bg-gray-50 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-[4px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[4px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-4 right-4 sm:left-6 sm:right-6 mt-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/60 overflow-hidden transition-all duration-300 ${
          menuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-5 gap-0.5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3.5 text-sm font-medium rounded-xl transition-colors ${
                isActive(href)
                  ? "text-gray-900 bg-gray-50 border-l-2 border-[#1a8d1a]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-3 pt-4">
            <Link
              href="/pricing"
              className="block text-center bg-gray-900 text-white rounded-full px-5 py-3 text-sm font-semibold hover:bg-[#1a8d1a] transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
