"use client";

import React from 'react';
import Image from 'next/image';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-20 w-20 flex items-center justify-center">
        <Image 
          src="/lovable-uploads/73233d43-2254-40b5-9e77-5fe58d056ac4.png" 
          alt="Logo"
          width={80}
          height={80}
          className="h-20 w-20 object-contain light-mode:block dark-mode:hidden"
        />
        <Image 
          src="/lovable-uploads/daa305d6-6b1a-47ae-95a1-e28c6872157c.png" 
          alt="Logo"
          width={80}
          height={80}
          className="h-20 w-20 object-contain hidden dark-mode:block"
        />
      </div>
    </div>
  );
};

export default Logo;
