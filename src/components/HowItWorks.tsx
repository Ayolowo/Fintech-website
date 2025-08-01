import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Sign up in seconds",
      description: "Create your PayBridge account with just your email. No lengthy verification or paperwork required.",
      icon: <lord-icon src="https://cdn.lordicon.com/kthelypq.json" trigger="loop" delay="2000" colors="primary:#3b82f6,secondary:#10b981" style={{width:"48px", height:"48px"}}></lord-icon>
    },
    {
      number: "02", 
      title: "Add local money",
      description: "Fund your account with your local currency like CAD, NGN, or USD. Simple bank transfer or card deposit.",
      icon: <lord-icon src="https://cdn.lordicon.com/qhviklyi.json" trigger="loop" delay="2000" colors="primary:#10b981,secondary:#f59e0b" style={{width:"48px", height:"48px"}}></lord-icon>
    },
    {
      number: "03",
      title: "Send globally",
      description: "Enter recipient details and amount. Money bridges globally in seconds with no gas or network fees.",
      icon: <lord-icon src="https://cdn.lordicon.com/slkvcfos.json" trigger="loop" delay="2000" colors="primary:#8b5cf6,secondary:#3b82f6" style={{width:"48px", height:"48px"}}></lord-icon>
    }
  ];

  return (
    <section className="w-full py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-[34px] xl:text-[34px] font-e-ukraine-Regular tracking-tighter">
            How It Works
          </h2>
          <p className="sm:text-1xl text-muted-foreground text-lg font-e-ukraine-Light">
            Three simple steps to bridge money globally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-2">
                  {step.icon}
                </div>
                <div className="text-sm font-e-ukraine-Regular text-muted-foreground tracking-wider">
                  STEP {step.number}
                </div>
                <h3 className="text-xl font-e-ukraine-Regular tracking-tighter">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-e-ukraine-Light max-w-xs">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;