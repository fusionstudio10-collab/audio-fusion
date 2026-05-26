"use client";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

export default function PortfolioShowcase({ tracks = [], onTrackPlayChange }) {
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Cleanup audio element on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlayPause = (track) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (activeTrackId === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (onTrackPlayChange) onTrackPlayChange(false);
      } else {
        audioRef.current.play().catch((e) => console.log("Audio play blocked", e));
        setIsPlaying(true);
        if (onTrackPlayChange) onTrackPlayChange(true);
      }
    } else {
      // Stop previous
      audioRef.current.pause();
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setActiveTrackId(track.id);
          setIsPlaying(true);
          if (onTrackPlayChange) onTrackPlayChange(true);
        })
        .catch((e) => console.warn("Failed to play track:", e));
    }
  };

  // Attach ended listener whenever the active track changes — fixes stale closure
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setActiveTrackId(null);
      if (onTrackPlayChange) onTrackPlayChange(false);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [activeTrackId, onTrackPlayChange]);

  if (!tracks || tracks.length === 0) return null;

  return (
    <section id="showcase" className="py-28 px-6 md:px-16 max-w-6xl mx-auto relative z-10">
      {/* HEADER */}
      <div className="mb-20 text-center md:text-left reveal-elem">
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-[var(--neon-purple)]">
          Selected Showcase
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] italic text-5xl md:text-6xl font-black mt-2">
          Featured Works
        </h2>
      </div>

      {/* PORTFOLIO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {tracks.map((track) => {
          const isCurrent = activeTrackId === track.id;
          const isCurrentPlaying = isCurrent && isPlaying;

          return (
            <div
              key={track.id}
              className="group relative rounded-2xl overflow-hidden border border-neutral-900 bg-[var(--bg-card)] transition-all duration-500 hover:border-neutral-700"
            >
              {/* IMAGE / COVER CONTAINER */}
              <div 
                className="relative h-[340px] w-full overflow-hidden"
                data-cursor
                data-cursor-text={isCurrentPlaying ? "PAUSE" : "PLAY"}
                onClick={() => handlePlayPause(track)}
              >
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover grayscale contrast-110 brightness-75 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700 ease-out"
                />

                {/* PLAY / PAUSE FLOATING GLOW BUTTON */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/15 transition-colors duration-500">
                  <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-500 scale-90 group-hover:scale-100 ${
                      isCurrentPlaying
                        ? "bg-white text-black border-transparent shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                        : "bg-black/40 text-[#f3f3f0] border-neutral-700 group-hover:border-[#f3f3f0]"
                    }`}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-1" />
                    )}
                  </div>
                </div>

                {/* GENRE BADGE */}
                <span className="absolute bottom-6 left-6 font-mono text-[9px] tracking-widest text-[#f3f3f0] bg-neutral-950/70 border border-neutral-800 px-3 py-1 rounded-full uppercase">
                  {track.genre}
                </span>

                {/* VOL INDICATOR */}
                {isCurrentPlaying && (
                  <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-neutral-950/70 px-3 py-1.5 rounded-full border border-neutral-800 animate-pulse">
                    <Volume2 className="w-3.5 h-3.5 text-[var(--neon-purple)]" />
                    <span className="font-mono text-[8px] tracking-widest text-[var(--text)] uppercase">PLAYING</span>
                  </div>
                )}
              </div>

              {/* CARD DETAILS */}
              <div className="p-6 flex justify-between items-center bg-[var(--bg-card)]">
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] italic text-2xl font-bold text-[var(--text)]">
                    {track.title}
                  </h3>
                  <p className="font-[family-name:var(--font-syne)] text-[10px] tracking-wide text-[var(--muted)] uppercase mt-1">
                    BY {track.artist}
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
