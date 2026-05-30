"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Play, X, ChevronDown, Filter } from "lucide-react";
import audioEngine from "../app/lib/audioEngine";

function getYouTubeId(urlOrId) {
  if (!urlOrId) return "";
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = urlOrId.match(regExp);
  return (match && match[2].length === 11) ? match[2] : urlOrId;
}

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

export default function YoutubeShowcase({ videos = [], layout = "grid" }) {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isMounted, setIsMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Drag to scroll functionality for desktop
  const sliderRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeVideoId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeVideoId]);

  if (!videos || videos.length === 0) return null;

  // Extract all unique tags
  const allTags = ["All", ...new Set(
    videos
      .flatMap((v) => (v.tags || "").split(","))
      .map((t) => t.trim())
      .filter(Boolean)
  )];

  const filteredVideos = activeFilter === "All" 
    ? videos 
    : videos.filter((v) => 
        (v.tags || "").split(",").map(t => t.trim()).includes(activeFilter)
      );

  const handlePlay = (videoId) => {
    console.log("handlePlay called with videoId:", videoId);
    try {
      if (audioEngine && typeof audioEngine.playClick === "function") {
        audioEngine.playClick();
      }
    } catch (e) {
      console.warn("Audio engine play click failed:", e);
    }
    const cleanId = getYouTubeId(videoId);
    console.log("Parsed YouTube ID for iframe:", cleanId);
    setActiveVideoId(cleanId);
  };

  const closeVideo = () => {
    audioEngine.playClick();
    setActiveVideoId(null);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    isDownRef.current = true;
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
    hasMovedRef.current = false;
    sliderRef.current.style.cursor = "grabbing";
    sliderRef.current.style.userSelect = "none";
  };

  const handleMouseLeave = () => {
    if (!isDownRef.current) return;
    isDownRef.current = false;
    sliderRef.current.style.cursor = "grab";
    sliderRef.current.style.removeProperty("user-select");
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
    sliderRef.current.style.cursor = "grab";
    sliderRef.current.style.removeProperty("user-select");
  };

  const handleMouseMove = (e) => {
    if (!isDownRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // Scroll speed
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handlePlayClick = (e, videoId) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    handlePlay(videoId);
  };



  return (
    <section id="youtube-works" className="py-14 sm:py-20 md:py-28 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto relative z-10">
      {/* TITLE */}
      <div className="mb-12 sm:mb-20 text-center md:text-left reveal-elem">
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#ff0000]">
          Visuals & Films
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl md:text-6xl font-black mt-2">
          Featured Works
        </h2>
      </div>

      {/* FILTERS DROPDOWN */}
      {allTags.length > 1 && (
        <div className="relative mb-10 reveal-elem inline-block text-left z-20">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-[11px] tracking-widest uppercase bg-neutral-900/80 border border-neutral-800 text-white hover:border-[var(--gold)]/50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            <Filter className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Filter: <strong className="text-[var(--gold)] font-bold">{activeFilter}</strong></span>
            <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted)] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <>
              {/* Click outside backdrop */}
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setIsDropdownOpen(false)}
              />
              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-3 w-64 rounded-xl border border-neutral-800 bg-neutral-950/95 backdrop-blur-md p-2 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_30px_rgba(197,160,89,0.05)] z-40 animate-[fadeIn_0.2s_ease_forwards] origin-top-left">
                <div className="flex flex-col gap-1 max-h-72 overflow-y-auto custom-scrollbar">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setActiveFilter(tag);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg font-mono text-[10px] tracking-widest uppercase transition-colors ${
                        activeFilter === tag
                          ? "bg-[var(--gold)] text-black font-bold"
                          : "text-[var(--muted)] hover:text-white hover:bg-neutral-900"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* HORIZONTAL VIDEO CAROUSEL */}
      <div 
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: "grab" }}
        className="flex overflow-x-auto gap-4 sm:gap-10 pb-10 pt-4 px-4 -mx-4 custom-scrollbar snap-x snap-mandatory select-none"
      >
        {filteredVideos.map((vid) => (
          <div key={vid.id} className="relative aspect-video flex-none w-[75vw] sm:w-[500px] md:w-[600px] snap-center perspective-1000 reveal-elem select-none">
            <TiltCard>
              <div 
                className="group relative cursor-pointer overflow-hidden rounded-2xl glass-card border border-neutral-900 w-full h-full hover:border-[var(--gold)]/30 transition-all duration-500"
                onClick={(e) => handlePlayClick(e, vid.videoId)}
              >
                {/* THUMBNAIL */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${vid.thumbnail || `https://img.youtube.com/vi/${getYouTubeId(vid.videoId)}/maxresdefault.jpg`})` }}
                />
                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* PLAY BUTTON (CENTER) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center group-hover:bg-[#ff0000] group-hover:border-[#ff0000] group-hover:scale-110 transition-all duration-300">
                    <Play className="w-5 h-5 text-white ml-1 fill-white" />
                  </div>
                </div>

                {/* TITLE & TAGS */}
                <div className="absolute bottom-6 left-6 right-6">
                  {vid.tags && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {vid.tags.split(',').map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase border border-[var(--gold)]/30 text-[var(--gold)] rounded-sm bg-black/40 backdrop-blur-sm">
                          {tag.trim()}
                        </span>
                      ))}
                </div>
              )}
              <h3 className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl font-bold text-white tracking-wide group-hover:text-[var(--gold)] transition-colors line-clamp-2">
                {vid.title}
              </h3>
            </div>
          </div>
          </TiltCard>
          </div>
        ))}
      </div>

      {/* VIDEO MODAL */}
      {isMounted && activeVideoId && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-10 animate-[fadeIn_0.3s_ease_forwards]">
          <button 
            onClick={closeVideo}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-[#ff0000] transition-colors z-[10000]"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.15)] border border-neutral-800 animate-[scaleUp_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
