"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function TiltCard({ children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="h-full w-full relative group perspective-1000"
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

export default function FounderShowcase({ founders = [] }) {
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
          const isHovered = hoveredFounder === f.id;

          return (
            <div key={f.id} className="relative perspective-1000 w-full h-full">
              <TiltCard>
                <div
                  className="relative rounded-2xl overflow-hidden glass-card p-8 md:p-10 border border-neutral-900 group transition-all duration-500 ease-out hover:-translate-y-1.5 cursor-pointer h-full"
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

      {/* MODAL / POPUP FOR FOUNDER DETAILS */}
      {selectedFounderId && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-[fadeIn_0.3s_ease-out_forwards]">
          {/* Blurred Background Overlay */}
          <div 
            className="absolute inset-0 bg-[#070708]/80 backdrop-blur-xl transition-opacity cursor-pointer" 
            onClick={() => setSelectedFounderId(null)}
          />
          
          {/* Modal Content Box */}
          <div className="relative z-10 w-full max-w-4xl bg-[#070708] border border-[var(--gold)]/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
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
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#070708] to-transparent pointer-events-none" />
            </div>

            {/* Right side: Detailed Information */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
              {(() => {
                const f = founders.find(f => f.id === selectedFounderId);
                if (!f) return null;
                return (
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl font-black text-white">
                        {f.name}
                      </h3>
                      <span className="inline-block font-mono text-[11px] font-bold tracking-[3px] uppercase mt-3 px-3 py-1 border border-[var(--gold)]/30 rounded text-[var(--gold)] bg-[var(--gold)]/10">
                        {f.role}
                      </span>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-mono text-[10px] tracking-[2px] text-[var(--muted)] uppercase mb-2">Short Bio</h4>
                        <p className="font-sans text-lg sm:text-xl leading-relaxed text-white/90">
                          {f.bio}
                        </p>
                      </div>

                      <div className="h-[1px] w-full bg-neutral-900" />

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
