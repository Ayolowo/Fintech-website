"use client";

import React from "react";
import AppStore from "../assets/store-buttons/appstore";
import GooglePlay from "../assets/store-buttons/googleplay";

interface AppStoreButtonsProps {
  className?: string;
}

const AppStoreButtons = ({ className = "" }: AppStoreButtonsProps) => {
  return (
    <div className={`flex flex-row gap-3 items-center justify-center ${className}`}>
      {/* App Store Button */}
      <a
        href="https://apps.apple.com/app/paybridge/id6749968512"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-80 transition-opacity"
      >
        <AppStore />
      </a>

      {/* Google Play Button */}
      <a
        href="https://play.google.com/store/apps/details?id=com.paybridge.PayBridge"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-80 transition-opacity"
      >
        <GooglePlay  />
      </a>
    </div>
  );
};

export default AppStoreButtons;
