"use client";
import { useRef, useState } from "react";
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
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
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
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="h-full w-full relative group perspective-1000"
    >
      <div 
        className="h-full w-full absolute inset-0 z-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" 
        style={{ transform: "translateZ(-20px)" }}
      />
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

export default function ServicesList({ services = [], onBookClick, whatsappNumber }) {
  if (!services || services.length === 0) return null;

  const groupedServices = services.reduce((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = [];
    acc[svc.category].push(svc);
    return acc;
  }, {});

  return (
    <section id="services" className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-6xl mx-auto relative z-10">
      <div className="mb-12 sm:mb-20 text-center md:text-left reveal-elem">
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-[var(--neon-blue)]">
          Rates & Expertise
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl md:text-6xl font-black mt-2">
          Studio Services
        </h2>
      </div>

      <div className="space-y-16 sm:space-y-24">
        {Object.entries(groupedServices).map(([category, svcs]) => (
          <div key={category} className="reveal-elem perspective-1000">
            <h3 className="font-[family-name:var(--font-syne)] text-sm sm:text-base font-bold tracking-[3px] uppercase text-[var(--gold)] mb-8 border-b border-neutral-800 pb-3">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {svcs.map((svc) => {
                const discountPercent = svc.originalPrice 
                  ? Math.round(((svc.originalPrice - svc.price) / svc.originalPrice) * 100)
                  : 0;

                return (
                  <div key={svc.id} className="relative w-full h-full" style={{ perspective: 1500 }}>
                    <TiltCard>
                      <div
                        className="glass-card neon-glow-border rounded-xl p-8 flex flex-col justify-between border border-neutral-900 bg-[#121214] h-full transition-colors duration-300 group-hover:border-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                      >
                        <div>
                          {svc.badge && (
                            <div className="inline-block mb-3 font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-widest text-[#070708] bg-[var(--gold)] px-2.5 py-1 rounded-full uppercase">
                              {svc.badge}
                            </div>
                          )}

                          <h4 className="font-[family-name:var(--font-playfair)] italic text-2xl font-bold mb-4 text-[var(--text)] group-hover:text-[var(--gold)] transition-colors pr-2">
                            {svc.name}
                          </h4>

                          <div className="flex flex-wrap items-end gap-2 mb-6">
                            {svc.originalPrice && (
                              <span className="text-[var(--muted)] line-through text-sm font-semibold mb-1">
                                ₹{svc.originalPrice}
                              </span>
                            )}
                            <span className="text-4xl font-black text-[var(--text)] font-sans tracking-normal">
                              ₹{svc.price}
                            </span>
                            {svc.unit && (
                              <span className="text-[var(--muted)] text-xs font-medium lowercase mb-1">
                                / {svc.unit}
                              </span>
                            )}

                            {discountPercent > 0 && (
                              <span className="text-[var(--neon-green)] text-[10px] font-bold uppercase tracking-widest ml-auto mb-1">
                                SAVE {discountPercent}%
                              </span>
                            )}
                          </div>

                          <p className="font-sans text-sm md:text-[15px] text-[var(--muted)] leading-relaxed mt-2 mb-8 pr-4">
                            {svc.description}
                          </p>
                        </div>

                        <a
                          href={`https://wa.me/91${(whatsappNumber || "7738882899").replace(/\D/g, "")}?text=${encodeURIComponent(`Hi! I want to inquire about the *${svc.name}* service.\n\nPrice: ₹${svc.price}${svc.unit ? ` / ${svc.unit}` : ''}\n\nPlease share more details and let me know the next steps!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor
                          data-cursor-text="INQUIRE"
                          className="w-full mt-auto py-3 bg-[var(--bg)] border border-neutral-800 rounded text-[11px] font-[family-name:var(--font-syne)] font-bold tracking-[2px] uppercase group-hover:bg-[var(--text)] group-hover:text-black group-hover:border-transparent transition-all duration-300 cursor-pointer text-center block relative z-20 pointer-events-auto"
                        >
                          Inquire
                        </a>
                      </div>
                    </TiltCard>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
