import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
const Features = () => {
  const [openFeature, setOpenFeature] = useState<number | null>(null);
  const features = [{
    title: "Instant Global Transfers",
    description: "Send money anywhere in the world in seconds, not days.",
    expandedDescription: "Built on Solana's high-speed blockchain infrastructure, PayBridge processes transfers globally in seconds. No waiting for bank processing windows, no delays during weekends or holidays. Money moves at the speed of the internet, 24/7.",
    icon: <lord-icon src="https://cdn.lordicon.com/slkvcfos.json" trigger="loop" delay="2000" colors="primary:#3b82f6,secondary:#10b981" style={{width:"32px", height:"32px"}}></lord-icon>
  }, {
    title: "Zero Gas Fees",
    description: "No network fees, no gas costs. Pay almost nothing to move money globally.",
    expandedDescription: "Traditional crypto transactions can cost $50+ in gas fees. PayBridge eliminates these costs entirely. Send $10 or $10,000 with the same minimal service fee. No hidden charges, no surprise network fees.",
    icon: <lord-icon src="https://cdn.lordicon.com/kiynvdns.json" trigger="loop" delay="2000" colors="primary:#ef4444,secondary:#f97316" style={{width:"32px", height:"32px"}}></lord-icon>
  }, {
    title: "Local Currency Experience", 
    description: "Work entirely in your home currency — we handle the blockchain complexity.",
    expandedDescription: "Fund your account with CAD, NGN, USD, or other local currencies. See balances and send amounts in familiar terms. PayBridge handles all blockchain conversions and routing automatically behind the scenes.",
    icon: <lord-icon src="https://cdn.lordicon.com/qhviklyi.json" trigger="loop" delay="2000" colors="primary:#10b981,secondary:#f59e0b" style={{width:"32px", height:"32px"}}></lord-icon>
  }, {
    title: "Diaspora-First Design",
    description: "Built specifically for sending money home without traditional remittance fees.",
    expandedDescription: "Skip Western Union, MoneyGram, and bank wire fees that can reach 10% or more. PayBridge connects immigrant communities with their families back home through direct, low-cost transfers that preserve more of what you earn.",
    icon: <lord-icon src="https://cdn.lordicon.com/eszyyflr.json" trigger="loop" delay="2000" colors="primary:#8b5cf6,secondary:#ec4899" style={{width:"32px", height:"32px"}}></lord-icon>
  }, {
    title: "No Banking Required",
    description: "Direct peer-to-peer transfers that bypass traditional banking infrastructure.",
    expandedDescription: "PayBridge connects users directly without requiring traditional bank accounts or lengthy verification processes. Perfect for unbanked or underbanked communities who need reliable money movement options.",
    icon: <lord-icon src="https://cdn.lordicon.com/nocovwne.json" trigger="loop" delay="2000" colors="primary:#f59e0b,secondary:#ef4444" style={{width:"32px", height:"32px"}}></lord-icon>
  }, {
    title: "Enterprise Security",
    description: "Bank-grade security with the transparency and speed of blockchain technology.",
    expandedDescription: "Your funds are protected by enterprise-grade security protocols and blockchain immutability. Transactions are transparent and verifiable, while your personal information remains private and secure.",
    icon: <lord-icon src="https://cdn.lordicon.com/kkvxgpti.json" trigger="loop" delay="2000" colors="primary:#10b981,secondary:#3b82f6" style={{width:"32px", height:"32px"}}></lord-icon>
  }];
  const toggleFeature = (index: number) => {
    setOpenFeature(openFeature === index ? null : index);
  };
  return <section id="features" className="w-full py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-[34px] xl:text-[34px] font-e-ukraine-Regular tracking-tighter">Designed to be simple. Powered by Solana.</h2>
          <p className="sm:text-1xl text-cosmic-muted text-lg font-e-ukraine-Light">Your money app should feel as smooth as your favorite mobile wallet — with global reach under the hood.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <Collapsible key={index} open={openFeature === index} onOpenChange={() => toggleFeature(index)} className={`rounded-xl border ${openFeature === index ? 'border-cosmic-light/40' : 'border-cosmic-light/20'} cosmic-gradient transition-all duration-300`}>
              <CollapsibleTrigger className="w-full text-left p-6 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-full bg-cosmic-light/10 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <ChevronDown className={`h-5 w-5 text-cosmic-muted transition-transform duration-200 ${openFeature === index ? 'rotate-180' : ''}`} />
                </div>
                <h3 className="text-xl font-medium tracking-tighter mb-3">{feature.title}</h3>
                <p className="text-cosmic-muted">{feature.description}</p>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 pt-2">
                <div className="pt-3 border-t border-cosmic-light/10">
                  <p className="text-cosmic-muted">{feature.expandedDescription}</p>
                  <div className="mt-4 flex justify-end">
                    <button className="text-cosmic-accent hover:text-cosmic-accent/80 text-sm font-medium">
                      Learn more →
                    </button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>)}
        </div>
      </div>
    </section>;
};
export default Features;