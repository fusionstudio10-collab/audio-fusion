"use client";
import { useState, useRef, useEffect } from "react";
import { Play, X } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import audioEngine from "../app/lib/audioEngine";

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

export default function YoutubeShowcase({ videos = [] }) {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

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
    audioEngine.playClick();
    setActiveVideoId(videoId);
  };

  const closeVideo = () => {
    audioEngine.playClick();
    setActiveVideoId(null);
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

      {/* FILTERS */}
      {allTags.length > 1 && (
        <div className="flex overflow-x-auto gap-3 mb-10 pb-4 custom-scrollbar snap-x reveal-elem">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase transition-colors snap-start ${
                activeFilter === tag
                  ? "bg-[var(--gold)] text-black font-bold shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                  : "bg-neutral-900/50 text-[var(--muted)] border border-neutral-800 hover:border-neutral-600 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* HORIZONTAL VIDEO CAROUSEL */}
      <div className="flex overflow-x-auto gap-4 sm:gap-10 pb-10 pt-4 px-4 -mx-4 custom-scrollbar snap-x snap-mandatory">
        {filteredVideos.map((vid) => (
          <div key={vid.id} className="relative aspect-video flex-none w-[75vw] sm:w-[500px] md:w-[600px] snap-center perspective-1000 reveal-elem">
            <TiltCard>
              <div 
                className="group relative cursor-pointer overflow-hidden rounded-2xl glass-card border border-neutral-900 w-full h-full hover:border-[var(--gold)]/30 transition-all duration-500"
                onClick={() => handlePlay(vid.videoId)}
              >
                {/* THUMBNAIL */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${vid.thumbnail || `https://img.youtube.com/vi/${vid.videoId}/maxresdefault.jpg`})` }}
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
      {activeVideoId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-10 animate-[fadeIn_0.3s_ease_forwards]">
          <button 
            onClick={closeVideo}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-[#ff0000] transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.15)] border border-neutral-800">
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
        </div>
      )}
    </section>
  );
}
