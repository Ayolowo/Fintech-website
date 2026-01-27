"use client";

import React from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const isBusinessPage = pathname === "/business";

  return (
    <div className="bg-background px-4 md:px-8">
      <header className="w-full max-w-8xl mx-auto py-3 flex items-center justify-between">
        <a
          href="/"
          className="p-3 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Logo className="h-12 w-12" />
          <span
            style={{
              fontSize: 32,
            }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-black"
          >
            PayBridge
          </span>
        </a>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 bg-muted/50 rounded-full p-1">
          <Link
            href="/"
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              !isBusinessPage
                ? "bg-foreground text-background"
                : "text-foreground hover:bg-muted"
            }`}
          >
            Personal
          </Link>
          <Link
            href="/business"
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              isBusinessPage
                ? "bg-foreground text-background"
                : "text-foreground hover:bg-muted"
            }`}
          >
            Business
          </Link>
        </nav>
      </header>
    </div>
  );
};

export default Header;
