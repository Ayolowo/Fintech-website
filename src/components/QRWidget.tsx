import React from "react";
import Image from "next/image";

const QRWidget = () => {
  return (
    <div className="hidden md:block fixed bottom-6 right-6 z-50">
      <div
        className="rounded-xl shadow-2xl items-center justify-center  p-1 gap-2 border w-[120px]"
      >
        <Image
          src="/qr-code.png"
          alt="Scan to download PayBridge"
          width={90}
          height={90}
          className="rounded-lg w-full h-auto block"
        />
      </div>
    </div>
  );
};

export default QRWidget;
