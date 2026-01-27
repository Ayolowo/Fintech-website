"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { X } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-16 px-4 md:px-8 bg-foreground text-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="h-10 w-10" variant="light" />
              <span className="text-2xl font-bold">PayBridge</span>
            </div>
            <p className="text-background/70 text-sm">
              Bridge money. Anywhere. Instantly.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <a href="https://twitter.com/paybridge" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <X size={20} />
              </a>
              <a href="https://linkedin.com/company/paybridgefinance" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://instagram.com/paybridge" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-background/70 hover:text-background text-sm transition-colors">
                  Personal
                </Link>
              </li>
              <li>
                <Link href="/business" className="text-background/70 hover:text-background text-sm transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-background/70 hover:text-background text-sm transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-background/70 hover:text-background text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-background/70 hover:text-background text-sm transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-background/70 hover:text-background text-sm transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-background/70 hover:text-background text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-background/70 hover:text-background text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-background/70 hover:text-background text-sm transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © 2026 PayBridge Inc. All rights reserved. Registration number: 10165448
            </p>
            <p className="text-background/60 text-sm">
              Made with care for global payments
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;