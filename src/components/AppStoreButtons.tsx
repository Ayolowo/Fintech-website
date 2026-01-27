"use client";

import React from "react";
import Image from "next/image";

interface AppStoreButtonsProps {
  className?: string;
}

const AppStoreButtons = ({ className = "" }: AppStoreButtonsProps) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 items-center ${className}`}>
      {/* App Store Button */}
      <a
        href="https://apps.apple.com/app/paybridge/id6749968512"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Image
          src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1291161600"
          alt="Download on the App Store"
          width={180}
          height={60}
          className="h-14 w-auto"
          priority
        />
      </a>

      {/* Google Play Button */}
      <a
        href="https://play.google.com/store/apps/details?id=com.paybridge.PayBridge"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Image
          src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
          alt="Get it on Google Play"
          width={200}
          height={78}
          className="h-[80px] w-auto"
          priority
        />
      </a>
    </div>
  );
};

export default AppStoreButtons;
