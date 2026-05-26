"use client";
import { useState, useEffect } from "react";
import audioEngine from "../app/lib/audioEngine";

export default function IntroSplash({ onEnter, logoText = "AUDIO FUSION", logoUrl = "/logo.jpg", tagline = "BUILT FOR THE CULTURE" }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Disable body scroll when loader is active
    document.body.classList.add("intro-active");

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        // Organic loading speed jumps
        const increment = Math.floor(Math.random() * 12) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleEnterClick = () => {
    setEntered(true);
    
    // 1. Initialize & trigger Web Audio engine
    audioEngine.init();
    audioEngine.playGlitch();
    audioEngine.startHiss();

    // 2. Fades out elements, then unlocks landing page scroll
    setTimeout(() => {
      document.body.classList.remove("intro-active");
      onEnter();
    }, 700);
  };

  if (entered && loadingProgress === 100) {
    // Return a dissolving viewport overlay during transition
    return (
      <div className="fixed inset-0 bg-[#070708] z-[99999] pointer-events-none transition-opacity duration-700 opacity-0" />
    );
  }

  return (
    <div 
      className={`fixed inset-0 bg-[#070708] z-[99998] flex flex-col items-center justify-center transition-all duration-700 ${
        entered ? "opacity-0 scale-95 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* SCANLINES & DIGITAL VHS NOISE */}
      <div className="vhs-scanlines absolute inset-0 pointer-events-none" />
      <div className="film-grain absolute inset-0 pointer-events-none" />

      {/* GLITCH SHADOW CONTAINER */}
      <div className="text-center relative z-20 px-6 max-w-lg">
        {/* VHS GLITCH CORNER TEXT */}
        <div className="absolute top-[-100px] left-[-30px] font-mono text-[9px] tracking-widest text-[var(--neon-green)] opacity-60 text-left">
          <div>PLAY ▶</div>
          <div>MODE: ANALOG TAPE</div>
          <div>AUDIO: COMPRESSED</div>
        </div>

        {logoUrl ? (
          <div className="w-40 h-40 mx-auto mb-6 relative flex items-center justify-center">
            <img
              src={logoUrl}
              alt={logoText}
              className="w-full h-full object-contain logo-gold-invert crt-screen"
            />
          </div>
        ) : (
          <h1 
            className="font-[family-name:var(--font-playfair)] italic font-black text-5xl md:text-7xl text-[var(--text)] tracking-tight uppercase crt-screen mb-3 select-none"
            style={{ textShadow: "2px 0 var(--neon-pink), -2px 0 var(--neon-blue)" }}
          >
            {logoText}
          </h1>
        )}
        
        <p className="font-[family-name:var(--font-syne)] text-[9px] tracking-[4px] uppercase text-[var(--muted)] mb-10 select-none">
          {tagline}
        </p>

        {/* PROGRESS BAR or BUTTON */}
        {!isLoaded ? (
          <div className="w-56 mx-auto">
            <div className="flex justify-between items-center text-[9px] font-mono text-[var(--muted)] mb-2 uppercase">
              <span>SYSTEM BOOTING...</span>
              <span>{loadingProgress}%</span>
            </div>
            <div className="h-[2px] w-full bg-neutral-900 overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] transition-all duration-150"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={handleEnterClick}
            data-cursor
            data-cursor-text="ENTER"
            className="group px-7 py-3 border border-[var(--text)] rounded-[4px] text-[11px] font-[family-name:var(--font-syne)] font-bold tracking-[3px] uppercase hover:bg-white hover:text-black transition-all duration-300 ease-out cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Enter Studio
          </button>
        )}
      </div>

      {/* FLOATING VINTAGE CRT SHADOW GRID */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#070708] opacity-80 pointer-events-none" />
    </div>
  );
}
