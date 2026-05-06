import React from "react";
import { ArrowUpRight } from "lucide-react";

const BusinessCTA = () => {
  return (
    <section className="w-full min-h-[60vh] px-6 md:px-16 lg:px-24 flex items-center justify-center" style={{ backgroundColor: "#083400" }}>
      <div className="text-center max-w-3xl">
        <h2
          className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6"
          style={{ lineHeight: 1.0 }}
        >
          Ready to move money <span style={{ color: "#9FE870" }}>without limits?</span>
        </h2>
        <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
          Join businesses using PayBridge to pay suppliers, run global payroll, and hold digital dollars — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/business/register"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold text-base transition-all hover:opacity-90"
            style={{ backgroundColor: "#9FE870", color: "#083400" }}
          >
            Get started for free
            <ArrowUpRight className="w-5 h-5" />
          </a>
          <a
            href="mailto:support@paybridgefinance.com"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold text-base transition-all hover:bg-white/10"
            style={{ color: "white", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            Contact sales
          </a>
        </div>
      </div>
    </section>
  );
};

export default BusinessCTA;
