import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Christian & Annanikka's Wedding — Save the Date",
  description:
    "12 December 2026 — Save the date. Share your details for your official invitation.",
  openGraph: {
    title: "Christian & Annanikka's Wedding — Save the Date",
    description: "12.12.2026 — We can’t wait to celebrate with you.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full scroll-smooth antialiased",
        inter.variable,
        playfair.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full bg-[#FAF7F2] font-sans text-[#2F2C28]">
        {children}
      </body>
    </html>
  );
}
