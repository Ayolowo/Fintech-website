import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "How fast are transfers?",
      answer: "Transfers complete in seconds, not days. Built on Solana for maximum speed."
    },
    {
      question: "What are the fees?",
      answer: "No gas fees, no network fees. You pay almost nothing to move money around the world."
    },
    {
      question: "Is my money safe?",
      answer: "Yes. PayBridge is non-custodial, meaning you always control your funds. We never hold your money."
    },
    {
      question: "Do I need to understand crypto?",
      answer: "Not at all. PayBridge handles all the complexity. Just enter a recipient and amount."
    },
    {
      question: "Which countries are supported?",
      answer: "PayBridge works globally. If there's internet, you can send and receive money."
    }
  ];

  return (
    <section className="w-full py-12 md:py-16 px-6 md:px-12 bg-muted/30">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl lg:text-[34px] xl:text-[34px] font-e-ukraine-Regular tracking-tighter">
            Frequently Asked Questions
          </h2>
          <p className="sm:text-1xl text-muted-foreground text-lg font-e-ukraine-Light">
            Everything you need to know about PayBridge.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-background/80 rounded-xl p-6 border border-border/50">
              <h3 className="text-lg font-e-ukraine-Regular mb-3">
                {faq.question}
              </h3>
              <p className="text-muted-foreground font-e-ukraine-Light">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;