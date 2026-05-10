import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond, Syne, Instrument_Serif } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
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
    <html lang="en" className={`${outfit.variable} ${cormorant.variable} ${syne.variable} ${instrumentSerif.variable} dark antialiased`}>
      <body className="bg-[#070707] text-[#F6EDEE] min-h-screen overflow-x-hidden selection:bg-[#D4A5A5]/20 selection:text-[#F6EDEE]">
        {children}
      </body>
    </html>
  );
}
