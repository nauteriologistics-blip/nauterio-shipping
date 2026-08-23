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
  const tPortal = useTranslations("Portal");
  const isPortal = pathname?.startsWith("/portal") ?? false;
  const [unreadCount, setUnreadCount] = useState(0);

  const MARKETING_NAV_ITEMS = [
    { label: t("navServices"), href: "/services" },
    { label: t("navQuote"), href: "/quote" },
    { label: t("navTrack"), href: "/tracking" },
    { label: t("navBusiness"), href: "/business" },
    { label: t("navContact"), href: "/business#contact" },
  ];

  // The launch MVP exposes only routes that are operational. Dedicated
  // shipment/request screens join this list when their implementation lands.
  const PORTAL_NAV_ITEMS = [
    { label: t("navPortalDashboard"), href: "/portal" },
    { label: t("navPortalDocuments"), href: "/portal/documents" },
    { label: "Support", href: "/portal/support" },
    { label: unreadCount > 0 ? `${t("navPortalNotifications")} (${unreadCount})` : t("navPortalNotifications"), href: "/portal/notifications" },
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

  useEffect(() => {
    if (!isPortal) return;
    const refreshUnread = () => {
      fetch("/api/v1/me/notifications/unread-count", { cache: "no-store" })
        .then((response) => response.ok ? response.json() as Promise<{ count: number }> : null)
        .then((result) => setUnreadCount(result?.count ?? 0))
        .catch(() => setUnreadCount(0));
    };
    refreshUnread();
    window.addEventListener("nauterio:notifications-changed", refreshUnread);
    return () => window.removeEventListener("nauterio:notifications-changed", refreshUnread);
  }, [isPortal, pathname]);

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
      className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "border-slate-200/80 bg-white/90 py-3 shadow-sm shadow-slate-200/60 backdrop-blur-xl"
          : "border-transparent bg-white/80 py-5 backdrop-blur-xl"
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
        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/80 p-1 shadow-sm lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#081F3D]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={switchLocale}
            aria-label={locale === "en" ? t("switchToItalian") : t("switchToEnglish")}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-[#081F3D]"
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span>{locale.toUpperCase()}</span>
          </button>

          {isPortal ? (
            <>
              <Link href="/quote" className="rounded-full bg-[#F28C18] px-6 py-2.5 font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#d97c14]">
                {tPortal("newShipment")}
              </Link>
              <button
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#081F3D] disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                {signingOut ? t("signingOut") : t("signOut")}
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="rounded-full px-3 py-2 font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#081F3D]">
                {t("signIn")}
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#F28C18] px-8 py-3 font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#d97c14]"
              >
                {t("startShipping")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="rounded-full p-2 text-gray-800 transition-colors hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={t("toggleMenu")}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 top-full flex w-full flex-col gap-4 border-b border-gray-100 bg-white px-6 py-4 shadow-lg lg:hidden">
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
              href={isPortal ? "/quote" : "/register"}
              className="bg-[#F28C18] text-white text-center px-6 py-3 rounded-full font-medium mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isPortal ? tPortal("newShipment") : t("startShipping")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
