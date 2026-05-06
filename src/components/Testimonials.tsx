"use client";

import React from "react";
import { CircleFlag } from "react-circle-flags";

const testimonials = [
  {
    name: "Stephen O.",
    country: "England",
    countryCode: "gb",
    role: "Student",
    review:
      "Amazing app. fast, reliable and user friendly, with the current best rate of any other exchange app as of 10th march 2026",
    rating: 5,
  },
  {
    name: "Samuel O.",
    country: "Nigeria",
    countryCode: "ng",
    role: "Senior Pastor",
    review:
      "Wow, that was so fast and easy",
    rating: 5,
  },
  {
    name: "Purity",
    country: "France",
    countryCode: "fr",
    role: "Student & Entrepreneur",
    review:
      "I've tried many platforms but PayBridge is by far the easiest. Sending money to my suppliers across borders has never been this seamless.",
    rating: 5,
  },
  {
    name: "Hafsat",
    country: "Canada",
    countryCode: "ca",
    role: "Healthcare Professional",
    review:
      "Cheapest exchange rate I have come across. Also, transactions are very fast.",
    rating: 5,
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-4 h-4" fill="#163300" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div className="flex flex-col gap-4 p-6 md:p-10 rounded-2xl border border-black/8 bg-white shrink-0 w-[300px] sm:w-[340px] md:w-[380px]">
    <Stars count={testimonial.rating} />
    <p className="text-black text-lg leading-relaxed flex-1">
      &ldquo;{testimonial.review}&rdquo;
    </p>
    <div className="flex items-center gap-3 pt-2 border-t border-black/5">
      <CircleFlag countryCode={testimonial.countryCode} height={36} width={36} />
      <div>
        <p className="text-md text-black font-semibold">{testimonial.name}</p>
        <p className="text-sm text-gray-700">{testimonial.role} · {testimonial.country}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const items = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="w-full py-20" style={{ backgroundColor: "#faf9f9" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-16 lg:px-24 mb-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-black mb-4">
          What our customers are saying
        </h2>
        <p className="text-black text-lg max-w-xl mx-auto" style={{color: "#163300"}}>
          People trust PayBridge to move money across borders &mdash; here&rsquo;s what they have to say.
        </p>
      </div>

      <div className="relative overflow-hidden">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #faf9f9, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #faf9f9, transparent)" }} />

        <div className="flex gap-4 animate-scroll hover:[animation-play-state:paused] w-max px-6">
          {items.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
