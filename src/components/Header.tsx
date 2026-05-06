"use client";

import React, { useState } from "react";
import Logo from "../assets/light-logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const isBusinessPage = pathname === "/business";
  const isHeroPage = false; // cream background — always use dark nav text
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const textColor = isHeroPage ? "text-white" : "text-black";
  const mutedText = isHeroPage ? "text-white/70" : "text-gray-500";
  const hoverText = isHeroPage ? "hover:text-white" : "hover:text-black";
  const hamburgerColor = isHeroPage ? "text-white" : "text-black";
  const hamburgerHover = isHeroPage ? "hover:bg-white/10" : "hover:bg-black/10";

  return (
    <div className="absolute top-0 left-0 right-0 z-50 px-6 md:px-8 lg:px-14">
      <header className="max-w-7xl mx-auto py-5 flex items-center justify-between gap-4 relative">

        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Logo />
          <span className={`text-[22px] font-extrabold whitespace-nowrap ${textColor}`} style={{color: "#163300"}}>
            PayBridge
          </span>
        </a>

        {/* Center nav — absolutely centred in the header */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className="text-[17px] font-medium whitespace-nowrap px-4 py-2 rounded-full transition-colors hover:bg-[#9FE870]/30 hover:rounded-full"
            style={{color: "#163300"}}
          >
            Personal
          </Link>
          <Link
            href="/business"
            className="text-[17px] font-medium whitespace-nowrap px-4 py-2 rounded-full transition-colors hover:bg-[#9FE870]/30 hover:rounded-full"
            style={{color: "#163300"}}
          >
            Business
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isBusinessPage ? (
            <>
              <Link
                href="/business/login"
                className="hidden md:inline-flex px-4 py-2 rounded-full text-[17px] font-medium transition-colors whitespace-nowrap hover:bg-[#9FE870]/30 hover:rounded-full"
                style={{color: "#163300"}}
              >
                Log in
              </Link>
              <Link
                href="/business/register"
                className="hidden md:inline-flex px-5 py-2.5 rounded-full text-base font-bold transition-all whitespace-nowrap hover:opacity-90"
                style={{ backgroundColor: "#9FE870", color: "#163300" }}
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-flex px-4 py-2 rounded-full text-base font-medium transition-colors whitespace-nowrap hover:bg-[#9FE870]/30 hover:rounded-full"
                style={{color: "#163300"}}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="hidden md:inline-flex px-5 py-2.5 rounded-full text-base font-[600] transition-all whitespace-nowrap hover:opacity-90"
                style={{ backgroundColor: "#9FE870", color: "#163300" }}
              >
                Sign up
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${hamburgerHover}`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen
              ? <X className={`w-6 h-6 ${hamburgerColor}`} />
              : <Menu className={`w-6 h-6 ${hamburgerColor}`} />
            }
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden px-4 py-4 border-t flex flex-col gap-1"
          style={isHeroPage ? { backgroundColor: "#163300", borderColor: "rgba(255,255,255,0.1)" } : { backgroundColor: "white", borderColor: "#f3f4f6" }}
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${!isBusinessPage ? textColor : `${mutedText} ${hoverText}`}`}
          >
            Personal
          </Link>
          <Link
            href="/business"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isBusinessPage ? textColor : `${mutedText} ${hoverText}`}`}
          >
            Business
          </Link>
          {isBusinessPage ? (
            <>
              <Link
                href="/business/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium rounded-lg ${textColor}`}
              >
                Log in
              </Link>
              <Link
                href="/business/register"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 px-4 py-3 rounded-full text-sm font-bold text-center hover:opacity-90"
                style={{ backgroundColor: "#9FE870", color: "#163300" }}
              >
                Sign up
              </Link>
            </>
          ) : (
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 px-4 py-3 rounded-full text-sm font-bold text-center hover:opacity-90"
              style={{ backgroundColor: "#9FE870", color: "#163300" }}
            >
              Sign up
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
