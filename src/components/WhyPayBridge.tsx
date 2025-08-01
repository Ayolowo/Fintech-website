import React from "react";

const WhyPayBridge = () => {
  const features = [
    {
      title: "No Gas Fees",
      description: "Send money globally without network fees or gas costs. Only pay what you send."
    },
    {
      title: "Seconds, Not Days",
      description: "Borderless transfers that complete instantly. No bank delays or processing windows."
    },
    {
      title: "Built for Diaspora",
      description: "Send money home without losing chunks to traditional remittance fees and exchange rates."
    },
    {
      title: "Always Online",
      description: "24/7 money movement with no bank hours, holidays, or maintenance windows."
    },
    {
      title: "Local Currency Focus",
      description: "Think in your home currency — we handle the blockchain complexity behind the scenes."
    },
    {
      title: "No Banks Required",
      description: "Direct peer-to-peer transfers that bypass traditional banking infrastructure entirely."
    }
  ];

  return (
    <section className="w-full py-12 md:py-16 px-6 md:px-12 bg-muted/30">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-[34px] xl:text-[34px] font-e-ukraine-Regular tracking-tighter">
            Why PayBridge?
          </h2>
          <p className="sm:text-1xl text-muted-foreground text-lg font-e-ukraine-Light">
            Built for the diaspora, not the banks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4 p-6 rounded-xl bg-background/50 border border-border/50">
              <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-muted-foreground/20 rounded"></div>
              </div>
              <h3 className="text-xl font-e-ukraine-Regular tracking-tighter">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-e-ukraine-Light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyPayBridge;