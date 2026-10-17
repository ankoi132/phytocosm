import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PHYTOCOSM 3D // Plant Internal Anatomy & Organic Biology Laboratory",
  description:
    "Interactive 3D microscopic dissection, cellular organelle cytology, and organic plant biochemistry visualization engine. Explore plant tissues, chloroplasts, and vascular flow in real-time.",
  keywords: [
    "Three.js plant anatomy",
    "botany 3D",
    "plant cell organelles",
    "chloroplast 3D",
    "xylem phloem flow",
    "photosynthesis",
    "scientific visualization",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-[#030704] text-[#f0fdf4] selection:bg-emerald-500/30 selection:text-emerald-200 antialiased`}
      >
        <Suspense fallback={<div className="h-16 w-full glass-panel" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
