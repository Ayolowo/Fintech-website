"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const BusinessFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Is PayBridge a bank?",
      answer:
        "No, PayBridge is not a bank. We partner with regulated financial institutions to provide secure money transfer services. Your funds are held with our licensed banking partners, ensuring safety and compliance.",
    },
    {
      question: "Where is PayBridge available?",
      answer:
        "PayBridge operates in over 30 countries across Africa, Europe, and the Americas. We support transfers to 140+ countries worldwide, making it easy to pay suppliers, staff, and partners globally.",
    },
    {
      question: "How does PayBridge work?",
      answer:
        "PayBridge lets you send and receive money internationally using competitive exchange rates. Simply create an account, verify your business, add funds, and send payments to any supported country. Most transfers complete in 3-5 minutes.",
    },
    {
      question: "What currencies can I use?",
      answer:
        "We support 35+ major currencies including USD, EUR, GBP, NGN, CAD, and more. You can hold balances in multiple currencies and convert between them as needed.",
    },
    {
      question: "What are the fees?",
      answer:
        "PayBridge offers transparent pricing with zero transfer fees on most transactions. You only pay the mid-market exchange rate with no hidden markups. Business accounts may have monthly subscription fees depending on your plan.",
    },
    {
      question: "How fast are transfers?",
      answer:
        "Most international transfers complete within 3-5 minutes. Bank transfers may take 1-3 business days depending on the destination country and banking system.",
    },
    {
      question: "Is PayBridge secure?",
      answer:
        "Yes. We use bank-level encryption, two-factor authentication, and comply with international financial regulations. Your business data and transactions are protected by industry-leading security protocols.",
    },
    {
      question: "Can I integrate PayBridge with my accounting software?",
      answer:
        "API integration and accounting software connections are coming soon to our business dashboard. Contact our team to discuss your integration needs.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-20 md:py-28 lg:py-32 px-4 md:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-gray-900 mb-4">
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-20">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 md:p-7 text-left group"
              >
                <span className="text-lg md:text-xl font-semibold text-gray-900 pr-6 group-hover:text-gray-700 transition-colors">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-all">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-700" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 md:px-7 pb-6 md:pb-7 pt-0">
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center space-y-8 pt-8">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
            Still have a question?
          </h3>
          <a
            href="mailto:support@paybridgefinance.com"
            className="inline-flex items-center justify-center px-10 py-4 font-semibold text-base rounded-xl transition-all shadow-lg hover:shadow-xl"
            style={{ backgroundColor: "#9FE870", color: "black" }}
          >
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
};

export default BusinessFAQ;
