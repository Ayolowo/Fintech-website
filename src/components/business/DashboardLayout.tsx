"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Shield,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/business/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/business/dashboard/transactions",
    label: "Transactions",
    icon: History,
  },
  { href: "/business/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData([
    "business-profile",
    user?.email?.address,
  ]) as any;

  // Get business initials (first letter of each word)
  const getBusinessInitials = (businessName: string) => {
    if (!businessName) return "P";
    return businessName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2); // Limit to 2 letters
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r">
        <div className="p-6 border-b">
          <Link href="/business/dashboard" className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#163300" }}
            >
              <span className="text-white font-bold text-lg">
                {getBusinessInitials(profile?.business_name)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-tight">PayBridge</span>
              {profile?.business_name && (
                <span className="text-sm text-gray-600 leading-tight mt-0.5">
                  {profile.business_name}
                </span>
              )}
            </div>
          </Link>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input type="search" placeholder="Search..." className="pl-10" />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive ? "text-white" : "text-gray-700 hover:bg-gray-100",
                )}
                style={
                  isActive
                    ? { backgroundColor: "#163300", color: "#9FE870" }
                    : {}
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white">
            <div className="p-6 border-b flex items-start justify-between">
              <Link href="/business/dashboard" className="flex items-start gap-3 flex-1">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#163300" }}
                >
                  <span className="text-white font-bold text-sm">
                    {getBusinessInitials(profile?.business_name)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl leading-tight">PayBridge</span>
                  {profile?.business_name && (
                    <span className="text-sm text-gray-600 leading-tight mt-0.5">
                      {profile.business_name}
                    </span>
                  )}
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10"
                />
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "text-white"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                    style={isActive ? { backgroundColor: "#163300" } : {}}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={logout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link
            href="/business/dashboard"
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-xl">PayBridge</span>
          </Link>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
