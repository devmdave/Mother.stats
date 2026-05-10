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
  description: "A cinematic analytics dashboard for mother.stats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark antialiased`}>
      <body className="bg-black text-white min-h-screen overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
