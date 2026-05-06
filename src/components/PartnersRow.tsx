import React from "react";
import Stripe from "../assets/hero/partners/stripe";
import Quidax from "../assets/hero/partners/quidax";
import Bridge from "../assets/hero/partners/bridge";
import Persona from "../assets/hero/partners/persona";

const partners = [
  { name: "Stripe", logo: <Stripe /> },
  { name: "Quidax", logo: <Quidax /> },
  { name: "Bridge", logo: <Bridge /> },
  { name: "Persona", logo: <Persona /> },
];

const PartnersRow = () => {
  const items = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="w-full py-16" style={{ backgroundColor: "#faf9f9" }}>
      <div className="max-w-4xl mx-auto text-center mb-12 px-6">
        <h2 className="text-2xl sm:text-3xl md:text-5xl text-black font-semibold">
          Built with financial institutions
          <br /> <span className="font-[800]">you already trust</span>
        </h2>
      </div>

      {/* Scrolling ticker */}
      <div className="relative overflow-hidden">
        {/* Edge fades */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #faf9f9, transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #faf9f9, transparent)",
          }}
        />

        <div className="flex items-center animate-scroll">
          {items.map((partner, i) => (
            <div
              key={i}
              className="flex items-center justify-center px-16 shrink-0"
            >
              {partner.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersRow;
