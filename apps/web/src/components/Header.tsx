"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Globe } from "lucide-react";

const NAV_ITEMS = [
  { label: "Services", href: "/services" },
  { label: "Quote", href: "/quote" },
  { label: "Track", href: "/tracking" },
  { label: "Customs", href: "/customs" },
  { label: "Business", href: "/business" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "IT">("EN");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white ${
        isScrolled ? "shadow-sm py-4 border-b border-gray-100" : "py-5 border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/nauterio-logo.png"
            alt="Nauterio Logistics"
            width={793}
            height={241}
            priority
            className="h-8 md:h-9 w-auto group-hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-gray-600 hover:text-[#081F3D] font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => setLang(lang === "EN" ? "IT" : "EN")}
            aria-label={lang === "EN" ? "Switch to Italian" : "Switch to English"}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#081F3D] font-medium transition-colors text-sm"
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span>{lang}</span>
          </button>

          <Link
            href="/portal"
            className="text-gray-600 hover:text-[#081F3D] font-medium transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/quote"
            className="bg-[#F28C18] hover:bg-[#d97c14] text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-gray-800 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-6 flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-gray-800 font-medium py-2 border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setLang(lang === "EN" ? "IT" : "EN")}
              className="flex items-center gap-2 text-gray-600 font-medium"
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              {lang === "EN" ? "EN / Passa a IT" : "IT / Switch to EN"}
            </button>
            <Link
              href="/portal"
              className="text-gray-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/quote"
              className="bg-[#F28C18] text-white text-center px-6 py-3 rounded-full font-medium mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
