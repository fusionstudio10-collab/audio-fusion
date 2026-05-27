"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
    if (typeof window !== "undefined" && window.innerWidth < 1024) return; // Completely disable logic on mobile
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

export default function PosterGallery({ posters = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);
  
  // Physics & Drag state
  const ringRef = useRef(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);


  // Ensure enough items to form a ring
  const displayItems = posters.length < 5 ? [...posters, ...posters, ...posters].slice(0, 8) : posters;
  const autoRotateSpeed = 0.05;

  const radius = Math.max(350, displayItems.length * 45); 

  // Animation Loop for physics (momentum and auto-rotation)
  useEffect(() => {
    let animationFrameId;
    
    const updateRotation = () => {
      if (!isDraggingRef.current) {
        // Apply friction if there is velocity
        if (Math.abs(velocityRef.current) > 0.01) {
          velocityRef.current *= 0.95; // Friction
        } else {
          // If no velocity and no hover, auto rotate
          if (hoveredIndex === null) {
            velocityRef.current = autoRotateSpeed;
          } else {
            velocityRef.current = 0;
          }
        }
      }
      
      rotationRef.current += velocityRef.current;
      
      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
      }
      
      animationFrameId = requestAnimationFrame(updateRotation);
    };
    
    animationFrameId = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hoveredIndex]);

  if (!posters || posters.length === 0) return null;

  // Pointer Handlers for Dragging
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX || e.touches?.[0]?.clientX || 0;
    lastXRef.current = startXRef.current;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    
    if (ringRef.current) {
      ringRef.current.style.transition = 'none'; // Disable transition during drag
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const deltaX = clientX - lastXRef.current;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;
    
    // Convert drag pixels to rotation degrees
    const rotationDelta = deltaX * 0.2; 
    rotationRef.current += rotationDelta;
    
    if (ringRef.current) {
      ringRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
    }
    
    if (deltaTime > 0) {
      velocityRef.current = rotationDelta / (deltaTime / 16.66); // Normalized to 60fps
    }
    
    lastXRef.current = clientX;
    lastTimeRef.current = currentTime;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <section 
      id="posters" 
      className="py-20 sm:py-28 overflow-hidden relative z-10 flex flex-col items-center bg-[#070708] min-h-[90vh] justify-center touch-pan-y select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* TITLE */}
      <div className="absolute top-10 w-full text-center reveal-elem z-20 pointer-events-none">
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-[var(--neon-blue)]">
          Visual Assets
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl md:text-6xl font-black mt-2 text-white">
          Posters & Thumbnails
        </h2>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .carousel-scene {
          perspective: 2000px;
          width: 100%;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 50px;
        }
        .carousel-ring {
          position: relative;
          width: 300px;
          height: 400px;
          transform-style: preserve-3d;
        }
        .carousel-item {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
        }
        
        /* Aspect Ratio Logic */
        .type-poster {
          width: 300px;
          height: 300px; /* 1:1 */
          margin-top: 50px; /* Center align */
        }
        .type-thumbnail {
          width: 400px;
          height: 225px; /* 16:9 */
          margin-left: -50px; /* Adjust center */
          margin-top: 87.5px;
        }

        .carousel-card {
          width: 100%;
          height: 100%;
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: #121214;
          border: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: filter 0.6s ease, opacity 0.6s ease, box-shadow 0.5s ease;
        }
        
        .carousel-item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        
        .carousel-content {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
          color: white;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .carousel-card:hover .carousel-item-img {
          transform: scale(1.05);
        }
        .carousel-card:hover .carousel-content {
          opacity: 1;
          transform: translateY(0);
        }
        
        .carousel-ring.has-hover .carousel-item:not(.is-hovered) .carousel-card {
          filter: blur(6px) grayscale(50%) brightness(0.5);
          opacity: 0.4;
        }
        
        .carousel-ring.has-hover .carousel-item.is-hovered .carousel-card {
          box-shadow: 0 0 50px rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }
      `}} />

      <div className="carousel-scene pointer-events-none">
        <div ref={ringRef} className={`carousel-ring pointer-events-auto ${hoveredIndex !== null ? 'has-hover' : ''}`}>
          {displayItems.map((poster, index) => {
            const angle = (360 / displayItems.length) * index;
            const isHovered = hoveredIndex === index;
            const isPoster = poster.type === "poster" || !poster.type;
            
            return (
              <div
                key={`${poster.id}-${index}`}
                className={`carousel-item ${isHovered ? 'is-hovered' : ''}`}
                style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)` }}
                onMouseEnter={() => !isDraggingRef.current && setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={(e) => {
                  // Prevent opening if we were dragging
                  if (Math.abs(startXRef.current - e.clientX) < 5) {
                    setSelectedPoster(poster);
                  }
                }}
              >
                <div className="w-full h-full relative perspective-1000">
                  <TiltCard>
                    <div 
                      className={`carousel-card ${isPoster ? 'type-poster' : 'type-thumbnail'}`}
                      data-cursor
                      data-cursor-text="DRAG/CLICK"
                    >
                      <Image src={poster.imageUrl} alt={poster.title} fill sizes="(max-width: 768px) 100vw, 400px" className="carousel-item-img draggable-none" draggable={false} />
                      <div className="absolute inset-0 pointer-events-none rounded-[16px] border border-white/10 opacity-50 mix-blend-overlay"></div>
                      <div className="carousel-content">
                        <div className="text-[9px] uppercase tracking-widest text-white/50 mb-1">{poster.tag}</div>
                        <h3 className="text-xl font-bold font-sans tracking-tight leading-tight">{poster.title}</h3>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL POP-UP */}
      {selectedPoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedPoster(null)}></div>
          
          <div className="relative z-10 w-full max-w-4xl bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <button 
              onClick={() => setSelectedPoster(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className={`w-full relative min-h-[300px] ${selectedPoster.type === 'thumbnail' ? 'md:w-full min-h-[50vh]' : 'md:w-1/2 min-h-[70vh]'} bg-black flex items-center justify-center p-6`}>
              <Image 
                src={selectedPoster.imageUrl} 
                alt={selectedPoster.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`w-full object-contain ${selectedPoster.type === 'thumbnail' ? 'aspect-video' : 'aspect-square'} rounded-lg shadow-lg`}
              />
            </div>
            
            <div className={`w-full ${selectedPoster.type === 'thumbnail' ? 'hidden' : 'md:w-1/2'} p-8 md:p-12 flex flex-col justify-center`}>
              <div className="text-xs uppercase tracking-[4px] text-[var(--gold)] mb-4">{selectedPoster.tag}</div>
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)] italic mb-6 text-white leading-tight">
                {selectedPoster.title}
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                {selectedPoster.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
