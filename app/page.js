"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare, Send, X, Calendar, Mail, ArrowUpRight, MapPin, Menu
} from "lucide-react";

import { defaultConfig } from "./lib/defaultConfig";
import audioEngine from "./lib/audioEngine";

// Core Components
import CustomCursor from "../components/CustomCursor";
import InteractiveVisualizer from "../components/InteractiveVisualizer";
import IntroSplash from "../components/IntroSplash";
import FounderShowcase from "../components/FounderShowcase";
import ServicesList from "../components/ServicesList";
import BookingFlow from "../components/BookingFlow";
import PortfolioShowcase from "../components/PortfolioShowcase";

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [config, setConfig] = useState(null);
  const [isPlayingTrack, setIsPlayingTrack] = useState(false);
  const [preselectedService, setPreselectedService] = useState("");

  // Mobile nav
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey! 🎧 Manoj and Psyclone here (via our assistant). How can we help you create today? Ask us about recording, mixing/mastering, custom production, or bookings." }
  ]);
  const messagesEndRef = useRef(null);

  // Nav hide on scroll
  const [scrolledDown, setScrolledDown] = useState(false);
  const lastScroll = useRef(0);

  // Load configuration from localStorage (with defaultConfig as fallback)

  useEffect(() => {
    // Load fresh settings from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("audio_fusion_config");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const merged = { ...defaultConfig, ...parsed };
          setConfig(merged);
          if (merged.audios) audioEngine.updateUrls(merged.audios);
        } catch (e) {
          setConfig(defaultConfig);
        }
      } else {
        setConfig(defaultConfig);
        if (defaultConfig.audios) audioEngine.updateUrls(defaultConfig.audios);
      }
    }

    // Real-time sync if changed in another tab (Admin Panel)
    const handleStorageChange = (e) => {
      if (e.key === "audio_fusion_config") {
        if (e.newValue) {
          try {
            setConfig({ ...defaultConfig, ...JSON.parse(e.newValue) });
          } catch (err) {}
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Scroll handler
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll.current && currentScroll > 100) {
        setScrolledDown(true);
        setMobileMenuOpen(false);
      } else {
        setScrolledDown(false);
      }
      lastScroll.current = currentScroll;

      // Reveal animations
      const reveals = document.querySelectorAll(".reveal-elem");
      reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 80) el.classList.add("visible");
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    setTimeout(handleScroll, 800);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (hasEntered) {
      setTimeout(() => {
        document.querySelectorAll(".reveal-elem").forEach((el) => el.classList.add("visible"));
      }, 100);
    }
  }, [hasEntered]);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  if (!config) return null;

  const handleNavClick = () => {
    audioEngine.playClick();
    setMobileMenuOpen(false);
  };

  const handleBookClick = (serviceName) => {
    audioEngine.playClick();
    setPreselectedService(serviceName);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    audioEngine.playClick();

    const userMsg = chatInput.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      const input = userMsg.toLowerCase();
      let response = "";
      if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
        response = "Yo! Hope you're making hits. What service or project are we discussing today?";
      } else if (input.includes("price") || input.includes("rate") || input.includes("cost")) {
        response = `Humare rates clear hain. Standard slots ₹800/hr se start hote hain, Mix & Master packages ₹2000 se ₹7500 tak hain.`;
      } else if (input.includes("book") || input.includes("slot")) {
        response = `Session book karne ke liye niche Booking section mein date and time pick karein — WhatsApp pe direct connect ho jayega.`;
      } else if (input.includes("vocal") || input.includes("record") || input.includes("studio")) {
        response = `Humare paas high-end microphones (Neumann/Shure) aur premium analog preamps hain. Acoustically treated booth mein perfect recording hoti hai.`;
      } else if (input.includes("mix") || input.includes("master")) {
        response = `Manoj aur Psyclone hybrid analog/digital routing se tracks mix and master karte hain — Spotify-competitive loudness ke saath.`;
      } else if (input.includes("whatsapp") || input.includes("contact") || input.includes("number")) {
        response = `Directly contact karein: +91 ${config.whatsappNumber} — WhatsApp pe instant reply milega!`;
      } else {
        response = `Solid! Niche booking section mein date/time select karein aur request WhatsApp pe send ho jayegi. We reply instantly!`;
      }
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    }, 600);
  };

  const navLinks = [
    { id: "founders", label: "Founders" },
    { id: "showcase", label: "Showcase" },
    { id: "services", label: "Services" },
    { id: "booking", label: "Book" },
  ].filter((l) => config.sectionsOrder.includes(l.id));

  return (
    <>
      <CustomCursor />

      {/* BACKGROUND EFFECTS */}
      <div className="film-grain" />
      <div className="glow-container">
        <div className="glow-blob blob1" />
        <div className="glow-blob blob2" />
        <div className="glow-blob blob3" />
      </div>

      {/* INTRO SCREEN */}
      {!hasEntered && (
        <IntroSplash
          logoText={config.logoText}
          logoUrl={config.logoUrl || "/logo.jpg"}
          tagline={config.tagline.toUpperCase()}
          onEnter={() => setHasEntered(true)}
        />
      )}

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 bg-[#070708]/40 backdrop-blur-md border-b border-neutral-900/40 ${
          scrolledDown ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="flex items-center justify-between py-4 px-5 sm:px-8 md:px-16">
          {/* Logo */}
          <a
            href="#"
            onClick={handleNavClick}
            className="flex items-center gap-2.5 font-[family-name:var(--font-playfair)] italic text-lg sm:text-xl md:text-2xl font-black text-[var(--text)] tracking-tight hover:text-white transition-colors"
          >
            <img
              src={config.logoUrl || "/logo.jpg"}
              alt={config.name}
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain logo-gold-invert shrink-0"
            />
            <span className="hidden sm:inline">{config.name}</span>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex gap-8 lg:gap-10 items-center list-none text-[10px] font-[family-name:var(--font-syne)] font-bold tracking-[3px] uppercase">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={handleNavClick} className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/admin" className="px-3.5 py-1.5 border border-neutral-800 rounded hover:border-[var(--gold)] text-[var(--gold)] transition-colors">
                Admin
              </Link>
            </li>
          </ul>

          {/* Mobile: Admin + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/admin" className="px-3 py-1.5 border border-neutral-800 rounded text-[9px] font-bold tracking-widest uppercase text-[var(--gold)] hover:border-[var(--gold)] transition-colors">
              Admin
            </Link>
            <button
              onClick={() => { audioEngine.playClick(); setMobileMenuOpen(!mobileMenuOpen); }}
              className="p-1.5 text-[var(--muted)] hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? "max-h-64 border-t border-neutral-900/60" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col px-5 py-3 gap-1 bg-[#070708]/60 backdrop-blur-md">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={handleNavClick}
                  className="block py-3 text-[11px] font-bold tracking-[3px] uppercase text-[var(--muted)] hover:text-white transition-colors border-b border-neutral-900/40 last:border-0"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <main className={`transition-all duration-1000 ${hasEntered ? "opacity-100 filter-none" : "opacity-0 blur-md pointer-events-none"}`}>
        {config.sectionsOrder.map((sectionId) => {

          // ── HERO ──────────────────────────────────────────
          if (sectionId === "hero") {
            return (
              <section key="hero" className="min-h-[100svh] flex flex-col justify-end px-5 sm:px-8 md:px-16 pb-16 sm:pb-24 relative overflow-hidden pt-20">
                <InteractiveVisualizer isPlaying={isPlayingTrack} />

                {/* Hero intro — top right on desktop, center on mobile */}
                <div className="relative md:absolute md:top-1/2 md:-translate-y-1/2 md:right-16 max-w-full md:max-w-[360px] z-10 space-y-5 text-center md:text-left reveal-elem mb-8 md:mb-0">
                  <p className="font-[family-name:var(--font-instrument)] italic text-base sm:text-lg md:text-xl leading-relaxed text-[var(--muted)]">
                    {config.heroIntro}
                  </p>
                  <button
                    onClick={() => { audioEngine.playClick(); setIsChatOpen(true); }}
                    data-cursor data-cursor-text="CHAT"
                    className="inline-flex items-center gap-2 text-[var(--text)] font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[2px] uppercase border-b border-neutral-800 pb-1.5 hover:border-[var(--text)] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Consult 1:1 with us</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Big title */}
                <div className="relative z-10 text-center md:text-left reveal-elem">
                  <h1 className="font-[family-name:var(--font-playfair)] italic font-black text-[clamp(56px,14vw,220px)] leading-[0.85] tracking-[-2px] md:tracking-[-6px] select-none text-[var(--text)]">
                    <span className="block">Audio</span>
                    <span className="block text-glow" style={{ textShadow: "0 0 40px rgba(197, 160, 89, 0.15)" }}>Fusion</span>
                  </h1>
                </div>

                {/* Tagline */}
                <div className="flex flex-col md:flex-row items-center gap-6 mt-8 z-10 relative reveal-elem">
                  <p className="font-[family-name:var(--font-instrument)] italic text-lg sm:text-xl md:text-2xl text-[var(--muted)] max-w-lg leading-relaxed text-center md:text-left">
                    {config.tagline}
                  </p>
                  <div className="hidden md:flex items-center gap-3 text-[10px] tracking-[3px] uppercase text-[var(--muted)] ml-auto font-bold font-[family-name:var(--font-syne)]">
                    <div className="w-[60px] h-[1px] bg-neutral-800" />
                    <span>Scroll To Fusion</span>
                  </div>
                </div>
              </section>
            );
          }

          // ── FOUNDERS ──────────────────────────────────────
          if (sectionId === "founders") return <FounderShowcase key="founders" founders={config.founders} />;

          // ── SHOWCASE ──────────────────────────────────────
          if (sectionId === "showcase") return (
            <PortfolioShowcase key="showcase" tracks={config.portfolio} onTrackPlayChange={(p) => setIsPlayingTrack(p)} />
          );

          // ── SERVICES ──────────────────────────────────────
          if (sectionId === "services") return (
            <ServicesList key="services" services={config.services} onBookClick={handleBookClick} />
          );

          // ── BOOKING ───────────────────────────────────────
          if (sectionId === "booking") return (
            <BookingFlow key="booking" services={config.services} preselectedService={preselectedService} whatsappNumber={config.whatsappNumber} />
          );

          // ── CONTACT / FOOTER ──────────────────────────────
          if (sectionId === "contact") {
            return (
              <footer key="contact" className="bg-[#0b0b0d]/50 border-t border-neutral-900 pt-16 sm:pt-24 px-5 sm:px-8 md:px-16 pb-10 z-10 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-12 lg:mb-16">
                  {/* Left columns */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
                    <div>
                      <h2 className="font-[family-name:var(--font-playfair)] italic text-2xl sm:text-3xl font-black mb-4 text-[var(--text)]">
                        {config.name}
                      </h2>
                      <p className="font-[family-name:var(--font-instrument)] italic text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                        {config.philosophy}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[3px] uppercase mb-5 text-[var(--text)]">
                        Connect
                      </h4>
                      <ul className="space-y-3 font-[family-name:var(--font-syne)] text-xs text-[var(--muted)]">
                        <li>
                          <a href={`mailto:${config.email}`} className="hover:text-[var(--text)] transition-colors flex items-center gap-2 break-all">
                            <Mail className="w-4 h-4 shrink-0" /> {config.email}
                          </a>
                        </li>
                        <li>
                          <a href={`https://wa.me/91${config.whatsappNumber}`} target="_blank" rel="noreferrer" className="hover:text-[var(--text)] transition-colors flex items-center gap-2">
                            <span>WhatsApp:</span> <span className="font-mono">+91 {config.whatsappNumber}</span>
                          </a>
                        </li>
                        {config.address && (
                          <li className="flex items-start gap-2 pt-2 border-t border-neutral-900/40">
                            <MapPin className="w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0" />
                            <span className="leading-relaxed">{config.address}</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[3px] uppercase mb-5 text-[var(--text)]">
                        Studio Hours
                      </h4>
                      <p className="font-[family-name:var(--font-instrument)] italic text-sm sm:text-[15px] text-[var(--muted)] leading-relaxed">
                        Studio operates 24/7 for booked recording slots. Consultations by appointment only.
                      </p>
                    </div>
                  </div>

                  {/* Map — full width on mobile, right column on desktop */}
                  <div className="lg:col-span-4 h-52 sm:h-64 lg:h-auto min-h-[200px] rounded-xl overflow-hidden glass-card border border-neutral-900/80 relative">
                    <iframe
                      src={config.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8415310045903!2d72.8459459!3d19.0707038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf6c4d6687b1%3A0xde402a14d945d596!2sAudio%20Fusion%20Studio!5e0!3m2!1sen!2sin!4v1716762391000!5m2!1sen!2sin"}
                      className="w-full h-full border-0 grayscale invert contrast-[1.2] opacity-60 hover:opacity-100 hover:grayscale-0 hover:invert-0 transition-all duration-700"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Audio Fusion Studio Location"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center border-t border-neutral-900/60 pt-8 text-[9px] font-mono tracking-widest text-[var(--muted)] uppercase gap-3">
                  <p>© 2026 {config.name} Studio. All Rights Reserved.</p>
                  <p>Y2K Glitch Engine // Built by Antigravity</p>
                </div>
              </footer>
            );
          }

          // ── CUSTOM SECTIONS ───────────────────────────────
          if (sectionId.startsWith("custom-")) {
            const customSec = config.customSections?.find((s) => s.id === sectionId);
            if (!customSec) return null;

            if (customSec.layout === "text-only") {
              return (
                <section key={customSec.id} id={customSec.id} className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-5xl mx-auto reveal-elem">
                  <span className="text-[10px] tracking-[4px] uppercase font-bold text-[var(--gold)] mb-3 block font-[family-name:var(--font-syne)]">{customSec.subtitle}</span>
                  <h2 className="font-[family-name:var(--font-playfair)] italic text-3xl sm:text-4xl md:text-6xl font-black mb-8 leading-tight text-white">{customSec.title}</h2>
                  <p className="font-[family-name:var(--font-instrument)] italic text-base sm:text-lg md:text-2xl text-[var(--muted)] leading-relaxed whitespace-pre-line">{customSec.content}</p>
                </section>
              );
            }

            if (customSec.layout === "cards-grid") {
              return (
                <section key={customSec.id} id={customSec.id} className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-6xl mx-auto reveal-elem">
                  <span className="text-[10px] tracking-[4px] uppercase font-bold text-[var(--gold)] mb-3 block font-[family-name:var(--font-syne)]">{customSec.subtitle}</span>
                  <h2 className="font-[family-name:var(--font-playfair)] italic text-3xl sm:text-4xl md:text-6xl font-black mb-8 sm:mb-12 leading-tight text-white">{customSec.title}</h2>
                  {customSec.content && <p className="font-[family-name:var(--font-instrument)] italic text-base sm:text-lg text-[var(--muted)] mb-8 sm:mb-12 leading-relaxed max-w-3xl">{customSec.content}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {customSec.items?.map((item, idx) => (
                      <div key={idx} className="p-6 sm:p-8 glass-card border border-neutral-900/60 rounded-2xl space-y-4 hover:border-[var(--gold)]/25 transition-all duration-300">
                        <h3 className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl font-bold text-white">{item.title}</h3>
                        <p className="font-[family-name:var(--font-instrument)] italic text-sm sm:text-base text-[var(--muted)] leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (customSec.layout === "split-image-text") {
              return (
                <section key={customSec.id} id={customSec.id} className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-6xl mx-auto reveal-elem">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    <div className="lg:col-span-7 space-y-5">
                      <span className="text-[10px] tracking-[4px] uppercase font-bold text-[var(--gold)] block font-[family-name:var(--font-syne)]">{customSec.subtitle}</span>
                      <h2 className="font-[family-name:var(--font-playfair)] italic text-3xl sm:text-4xl md:text-6xl font-black leading-tight text-white">{customSec.title}</h2>
                      <p className="font-[family-name:var(--font-instrument)] italic text-base sm:text-lg md:text-xl text-[var(--muted)] leading-relaxed whitespace-pre-line">{customSec.content}</p>
                    </div>
                    <div className="lg:col-span-5 space-y-4">
                      {customSec.items?.map((item, idx) => (
                        <div key={idx} className="p-5 sm:p-6 bg-neutral-950/20 border border-neutral-900/50 rounded-xl hover:border-[var(--gold)]/20 transition-colors">
                          <h4 className="font-bold text-xs uppercase text-[var(--gold)] tracking-wider mb-2">{item.title}</h4>
                          <p className="text-xs text-[var(--muted)] leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }
          }

          return null;
        })}
      </main>

      {/* ── CHAT TOGGLE BUTTON ──────────────────────────── */}
      {hasEntered && !isChatOpen && (
        <button
          onClick={() => { audioEngine.playClick(); setIsChatOpen(true); }}
          data-cursor data-cursor-text="CHAT"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[1000] w-12 h-12 sm:w-14 sm:h-14 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform cursor-pointer"
          aria-label="Open chat"
        >
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
        </button>
      )}

      {/* ── CHAT PANEL ──────────────────────────────────── */}
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[2000] w-full sm:w-[380px] h-[85svh] sm:h-[500px] rounded-t-2xl sm:rounded-2xl overflow-hidden glass-card border border-neutral-800 flex flex-col shadow-[0_12px_40px_rgba(0,0,0,0.8)] animate-[fadeIn_0.3s_ease_forwards]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-900 bg-neutral-950/60 flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-[family-name:var(--font-playfair)] italic text-base sm:text-lg font-bold text-[var(--text)]">
                Audio Fusion Bot
              </h3>
              <p className="text-[8px] font-mono text-[var(--neon-green)] tracking-widest uppercase mt-0.5">ONLINE // 24/7 SUPPORT</p>
            </div>
            <button onClick={() => { audioEngine.playClick(); setIsChatOpen(false); }} className="text-[var(--muted)] hover:text-white transition-colors p-1" aria-label="Close chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4 bg-neutral-950/20">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] p-3 sm:p-3.5 rounded-xl text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[var(--text)] text-black font-semibold ml-auto rounded-tr-none"
                    : "bg-neutral-900/80 text-[var(--text)] border border-neutral-800/40 mr-auto rounded-tl-none"
                }`}
              >
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-neutral-900 bg-neutral-950/40 flex gap-2 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
              placeholder="Ask us a question..."
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--gold)] min-w-0"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={!chatInput.trim()}
              className="w-10 h-10 rounded-lg bg-[var(--text)] text-black flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
