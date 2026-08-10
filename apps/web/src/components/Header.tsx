"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Globe, LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import { LOCALE_COOKIE, SUPPORTED_LOCALES, type Locale } from "@/i18n/config";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("Header");
  const isPortal = pathname?.startsWith("/portal") ?? false;

  const MARKETING_NAV_ITEMS = [
    { label: t("navServices"), href: "/services" },
    { label: t("navQuote"), href: "/quote" },
    { label: t("navTrack"), href: "/tracking" },
    { label: t("navCustoms"), href: "/customs" },
    { label: t("navBusiness"), href: "/business" },
  ];

  // Spec 8.1: "Logged-in portal navigation replaces marketing navigation
  // with Dashboard, Shipments, Quotes, Pickups, Payments, Documents, Claims
  // and Support." Payments/Claims/Support don't have their own portal
  // routes yet (see docs/audit/FRONTEND_UX_GAPS.md) - included as-is so the
  // nav matches spec even where the destination is still the dashboard's
  // matching section.
  const PORTAL_NAV_ITEMS = [
    { label: t("navPortalDashboard"), href: "/portal" },
    { label: t("navPortalShipments"), href: "/portal#shipments" },
    { label: t("navPortalQuotes"), href: "/portal#quotes" },
    { label: t("navPortalDocuments"), href: "/portal#documents" },
  ];

  const navItems = isPortal ? PORTAL_NAV_ITEMS : MARKETING_NAV_ITEMS;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function switchLocale() {
    const next: Locale = locale === "en" ? "it" : "en";
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
    // Server Components (every page here, plus this Header itself via the
    // RootLayout's getLocale() call) only re-read the cookie on the next
    // render - router.refresh() re-runs them against the new cookie value
    // without a full page reload.
    router.refresh();
  }

  async function handleSignOut() {
    setSigningOut(true);
    await logout();
    router.push("/signin");
    router.refresh();
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white ${
        isScrolled ? "shadow-sm py-4 border-b border-gray-100" : "py-5 border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href={isPortal ? "/portal" : "/"} className="flex items-center group">
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
          {navItems.map((item) => (
            <Link
              key={item.href}
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
            onClick={switchLocale}
            aria-label={locale === "en" ? t("switchToItalian") : t("switchToEnglish")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#081F3D] font-medium transition-colors text-sm"
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span>{locale.toUpperCase()}</span>
          </button>

          {isPortal ? (
            <button
              onClick={() => void handleSignOut()}
              disabled={signingOut}
              className="flex items-center gap-1.5 text-gray-600 hover:text-[#081F3D] font-medium transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              {signingOut ? t("signingOut") : t("signOut")}
            </button>
          ) : (
            <>
              <Link href="/signin" className="text-gray-600 hover:text-[#081F3D] font-medium transition-colors">
                {t("signIn")}
              </Link>
              <Link
                href="/quote"
                className="bg-[#F28C18] hover:bg-[#d97c14] text-white px-8 py-3 rounded-full font-medium transition-colors"
              >
                {t("getQuote")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-gray-800 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={t("toggleMenu")}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-800 font-medium py-2 border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-gray-100">
            <button onClick={switchLocale} className="flex items-center gap-2 text-gray-600 font-medium">
              <Globe className="w-4 h-4" aria-hidden="true" />
              {SUPPORTED_LOCALES.map((l) => l.toUpperCase()).join(" / ")}
              <span className="text-gray-400">({locale.toUpperCase()})</span>
            </button>
            {isPortal ? (
              <button
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className="flex items-center gap-2 text-gray-600 font-medium disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                {signingOut ? t("signingOut") : t("signOut")}
              </button>
            ) : (
              <Link
                href="/signin"
                className="text-gray-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("signIn")}
              </Link>
            )}
            <Link
              href="/quote"
              className="bg-[#F28C18] text-white text-center px-6 py-3 rounded-full font-medium mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("getQuote")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
