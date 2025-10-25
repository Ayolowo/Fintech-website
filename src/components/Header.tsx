"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or default to light mode
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  useEffect(() => {
    // Apply the theme to the document when it changes
    if (isDarkMode) {
      document.documentElement.classList.remove("light-mode");
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.documentElement.classList.add("light-mode");
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="sticky top-0 z-50 pt-8 px-4">
      <header className="w-full max-w-7xl mx-auto py-3 px-6 md:px-8 flex items-center justify-between">
        <a
          href="/"
          className="p-3 flex items-center gap-5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Logo isDarkMode={isDarkMode} className="h-12 w-12" />
          <span
            style={{
              fontSize: 24,
              fontFamily: "e-Ukraine-Bold",
            }}
            className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-balance text-foreground"
          >
            PayBridge
          </span>
        </a>

        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <div className="flex items-center gap-2 rounded-full px-3 py-2">
            <Moon
              size={18}
              className={`${
                isDarkMode ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <Switch
              checked={!isDarkMode}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-primary"
            />
            <Sun
              size={18}
              className={`${
                !isDarkMode ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div>
          {/* <div className="hidden md:block rounded-2xl">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted">Log in</Button>
          </div> */}
        </div>
      </header>
    </div>
  );
};

export default Header;
