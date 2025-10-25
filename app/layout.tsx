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
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cosmos Tasks | Modern Task Management For Teams",
  description: "Streamline your workflow with our intuitive task management platform. Designed for modern teams who value clarity, focus, and results.",
  authors: [{ name: "Cosmos Tasks" }],
  openGraph: {
    title: "Cosmos Tasks | Modern Task Management For Teams",
    description: "Streamline your workflow with our intuitive task management platform. Designed for modern teams who value clarity, focus, and results.",
    type: "website",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cosmos_tasks",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
  verification: {
    google: "NxKt5OkRoxqKCxghTBI9aa7TzuaVLyuqkM6S2oNF8x0",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark-mode');
                  document.documentElement.classList.remove('light-mode');
                } else {
                  document.documentElement.classList.add('light-mode');
                  document.documentElement.classList.remove('dark-mode');
                }
              })();
            `,
          }}
        />
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
