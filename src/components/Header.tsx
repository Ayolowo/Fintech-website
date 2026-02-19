"use client";

import React, { useState } from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const isBusinessPage = pathname === "/business";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        <div className="flex items-center gap-3">
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

          {/* Business Buttons - Desktop */}
          {isBusinessPage && (
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <Link
                href="/business/register"
                className="px-6 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: "#9FE870", color: "#163300" }}
              >
                Sign Up
              </Link>
              <Link
                href="/business/login"
                className="px-6 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: "#163300" }}
              >
                Login
              </Link>
            </div>
          )}

          {/* Hamburger Menu - Mobile */}
          {isBusinessPage && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isBusinessPage && mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex flex-col gap-2">
            <Link
              href="/business/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-center transition-all hover:opacity-90"
              style={{ backgroundColor: "#9FE870", color: "#163300" }}
            >
              Sign Up
            </Link>
            <Link
              href="/business/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white text-center transition-all hover:opacity-90"
              style={{ backgroundColor: "#163300" }}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
