import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nauterio Logistics | Shipping from Italy to the United States Made Clear",
  description: "A logistics platform for planning Italy–USA air and ocean shipments, with reviewed estimates, customs preparation guidance and milestone visibility.",
  keywords: ["Italy to USA shipping", "air freight Milan to JFK", "customs broker Italy US", "parcel shipping Italy to America", "Nauterio Logistics"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-white text-gray-800 pt-[80px]">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
