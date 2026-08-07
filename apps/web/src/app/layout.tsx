import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nauterio Logistics | Shipping from Italy to the United States Made Clear",
  description: "Digital-first ocean & air freight platform specializing in courier, parcel, and commercial shipping from Italy to the USA with instant quotes, customs clearance, and end-to-end tracking.",
  keywords: ["Italy to USA shipping", "air freight Milan to JFK", "customs broker Italy US", "parcel shipping Italy to America", "Nauterio Logistics"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-800 pt-[80px]">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
