"use client";

import React from "react";
import { Briefcase, Building, Heart, Smartphone, Users, ArrowRight } from "lucide-react";

const WhoItsFor = () => {
  const audiences = [
    {
      title: "Freelancers & Contractors",
      description: "Get paid from global clients without losing money to international fees.",
      details: "Receive payments in your local virtual account. Convert at competitive rates. Get paid like a local, no matter where your client is.",
      icon: <Briefcase className="w-8 h-8" />
    },
    {
      title: "Small Businesses",
      description: "Pay international suppliers and contractors without bank delays.",
      details: "Send payments globally in seconds. Skip wire fees and processing times. Manage international payments with the same ease as local ones.",
      icon: <Building className="w-8 h-8" />
    },
    {
      title: "Immigrant Families",
      description: "Send money home without paying excessive remittance fees.",
      details: "Keep more of what you earn. Skip Western Union and bank fees. Support your family back home with instant, affordable transfers.",
      icon: <Heart className="w-8 h-8" />
    },
    {
      title: "Digital Nomads",
      description: "Manage money across borders as you travel and work remotely.",
      details: "Hold multiple currencies in virtual accounts. Send and receive anywhere. Your financial infrastructure travels with you.",
      icon: <Smartphone className="w-8 h-8" />
    },
    {
      title: "Crypto Enthusiasts",
      description: "Bridge between crypto and traditional money seamlessly.",
      details: "Fund with crypto, spend in fiat. Get local virtual accounts backed by blockchain. Best of both worlds without the complexity.",
      icon: <Users className="w-8 h-8" />
    }
  ];

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Who It&apos;s For
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            Built for anyone who needs money to move without friction across borders.
          </p>
        </div>

        {/* Main Audiences - Featured Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {audiences.slice(0, 2).map((audience, index) => (
            <div
              key={index}
              className="rounded-3xl border border-border bg-card p-8 md:p-10"
            >
              <div className="space-y-6">
                <div className="inline-flex p-4 rounded-2xl bg-muted">
                  {audience.icon}
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-normal tracking-tight">
                    {audience.title}
                  </h3>
                  <p className="text-lg text-muted-foreground font-light">
                    {audience.description}
                  </p>
                  <p className="text-base text-muted-foreground/80 font-light leading-relaxed">
                    {audience.details}
                  </p>
                </div>

                <button className="inline-flex items-center gap-2 text-foreground font-normal">
                  Learn how
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Audiences - Compact Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {audiences.slice(2).map((audience, index) => (
            <div
              key={index + 2}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-xl bg-muted">
                  {React.cloneElement(audience.icon, { className: "w-6 h-6" })}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-normal tracking-tight">
                    {audience.title}
                  </h4>
                  <p className="text-sm text-muted-foreground font-light">
                    {audience.description}
                  </p>
                  <p className="text-sm text-muted-foreground/70 font-light leading-relaxed">
                    {audience.details}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="rounded-3xl border border-border bg-muted/50 p-8 md:p-12 text-center">
          <div className="space-y-6 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-normal tracking-tight">
              Don&apos;t see yourself here?
            </h3>
            <p className="text-lg text-muted-foreground font-light">
              PayBridge works for anyone who needs to move money globally. Join our community and discover how we can help you bridge money, anywhere, instantly.
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-normal text-lg">
              Join the Waitlist
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoItsFor;
