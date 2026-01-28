import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../src/index.css";
import { Metadata } from "next";
import { ReactNode } from "react";
import ReactQueryProvider from "./providers";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: [ "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.paybridgefinance.com'),
  title: {
    default: "PayBridge - Send and Receive Money Internationally | Virtual USD Account",
    template: "%s | PayBridge"
  },
  description: "Send and receive money globally with PayBridge. Get your virtual USD account, exchange multiple currencies at competitive rates, and transfer to 140+ countries. Fast, secure international money transfers.",
  keywords: [
    "PayBridge",
    "PayBridge finance",
    "PayBridge money transfer",
    "international money transfer",
    "send money abroad",
    "virtual USD account",
    "currency exchange",
    "receive payments globally",
    "global payments",
    "cross-border payments",
    "money transfer app",
    "USD account",
    "multi-currency wallet",
    "withdraw to local currency",
    "freelancer payments",
    "remote work payments",
    "digital wallet",
    "fintech",
    "paybridgefinance.com"
  ],
  authors: [{ name: "PayBridge Inc.", url: "https://www.paybridgefinance.com" }],
  creator: "PayBridge Inc.",
  publisher: "PayBridge Inc.",
  applicationName: "PayBridge",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.paybridgefinance.com",
    title: "PayBridge - Send and Receive Money Internationally | Virtual USD Account",
    description: "Send and receive money globally with PayBridge. Get your virtual USD account, exchange currencies, and transfer to 140+ countries with competitive rates.",
    siteName: "PayBridge",
    images: [
      {
        url: "https://www.paybridgefinance.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "PayBridge - International Money Transfer",
        type: "image/png"
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@paybridge",
    title: "PayBridge - Send Money Internationally",
    description: "Virtual USD account, currency exchange, and global money transfers to 140+ countries.",
    images: ["https://www.paybridgefinance.com/og-image.png"],
    creator: "@paybridge",
  },
  verification: {
    google: "NxKt5OkRoxqKCxghTBI9aa7TzuaVLyuqkM6S2oNF8x0",
  },
  alternates: {
    canonical: "https://www.paybridgefinance.com",
  },
  category: 'finance',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.gpteng.co/gptengineer.js" type="module" async />
        <script src="https://cdn.lordicon.com/lordicon.js" async />
      </head>
      <body className={inter.className}>
        <ReactQueryProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
