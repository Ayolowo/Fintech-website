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
  title: "PayBridge | Money Movement Made Easy",
  description: "Send and receive money instantly, globally, and securely with PayBridge.",
  openGraph: {
    title: "PayBridge | Money Movement Made Easy",
    description: "Send and receive money instantly, globally, and securely with PayBridge.",
    url: "https://paybridge.app",
  },
  verification: {
    google: "NxKt5OkRoxqKCxghTBI9aa7TzuaVLyuqkM6S2oNF8x0",
  },
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
