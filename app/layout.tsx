import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthObserver from "@/components/auth/AuthObserver";
import Navbar from "@/components/layouts/Navbar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layouts/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiny Logue",
  description: "Build your English, one logue at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthObserver />
        <Navbar />
        {children}
        <Footer />
        <Toaster
          position="top-center"
          richColors
          duration={3000}
          closeButton={false}
        />
      </body>
    </html>
  );
}
