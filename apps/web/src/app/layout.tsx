import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SESSION_COOKIE } from "@/lib/session";

export const metadata: Metadata = {
  title: "Nauterio Logistics | Italy-Based International Shipping",
  description: "Based in Italy, Nauterio coordinates international air, ocean, and parcel shipments between supported countries, with reviewed estimates, customs guidance, and milestone visibility.",
  keywords: ["Italy-based logistics", "international shipping", "air freight", "ocean freight", "parcel tracking", "customs guidance", "Nauterio Logistics"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const hasSession = (await cookies()).has(SESSION_COOKIE);

  return (
    <html lang={locale} className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-white text-gray-800 pt-[80px]">
        <NextIntlClientProvider>
          <Header hasSession={hasSession} />
          <main className="flex-grow">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
