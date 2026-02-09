"use client";

import React from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const isBusinessPage = pathname === "/business";

  return (
    <div className="px-4 md:px-20">
      <header className="w-full max-w-8xl mx-auto py-3 flex items-center justify-between gap-2">
        <a
          href="/"
          className="p-1 md:p-3 flex items-center gap-1 md:gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Logo className="h-8 w-8 md:h-12 md:w-12" />
          <span className="text-xl md:text-1xl lg:text-2xl font-extrabold text-black whitespace-nowrap">
            PayBridge
          </span>
        </a>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 md:gap-2 bg-muted/50 rounded-full p-1 flex-shrink-0">
          <Link
            href="/"
            className={`px-3 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
              !isBusinessPage
                ? "bg-foreground text-background"
                : "text-foreground hover:bg-muted"
            }`}
          >
            Personal
          </Link>
          <Link
            href="/business"
            className={`px-3 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
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
