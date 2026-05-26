"use client";
import { Check } from "lucide-react";

export default function ServicesList({ services = [], onBookClick }) {
  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-6xl mx-auto relative z-10">
      {/* TITLE */}
      <div className="mb-12 sm:mb-20 text-center md:text-left reveal-elem">
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-[var(--neon-blue)]">
          Rates & Expertise
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl md:text-6xl font-black mt-2">
          Studio Services
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        {services.map((svc) => {
          const discountPercent = svc.originalPrice 
            ? Math.round(((svc.originalPrice - svc.price) / svc.originalPrice) * 100)
            : 0;

          return (
            <div
              key={svc.id}
              className="glass-card neon-glow-border rounded-xl p-8 flex flex-col justify-between border border-neutral-900 relative group transition-all duration-300"
            >
              {/* Promo Badge */}
              {svc.badge && (
                <div className="absolute top-4 right-4 font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-widest text-[#070708] bg-[var(--gold)] px-2.5 py-1 rounded-full uppercase">
                  {svc.badge}
                </div>
              )}

              <div>
                {/* Category Header */}
                <span className="block font-mono text-[9px] tracking-widest text-[var(--muted)] uppercase mb-4">
                  {svc.category}
                </span>

                {/* Name */}
                <h3 className="font-[family-name:var(--font-playfair)] italic text-2xl font-bold mb-4 text-[var(--text)] group-hover:text-[var(--gold)] transition-colors">
                  {svc.name}
                </h3>

                {/* Price tag */}
                <div className="flex items-baseline gap-2 mb-6">
                  {svc.originalPrice && (
                    <span className="text-[var(--muted)] line-through text-sm font-semibold">
                      ₹{svc.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-extrabold text-[var(--text)] font-[family-name:var(--font-syne)]">
                    ₹{svc.price}
                  </span>
                  {svc.unit && (
                    <span className="text-[var(--muted)] text-xs font-medium lowercase">
                      / {svc.unit}
                    </span>
                  )}

                  {/* Save Label */}
                  {discountPercent > 0 && (
                    <span className="text-[var(--neon-green)] text-[9px] font-bold uppercase tracking-widest ml-1">
                      SAVE {discountPercent}%
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="font-[family-name:var(--font-instrument)] italic text-sm leading-relaxed text-[var(--muted)] mb-8">
                  {svc.description}
                </p>
              </div>

              {/* Book Button */}
              <button
                onClick={() => onBookClick(svc.name)}
                data-cursor
                data-cursor-text="BOOK"
                className="w-full mt-auto py-3 bg-[var(--bg)] border border-neutral-800 rounded text-[11px] font-[family-name:var(--font-syne)] font-bold tracking-[2px] uppercase hover:bg-[var(--text)] hover:text-black hover:border-transparent transition-all duration-300 cursor-pointer"
              >
                Book Session
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
