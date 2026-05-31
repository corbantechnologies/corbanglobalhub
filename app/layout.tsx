"use client";

import "./globals.css";

import NextAuthProvider from "@/providers/NextAuthProvider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>
          Corban Global Hub | Corban Technologies LTD
        </title>
        <meta
          name="description"
          content="Corban Global Hub - the central platform for all Corban Technologies LTD software solutions, SaaS products, APIs, AI services, and enterprise applications."
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 selection:bg-corporate-primary selection:text-white antialiased`}>
        <Toaster position="top-center" />
        <NextAuthProvider>
          <TanstackQueryProvider>

            <main className="relative">{children}</main>

          </TanstackQueryProvider>
        </NextAuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
