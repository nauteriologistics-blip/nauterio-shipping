import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportWidget from "@/components/SupportWidget";
import { SESSION_COOKIE } from "@/lib/session";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

async function hasValidSession(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    const response = await fetch(`${apiOrigin}/v1/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export const metadata: Metadata = {
  metadataBase: new URL("https://nauteriologistics.com"),
  title: { default: "Nauterio Logistics | International Freight from Italy", template: "%s | Nauterio Logistics" },
  description: "Nauterio plans international air and ocean shipments from its operations base in Italy, with route checks, document preparation and shipment tracking.",
  keywords: ["Italy-based logistics", "international shipping", "air freight", "ocean freight", "parcel tracking", "customs guidance", "Nauterio Logistics"],
  openGraph: {
    type: "website",
    url: "https://nauteriologistics.com",
    siteName: "Nauterio Logistics",
    title: "Nauterio Logistics | International Freight from Italy",
    description: "Plan international air and ocean shipments from Italy and follow each recorded milestone.",
  },
  twitter: { card: "summary", title: "Nauterio Logistics", description: "International freight planning and tracking from Italy." },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, messages, hasSession] = await Promise.all([getLocale(), getMessages(), hasValidSession()]);

  return (
    <html lang={locale} className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-white text-gray-800 pt-[80px]">
        <NextIntlClientProvider messages={messages}>
          <Header hasSession={hasSession} />
          <main className="flex-grow">{children}</main>
          <Footer />
          <SupportWidget hasSession={hasSession} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
