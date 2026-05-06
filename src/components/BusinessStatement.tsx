import React from "react";

const BusinessStatement = () => {
  return (
    <section className="w-full min-h-screen px-6 md:px-16 lg:px-24 flex items-center justify-center" style={{ backgroundColor: "#083400" }}>
      <h2
        className="text-5xl sm:text-6xl md:text-7xl lg:text-[96px] font-black text-center leading-tight"
        style={{ lineHeight: 1.0 }}
      >
        <span style={{ color: "#9FE870" }}>The platform</span>
        <br />
        <span className="text-white">built to move</span>
        <br />
        <span className="text-white">your money.</span>
      </h2>
    </section>
  );
};

export default BusinessStatement;
