"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80",
    title: "Empowering Traders Across Jammu & Kashmir",
    subtitle:
      "Official digital platform for shop registration and certification",
  },
  {
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80",
    title: "Transparent & Accountable Governance",
    subtitle:
      "Every certificate, notice, and fund record — publicly accessible",
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&q=80",
    title: "Building a Stronger Traders Community",
    subtitle:
      "Connecting verified businesses with the federation and the public",
  },
];

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="bg-white py-3 sm:py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* aspect-ratio drives height responsively: 16/9 on mobile, wider on sm, fixed on lg */}
        <div className="relative w-full overflow-hidden rounded-lg shadow-sm aspect-[4/3] sm:aspect-[16/7] lg:aspect-auto lg:h-[440px]">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                className="object-cover object-center"
                priority={i === 0}
                unoptimized
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65" />
              {/* Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 sm:px-8">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold rounded-full mb-3 sm:mb-4 border border-white/30">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Official Platform — Jammu & Kashmir
                </div>
                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white max-w-3xl leading-snug drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-white/80 mt-2 sm:mt-3 text-xs sm:text-sm md:text-base max-w-xl drop-shadow leading-relaxed">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* Prev / Next buttons — hidden on very small screens, shown sm+ */}
          <button
            onClick={prev}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full items-center justify-center text-white transition-colors"
            aria-label="Previous slide"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={next}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full items-center justify-center text-white transition-colors"
            aria-label="Next slide"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
