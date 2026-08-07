import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nauterio Staff Admin",
  description: "Internal operations console - Nauterio Logistics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
