import React from "react";

const WhoItsFor = () => {
  const audiences = [
    {
      title: "Global Contractors",
      description: "Pay international teams without losing money to fees and delays. Send payments globally in seconds.",
      icon: <lord-icon src="https://cdn.lordicon.com/nocovwne.json" trigger="loop" delay="2000" colors="primary:#3b82f6,secondary:#10b981" style={{width:"40px", height:"40px"}}></lord-icon>
    },
    {
      title: "Canadian Business Owners",
      description: "Small businesses sending money abroad. Skip bank fees and paperwork entirely.",
      icon: <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop" delay="2000" colors="primary:#ef4444,secondary:#f97316" style={{width:"40px", height:"40px"}}></lord-icon>
    },
    {
      title: "Immigrant Families",
      description: "Send money home without paying excessive remittance fees. Keep more of what you earn.",
      icon: <lord-icon src="https://cdn.lordicon.com/eszyyflr.json" trigger="loop" delay="2000" colors="primary:#8b5cf6,secondary:#ec4899" style={{width:"40px", height:"40px"}}></lord-icon>
    },
    {
      title: "Digital Natives",
      description: "Users who expect money to move as fast as information. No bank delays or processing windows.",
      icon: <lord-icon src="https://cdn.lordicon.com/slkvcfos.json" trigger="loop" delay="2000" colors="primary:#10b981,secondary:#3b82f6" style={{width:"40px", height:"40px"}}></lord-icon>
    },
    {
      title: "Bank-Free Users",
      description: "Skip traditional banking infrastructure with direct peer-to-peer money movement.",
      icon: <lord-icon src="https://cdn.lordicon.com/kiynvdns.json" trigger="loop" delay="2000" colors="primary:#f59e0b,secondary:#ef4444" style={{width:"40px", height:"40px"}}></lord-icon>
    }
  ];

  return (
    <section className="w-full py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-[34px] xl:text-[34px] font-e-ukraine-Regular tracking-tighter">
            Who It's For
          </h2>
          <p className="sm:text-1xl text-muted-foreground text-lg font-e-ukraine-Light">
            Built for anyone who needs money to move without friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.slice(0, 3).map((audience, index) => (
            <div key={index} className="space-y-4 p-6 rounded-xl border border-border hover:border-primary/20 transition-colors">
              <div className="w-16 h-16 bg-muted rounded-full mb-4 flex items-center justify-center">
                {audience.icon}
              </div>
              <h3 className="text-xl font-e-ukraine-Regular tracking-tighter">
                {audience.title}
              </h3>
              <p className="text-muted-foreground font-e-ukraine-Light">
                {audience.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {audiences.slice(3).map((audience, index) => (
            <div key={index + 3} className="space-y-4 p-6 rounded-xl border border-border hover:border-primary/20 transition-colors">
              <div className="w-16 h-16 bg-muted rounded-full mb-4 flex items-center justify-center">
                {audience.icon}
              </div>
              <h3 className="text-xl font-e-ukraine-Regular tracking-tighter">
                {audience.title}
              </h3>
              <p className="text-muted-foreground font-e-ukraine-Light">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsFor;