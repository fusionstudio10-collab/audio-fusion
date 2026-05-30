"use client";
import { useState } from "react";
import { Quote } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

function SwipeCard({ item, active, index, onSwipe }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform drag distance into rotation and opacity
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 120) {
      onSwipe("right");
    } else if (info.offset.x < -120) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        opacity,
        zIndex: index,
        transformStyle: "preserve-3d",
      }}
      drag={active}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={
        active
          ? { scale: 1, y: 0, rotateY: 0 }
          : { scale: 0.95 - (index * 0.02), y: index * 10, rotateY: 10 }
      }
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`absolute w-full max-w-[400px] glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-neutral-900/60 bg-neutral-950/80 shadow-2xl ${active ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"} select-none`}
    >
      <div>
        <Quote className="w-10 h-10 text-[var(--gold)]/40 mb-6" />
        <p className="font-sans text-base sm:text-lg text-white leading-relaxed mb-8 italic">
          &quot;{item.text}&quot;
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[var(--bg)] flex items-center justify-center border border-[var(--border)] overflow-hidden shrink-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.client} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-[var(--gold)] text-lg">{item.client ? item.client.charAt(0) : ''}</span>
          )}
        </div>
        <div>
          <h4 className="font-bold text-white text-base">{item.client}</h4>
          <p className="font-mono text-xs text-[var(--muted)] tracking-widest uppercase">{item.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialMarquee({ testimonials = [], layout = "marquee", googleReviewUrl = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  // Duplicate array for infinite marquee layout
  const marqueeItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  const handleSwipe = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const card1 = testimonials[currentIndex];
  const card2 = testimonials[(currentIndex + 1) % testimonials.length];
  const card3 = testimonials[(currentIndex + 2) % testimonials.length];

  return (
    <section className="py-14 sm:py-20 md:py-28 bg-[var(--bg)] relative overflow-hidden z-10 border-t border-[var(--border)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--gold)]/5 via-[var(--bg)]/80 to-[var(--bg)] z-0" />
      
      <div className="text-center mb-12 sm:mb-16 relative z-10 reveal-elem px-5">
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-[var(--gold)]">
          Client Feedback
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl font-black mt-2">
          Artists We&apos;ve Amplified
        </h2>
      </div>

      {layout === "slider" ? (
        <div className="relative w-full max-w-[400px] h-[380px] mx-auto flex items-center justify-center z-10 select-none">
          {/* Card 3 (Bottom-most) */}
          {testimonials.length > 2 && (
            <SwipeCard item={card3} active={false} index={0} onSwipe={handleSwipe} key={`swipe-${(currentIndex + 2) % testimonials.length}`} />
          )}
          {/* Card 2 (Middle) */}
          {testimonials.length > 1 && (
            <SwipeCard item={card2} active={false} index={1} onSwipe={handleSwipe} key={`swipe-${(currentIndex + 1) % testimonials.length}`} />
          )}
          {/* Card 1 (Top, draggable) */}
          <SwipeCard item={card1} active={true} index={2} onSwipe={handleSwipe} key={`swipe-${currentIndex}`} />
          
          <div className="absolute -bottom-12 flex items-center gap-4">
            <span className="text-[10px] font-mono tracking-widest text-[var(--muted)] uppercase">Drag / Swipe Card to Next</span>
          </div>
        </div>
      ) : layout === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 z-10 relative">
          {testimonials.map((item, idx) => (
            <div 
              key={idx} 
              className="glass-card border border-neutral-900/60 rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--gold)]/30 hover:-translate-y-1.5 transition-all duration-300 relative"
            >
              <div>
                <Quote className="w-8 h-8 text-[var(--gold)]/40 mb-4" />
                <p className="font-sans text-sm sm:text-base text-[var(--text)] leading-relaxed mb-6 italic">
                  &quot;{item.text}&quot;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--bg)] flex items-center justify-center border border-[var(--border)] overflow-hidden shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.client} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-[var(--gold)]">{item.client ? item.client.charAt(0) : ''}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text)] text-sm">{item.client}</h4>
                  <p className="font-mono text-[10px] text-[var(--muted)] tracking-widest uppercase">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative w-full overflow-hidden flex flex-col gap-6 z-10">
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[var(--bg)] to-transparent z-20" />
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[var(--bg)] to-transparent z-20" />

          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {marqueeItems.map((item, idx) => (
              <div 
                key={idx} 
                className="w-[260px] sm:w-[360px] mx-3 sm:mx-4 flex-shrink-0 glass-card rounded-2xl p-4 sm:p-6 hover:border-[var(--gold)]/30 transition-all duration-300"
              >
                <Quote className="w-8 h-8 text-[var(--gold)]/40 mb-4" />
                <p className="font-sans text-sm sm:text-base text-[var(--text)] leading-relaxed mb-6 italic">
                  &quot;{item.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg)] flex items-center justify-center border border-[var(--border)] overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.client} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-[var(--gold)]">{item.client ? item.client.charAt(0) : ''}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text)] text-sm">{item.client}</h4>
                    <p className="font-mono text-[10px] text-[var(--muted)] tracking-widest uppercase">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {googleReviewUrl && (
        <div className="text-center mt-12 sm:mt-16 z-10 relative reveal-elem">
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full font-mono text-[11px] tracking-widest uppercase bg-neutral-900/80 border border-neutral-800 text-[var(--gold)] hover:text-white hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            <svg className="w-3.5 h-3.5 fill-current text-[var(--gold)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.415 0-6.19-2.775-6.19-6.19s2.775-6.19 6.19-6.19c1.554 0 2.969.577 4.057 1.536l3.076-3.076C19.297 2.053 15.938 1 12.24 1 5.922 1 12.24s4.922 11.24 11.24 11.24c6.236 0 11.24-5.004 11.24-11.24 0-.792-.096-1.56-.276-2.28H12.24z"/>
            </svg>
            <span>Write a Review on Google</span>
          </a>
        </div>
      )}
    </section>
  );
}
