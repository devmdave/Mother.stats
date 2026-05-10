import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mother.stats | Quantifying invisible love",
  description: "A premium emotional data experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark antialiased`}>
      <body className="bg-[#070707] text-[#F6EDEE] min-h-screen overflow-x-hidden selection:bg-[#D4A5A5]/20 selection:text-[#F6EDEE]">
        {children}
      </body>
    </html>
  );
}
