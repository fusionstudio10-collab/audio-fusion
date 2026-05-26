"use client";
import { useState } from "react";

export default function FounderShowcase({ founders = [] }) {
  const [activeFounder, setActiveFounder] = useState(null);

  if (!founders || founders.length === 0) return null;

  return (
    <section id="founders" className="py-28 px-6 md:px-16 max-w-6xl mx-auto relative z-10">
      {/* SECTION TITLE */}
      <div className="mb-20 text-center md:text-left reveal-elem">
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-[var(--gold)]">
          The Minds Behind The Sound
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] italic text-5xl md:text-6xl font-black mt-2">
          Sonic Architects
        </h2>
      </div>

      {/* DUAL PERSONAS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {founders.map((f, index) => {
          const isFirst = index === 0;
          const isHovered = activeFounder === f.id;

          return (
            <div
              key={f.id}
              className="relative rounded-2xl overflow-hidden glass-card p-8 md:p-10 border border-neutral-900 group transition-all duration-500 ease-out hover:-translate-y-1.5"
              onMouseEnter={() => setActiveFounder(f.id)}
              onMouseLeave={() => setActiveFounder(null)}
              style={{
                boxShadow: isHovered
                  ? isFirst
                    ? "0 10px 40px -10px rgba(197,160,89,0.25)"
                    : "0 10px 40px -10px rgba(197,160,89,0.15)"
                  : "0 8px 32px 0 rgba(0,0,0,0.37)",
              }}
            >
              {/* Gold aura glow */}
              <div
                className="absolute inset-[-100px] pointer-events-none opacity-0 group-hover:opacity-15 transition-opacity duration-700 blur-[80px] z-0"
                style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 60%)" }}
              />

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none border-t-2 border-r-2 border-[var(--gold)] opacity-10 group-hover:opacity-60 transition-opacity duration-500 rounded-tr-2xl" />

              {/* CARD BODY */}
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">

                {/* PHOTO */}
                <div
                  className="relative w-36 h-36 rounded-xl overflow-hidden shrink-0 border border-neutral-800 group-hover:border-[var(--gold)]/40 transition-colors duration-300"
                  data-cursor
                  data-cursor-text={isFirst ? "EMCEE" : "SYNTH"}
                >
                  <img
                    src={f.photo}
                    alt={f.name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                </div>

                {/* TEXTS */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-[family-name:var(--font-playfair)] italic text-3xl font-bold text-[var(--text)]">
                    {f.name}
                  </h3>

                  <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase mt-1 px-2.5 py-0.5 border border-[var(--gold)]/20 rounded-full text-[var(--gold)] bg-[var(--gold)]/5">
                    {f.role}
                  </span>

                  <p className="font-[family-name:var(--font-instrument)] italic text-[15px] leading-relaxed text-[var(--muted)] mt-5 group-hover:text-[var(--text)] transition-colors duration-300">
                    {f.bio}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
