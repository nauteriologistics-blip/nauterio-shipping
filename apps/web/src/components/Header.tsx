"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Globe, LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import { LOCALE_COOKIE, SUPPORTED_LOCALES, type Locale } from "@/i18n/config";

export default function Header({ hasSession = false }: { hasSession?: boolean }) {
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
    { label: t("navTrack"), href: "/tracking" },
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
      className={`fixed left-0 top-0 z-50 w-full border-b transition-colors duration-200 ${
        isScrolled
          ? "border-slate-200 bg-white/95 py-3 backdrop-blur-md"
          : "border-slate-200 bg-white/95 py-4 backdrop-blur-md"
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
        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-transparent py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-[#d77718] hover:text-[#10233f]"
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
            className="flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#10233f]"
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span>{locale.toUpperCase()}</span>
          </button>

          {isPortal || hasSession ? (
            <>
              <Link href="/quote" className="rounded-md bg-[#d77718] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[#b95f0d]">
                {tPortal("newShipment")}
              </Link>
              {!isPortal && (
                <Link href="/portal" className="px-2 py-2 font-semibold text-slate-600 transition-colors hover:text-[#10233f]">
                  {t("portal")}
                </Link>
              )}
              <button
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className="flex items-center gap-1.5 px-2 py-2 font-semibold text-slate-600 transition-colors hover:text-[#10233f] disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                {signingOut ? t("signingOut") : t("signOut")}
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="px-2 py-2 font-semibold text-slate-600 transition-colors hover:text-[#10233f]">
                {t("signIn")}
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-[#d77718] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#b95f0d]"
              >
                {t("startShipping")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="p-2 text-gray-800 transition-colors hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={t("toggleMenu")}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 top-full flex w-full flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 lg:hidden">
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
            {isPortal || hasSession ? (
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
              href={isPortal || hasSession ? "/quote" : "/register"}
              className="mt-2 rounded-md bg-[#d77718] px-6 py-3 text-center font-semibold text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isPortal || hasSession ? tPortal("newShipment") : t("startShipping")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
