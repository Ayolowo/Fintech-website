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

const BusinessPartnersRow = () => {
  const items = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="w-full py-16" style={{ backgroundColor: "#faf9f9" }}>
      <div className="max-w-8xl mx-auto text-center mb-20">
        <h2 className="text-4xl sm:text-5xl md:text-6xl text-black font-semibold">
          Built with financially regulated partners
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #faf9f9, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #faf9f9, transparent)" }} />

        <div className="flex items-center animate-scroll">
          {items.map((partner, i) => (
            <div key={i} className="flex items-center justify-center px-16 shrink-0">
              {partner.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessPartnersRow;
