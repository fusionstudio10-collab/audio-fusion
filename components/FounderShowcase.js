"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";

function TiltCard({ children }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = x - xc;
    const dy = y - yc;
    const rx = -(dy / yc) * 8; // Max 8 degrees tilt for premium feel
    const ry = (dx / xc) * 8;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
        transformStyle: "preserve-3d"
      }}
      className="h-full w-full relative group"
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}

export default function FounderShowcase({ founders = [], layout = "cards" }) {
  const [hoveredFounder, setHoveredFounder] = useState(null);
  const [selectedFounderId, setSelectedFounderId] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedFounderId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedFounderId]);

  if (!founders || founders.length === 0) return null;

  return (
    <section id="founders" className="py-16 sm:py-28 px-4 sm:px-8 md:px-16 max-w-6xl mx-auto relative z-10">
      {/* SECTION TITLE */}
      <div className="mb-10 sm:mb-20 text-center md:text-left reveal-elem">
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-[var(--gold)]">
          The Minds Behind The Sound
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl md:text-6xl font-black mt-2">
          Sonic Architects
        </h2>
      </div>

      {layout === "split" ? (
        <div className="space-y-16 sm:space-y-24 md:space-y-32">
          {founders.map((f, index) => {
            const isFirst = index === 0;
            const isHovered = hoveredFounder === f.id;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 md:gap-16 cursor-pointer"
                onClick={() => setSelectedFounderId(f.id)}
                onMouseEnter={() => setHoveredFounder(f.id)}
                onMouseLeave={() => setHoveredFounder(null)}
              >
                {/* Photo column */}
                <div className={`w-full lg:w-5/12 aspect-[4/3] rounded-2xl overflow-hidden glass-card border border-neutral-900/60 relative group ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div
                    className="absolute inset-[-100px] pointer-events-none opacity-0 group-hover:opacity-15 transition-opacity duration-700 blur-[80px]"
                    style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 60%)" }}
                  />
                  <img
                    src={f.photo}
                    alt={f.name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    data-cursor
                    data-cursor-text={isFirst ? "EMCEE" : "SYNTH"}
                  />
                </div>

                {/* Text column */}
                <div className={`w-full lg:w-7/12 space-y-4 text-center lg:text-left ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase px-2.5 py-0.5 border border-[var(--gold)]/20 rounded-full text-[var(--gold)] bg-[var(--gold)]/5">
                    {f.role}
                  </span>
                  
                  <h3 className="font-[family-name:var(--font-playfair)] italic text-3xl sm:text-5xl font-black text-white hover:text-[var(--gold)] transition-colors">
                    {f.name}
                  </h3>

                  <p className="font-sans text-base sm:text-lg leading-relaxed text-[var(--muted)] hover:text-white transition-colors duration-300">
                    {f.bio}
                  </p>
                  
                  <div className="pt-2">
                    <span className="text-[10px] font-mono tracking-widest text-[var(--gold)] uppercase border-b border-[var(--gold)]/30 pb-1">
                      Read Experience Details →
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* DUAL PERSONAS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-16">
          {founders.map((f, index) => {
            const isFirst = index === 0;
            const isHovered = hoveredFounder === f.id;

            return (
              <div key={f.id} className="relative perspective-1000 w-full h-full">
                <TiltCard>
                  <div
                    className="relative rounded-2xl overflow-hidden glass-card p-5 sm:p-8 md:p-10 border border-neutral-900 group transition-all duration-500 ease-out hover:-translate-y-1.5 cursor-pointer h-full"
                    onMouseEnter={() => setHoveredFounder(f.id)}
                    onMouseLeave={() => setHoveredFounder(null)}
                    onClick={() => setSelectedFounderId(f.id)}
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
                    <div className="relative z-10 flex flex-col gap-5 sm:gap-8 items-center">

                      {/* PHOTO */}
                      <div
                        className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-xl overflow-hidden shrink-0 border border-neutral-800 group-hover:border-[var(--gold)]/40 transition-colors duration-300"
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
                        <h3 className="font-[family-name:var(--font-playfair)] italic text-2xl sm:text-3xl font-bold text-[var(--text)]">
                          {f.name}
                        </h3>

                        <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase mt-1 px-2.5 py-0.5 border border-[var(--gold)]/20 rounded-full text-[var(--gold)] bg-[var(--gold)]/5">
                          {f.role}
                        </span>

                        <p className="font-sans text-[15px] leading-relaxed text-[var(--muted)] mt-5 group-hover:text-[var(--text)] transition-colors duration-300">
                          {f.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL / POPUP FOR FOUNDER DETAILS */}
      {selectedFounderId && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-[fadeIn_0.3s_ease_out_forwards]">
          {/* Blurred Background Overlay */}
          <div 
            className="absolute inset-0 bg-[var(--bg)]/85 backdrop-blur-xl transition-opacity cursor-pointer" 
            onClick={() => setSelectedFounderId(null)}
          />
          
          {/* Modal Content Box */}
          <div className="relative z-10 w-full max-w-4xl bg-[var(--bg)] border border-[var(--gold)]/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row max-h-[90svh] animate-[scaleUp_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedFounderId(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-neutral-800 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10"
            >
              <X size={20} />
            </button>
 
            {/* Left side: Big Image */}
            <div className="w-full md:w-5/12 h-64 md:h-auto relative shrink-0">
              {founders.find(f => f.id === selectedFounderId)?.photo && (
                <img 
                  src={founders.find(f => f.id === selectedFounderId).photo} 
                  alt={founders.find(f => f.id === selectedFounderId).name} 
                  className="w-full h-full object-cover"
                />
              )}
              {/* Fade gradient on mobile bottom, desktop right */}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none" />
            </div>
 
            {/* Right side: Detailed Information */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
              {(() => {
                const f = founders.find(f => f.id === selectedFounderId);
                if (!f) return null;
                return (
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl font-black text-[var(--text)]">
                        {f.name}
                      </h3>
                      <span className="inline-block font-mono text-[11px] font-bold tracking-[3px] uppercase mt-3 px-3 py-1 border border-[var(--gold)]/30 rounded text-[var(--gold)] bg-[var(--gold)]/10">
                        {f.role}
                      </span>
                    </div>
 
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-mono text-[10px] tracking-[2px] text-[var(--muted)] uppercase mb-2">Short Bio</h4>
                        <p className="font-sans text-lg sm:text-xl leading-relaxed text-[var(--text)]/90">
                          {f.bio}
                        </p>
                      </div>
 
                      <div className="h-[1px] w-full bg-[var(--border)]" />
 
                      <div>
                        <h4 className="font-mono text-[10px] tracking-[2px] text-[var(--muted)] uppercase mb-3">Experience & Achievements</h4>
                        <p className="font-sans text-base leading-loose text-[var(--muted)] whitespace-pre-line">
                          {f.experience || "More details coming soon."}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
