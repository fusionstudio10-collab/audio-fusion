"use client";
import { Quote } from "lucide-react";

export default function TestimonialMarquee({ testimonials = [] }) {
  if (!testimonials || testimonials.length === 0) return null;

  // Duplicate the array to create a seamless infinite scrolling effect
  const marqueeItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-20 sm:py-28 bg-[#070708] relative overflow-hidden z-10 border-t border-neutral-900">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--gold)]/5 via-[#070708]/80 to-[#070708] z-0" />
      
      <div className="text-center mb-12 sm:mb-16 relative z-10 reveal-elem px-5">
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#ff0000]">
          Client Feedback
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl font-black mt-2">
          Artists We've Amplified
        </h2>
      </div>

      <div className="relative w-full overflow-hidden flex flex-col gap-6 z-10">
        {/* Left/Right Fade Gradients for smooth entrance/exit */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#070708] to-transparent z-20" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#070708] to-transparent z-20" />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {marqueeItems.map((item, idx) => (
            <div 
              key={idx} 
              className="w-[300px] sm:w-[400px] mx-3 sm:mx-4 flex-shrink-0 bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 sm:p-8 hover:border-[var(--gold)]/30 hover:bg-neutral-900/80 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-[var(--gold)]/40 mb-4" />
              <p className="font-sans text-sm sm:text-base text-neutral-300 leading-relaxed mb-6 italic">
                "{item.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                  <span className="font-bold text-[var(--gold)]">{item.client.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.client}</h4>
                  <p className="font-mono text-[10px] text-[var(--muted)] tracking-widest uppercase">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
