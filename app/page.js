"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare, Send, X, Calendar, Mail, ArrowUpRight, MapPin, Menu
} from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

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
import YoutubeShowcase from "../components/YoutubeShowcase";
import PosterGallery from "../components/PosterGallery";
import TestimonialMarquee from "../components/TestimonialMarquee";

const SectionWrapper = ({ id, bgConfig, animation = "fade-slide", children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  let initial = { opacity: 0, y: 40 };
  let whileInView = { opacity: 1, y: 0 };
  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

  if (animation === "fade-only") {
    initial = { opacity: 0 };
    whileInView = { opacity: 1 };
  } else if (animation === "scale-up") {
    initial = { opacity: 0, scale: 0.9 };
    whileInView = { opacity: 1, scale: 1 };
  } else if (animation === "slide-left") {
    initial = { opacity: 0, x: -60 };
    whileInView = { opacity: 1, x: 0 };
  } else if (animation === "slide-right") {
    initial = { opacity: 0, x: 60 };
    whileInView = { opacity: 1, x: 0 };
  } else if (animation === "perspective-3d") {
    initial = { opacity: 0, rotateX: 20, y: 60 };
    whileInView = { opacity: 1, rotateX: 0, y: 0 };
  }

  return (
    <div id={`wrapper-${id}`} ref={ref} className="relative w-full overflow-hidden" style={{ perspective: 1200 }}>
      {/* Background Layer (Fixed to this container with Parallax) */}
      {bgConfig && bgConfig.type !== "color" && bgConfig.url && (
        <motion.div className="absolute inset-0 w-full h-full pointer-events-none" style={{ y, zIndex: 0 }}>
          {bgConfig.type === "video" ? (
            <video src={bgConfig.url} autoPlay loop muted playsInline className="w-full h-full object-cover scale-[1.3] filter brightness-75" />
          ) : (
            <img src={bgConfig.url} alt="" className="w-full h-full object-cover scale-[1.3] filter brightness-75" />
          )}
        </motion.div>
      )}
      
      {/* Dark Overlay Layer */}
      {bgConfig && bgConfig.type !== "color" && (
        <div className="absolute inset-0 bg-[#070708] pointer-events-none" style={{ opacity: bgConfig.overlayOpacity || 0.6, zIndex: 1 }} />
      )}
      
      {/* Content Layer with Entry Animation */}
      <motion.div
        initial={initial}
        whileInView={whileInView}
        viewport={{ once: true, margin: "-100px" }}
        transition={transition}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

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

function CustomAccordionItem({ title, desc, hasLink, linkUrl, buttonText }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <span className="font-[family-name:var(--font-playfair)] italic text-lg sm:text-2xl font-bold text-white group-hover:text-[var(--gold)] transition-colors">
          {title}
        </span>
        <span className="text-[var(--gold)] text-xl transition-transform duration-300 font-mono">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="pb-4 pr-8 space-y-4">
          <p className="font-sans text-sm sm:text-base text-[var(--muted)] leading-relaxed whitespace-pre-line">
            {desc}
          </p>
          {hasLink && (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              data-cursor-text={buttonText || "INQUIRE"}
              className="inline-block py-2.5 px-6 bg-[var(--bg)] border border-neutral-800 rounded text-[10px] font-[family-name:var(--font-syne)] font-bold tracking-[2px] uppercase hover:bg-[var(--text)] hover:text-black hover:border-transparent transition-all duration-300 cursor-pointer"
            >
              {buttonText || "Inquire"}
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

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

  useEffect(() => {
    // Load fresh settings from database
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const fetched = await res.json();
          const merged = { 
            ...defaultConfig, 
            ...fetched,
            sectionLayouts: {
              ...(defaultConfig.sectionLayouts || {}),
              ...(fetched.sectionLayouts || {})
            },
            sectionAnimations: {
              ...(defaultConfig.sectionAnimations || {}),
              ...(fetched.sectionAnimations || {})
            },
            theme: {
              ...(defaultConfig.theme || {}),
              ...(fetched.theme || {})
            },
            sectionBackgrounds: {
              ...(defaultConfig.sectionBackgrounds || {}),
              ...(fetched.sectionBackgrounds || {})
            }
          };
          setConfig(merged);
          if (merged.audios) audioEngine.updateUrls(merged.audios);
        } else {
          throw new Error("Failed response");
        }
      } catch (err) {
        console.error("Database fetch failed:", err);
        setConfig(defaultConfig);
        if (defaultConfig.audios) audioEngine.updateUrls(defaultConfig.audios);
      }
    };
    
    fetchConfig();

    // Real-time sync if changed in another tab (Admin Panel)
    const handleStorageChange = (e) => {
      if (e.key === "audio_fusion_config") {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            const merged = { 
              ...defaultConfig, 
              ...parsed,
              sectionLayouts: {
                ...(defaultConfig.sectionLayouts || {}),
                ...(parsed.sectionLayouts || {})
              },
              sectionAnimations: {
                ...(defaultConfig.sectionAnimations || {}),
                ...(parsed.sectionAnimations || {})
              },
              theme: {
                ...(defaultConfig.theme || {}),
                ...(parsed.theme || {})
              },
              sectionBackgrounds: {
                ...(defaultConfig.sectionBackgrounds || {}),
                ...(parsed.sectionBackgrounds || {})
              }
            };
            setConfig(merged);
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

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K) to open chat
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsChatOpen((prev) => !prev);
        if (!isChatOpen) audioEngine.playClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatOpen]);

  if (!config) return null;

  const handleNavClick = () => {
    audioEngine.playClick();
    setMobileMenuOpen(false);
  };

  const handleBookClick = (serviceName) => {
    if (audioEngine && audioEngine.playClick) {
      try { audioEngine.playClick(); } catch(e) {}
    }
    setPreselectedService(serviceName);
    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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

  // We will map over these section IDs to preserve user-defined background ordering
  // (Assuming sectionOrder comes from config or is hardcoded here).
  const sectionOrder = [
    "hero", "founders", "posters", "showcase", "youtube-works", "services", "testimonials", "booking", "contact"
  ];

  const navLinks = [
    { id: "founders", label: "Founders" },
    { id: "showcase", label: "Showcase" },
    { id: "services", label: "Services" },
    { id: "booking", label: "Book" },
  ].filter((l) => config.sectionsOrder.includes(l.id));

  return (
    <>
      <CustomCursor />
      {config.theme && (
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg: ${config.theme.bg || "#070708"};
            --gold: ${config.theme.gold || "#c5a059"};
            --neon-blue: ${config.theme.neonBlue || "#e2c074"};
            --text: ${config.theme.text || "#f5f3ef"};
            --muted: ${config.theme.muted || "#8e8b82"};
            --border: color-mix(in srgb, var(--gold) 8%, transparent);
          }
        `}} />
      )}


      {/* GLOBAL PROMO BANNER */}
      {config.globalDiscount?.active && hasEntered && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-[var(--gold)] text-[#070708] py-2 px-4 text-center font-[family-name:var(--font-syne)] text-[10px] sm:text-xs font-bold tracking-[2px] uppercase flex justify-center items-center gap-3">
          <span>{config.globalDiscount.bannerText}</span>
        </div>
      )}

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
                <a href={`#${l.id}`} onClick={handleNavClick} className="text-[var(--muted)] hover:text-[var(--text)] transition-colors hover-underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile: Hamburger */}
          <div className="flex md:hidden items-center gap-3">
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

          let sectionContent = null;

          // ── HERO ──────────────────────────────────────────
          if (sectionId === "hero") {
            sectionContent = (
              <section key="hero" id="hero" className="min-h-[100svh] flex flex-col justify-end px-4 sm:px-8 md:px-16 pb-12 sm:pb-24 relative overflow-hidden pt-20">
                <InteractiveVisualizer isPlaying={isPlayingTrack} />

                {/* Hero intro — top right on desktop, center on mobile */}
                <div className="relative md:absolute md:top-1/2 md:-translate-y-1/2 md:right-16 max-w-full md:max-w-[360px] z-10 space-y-5 text-center md:text-left reveal-elem mb-8 md:mb-0">
                  <p className="font-sans text-base sm:text-lg md:text-xl leading-relaxed text-[var(--muted)]">
                    {config.heroIntro}
                  </p>
                </div>

                {/* Big title */}
                <div className="relative z-10 text-center md:text-left reveal-elem">
                  <h1 className="font-[family-name:var(--font-playfair)] italic font-black text-[clamp(48px,13vw,220px)] leading-[0.85] tracking-[-2px] md:tracking-[-6px] select-none text-[var(--text)]">
                    <span className="block">Audio</span>
                    <span className="block text-glow" style={{ textShadow: "0 0 40px rgba(197, 160, 89, 0.15)" }}>Fusion</span>
                  </h1>
                </div>

                {/* Tagline */}
                <div className="flex flex-col md:flex-row items-center gap-6 mt-8 z-10 relative reveal-elem">
                  <p className="font-sans text-lg sm:text-xl md:text-xl text-[var(--muted)] max-w-lg leading-relaxed text-center md:text-left font-medium tracking-wide">
                    {config.tagline || 'Your design-led audio co-founder. Hands-on. With No Overhead.'}
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
          else if (sectionId === "founders") {
            sectionContent = <FounderShowcase key="founders" founders={config.founders} layout={config.sectionLayouts?.founders} />;
          }
          // ── POSTERS ─────────────────────────────────────────
          else if (sectionId === "posters") {
            sectionContent = <PosterGallery key="posters" posters={config.posters} layout={config.sectionLayouts?.posters} />;
          }
          // ── PORTFOLIO / SHOWCASE ──────────────────────────────────────
          else if (sectionId === "showcase") {
            sectionContent = <PortfolioShowcase key="showcase" tracks={config.portfolio} onTrackPlayChange={(p) => setIsPlayingTrack(p)} />;
          }
          // ── YOUTUBE WORKS ─────────────────────────────────
          else if (sectionId === "youtube-works" && config.youtubeWorks && config.youtubeWorks.length > 0) {
            sectionContent = <YoutubeShowcase key="youtube-works" videos={config.youtubeWorks} layout={config.sectionLayouts?.["youtube-works"]} />;
          }
          // ── SERVICES ──────────────────────────────────────
          else if (sectionId === "services") {
            sectionContent = <ServicesList key="services" services={config.services} onBookClick={handleBookClick} whatsappNumber={config.whatsappNumber} layout={config.sectionLayouts?.services} />;
          }
          // ── TESTIMONIALS ──────────────────────────────────
          else if (sectionId === "testimonials" && config.testimonials && config.testimonials.length > 0) {
            sectionContent = <TestimonialMarquee key="testimonials" testimonials={config.testimonials} layout={config.sectionLayouts?.testimonials} />;
          }
          // ── BOOKING ───────────────────────────────────────
          else if (sectionId === "booking") {
            sectionContent = (
              <BookingFlow 
                key="booking" 
                services={config.services} 
                preselectedService={preselectedService} 
                whatsappNumber={config.whatsappNumber} 
                globalDiscount={config.globalDiscount}
              />
            );
          }
          
          // ── CONTACT / FOOTER ──────────────────────────────
          else if (sectionId === "contact") {
            sectionContent = (
              <footer key="contact" className="bg-[#0b0b0d]/50 border-t border-neutral-900 pt-16 sm:pt-24 px-5 sm:px-8 md:px-16 pb-10 z-10 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-16 mb-12 lg:mb-16">
                  {/* Left columns */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
                    <div>
                      <h2 className="font-[family-name:var(--font-playfair)] italic text-2xl sm:text-3xl font-black mb-4 text-[var(--text)]">
                        {config.name}
                      </h2>
                      <p className="font-sans text-sm sm:text-base text-[var(--muted)] leading-relaxed">
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
                      <p className="font-sans text-sm sm:text-[15px] text-[var(--muted)] leading-relaxed">
                        Studio operates 24/7 for booked recording slots. Consultations by appointment only.
                      </p>
                    </div>
                  </div>

                  {/* Map — full width on mobile, right column on desktop */}
                  <div className="lg:col-span-4 h-52 sm:h-64 lg:h-auto min-h-[200px] rounded-xl overflow-hidden glass-card border border-neutral-900/80 relative">
                    <iframe
                      src={
                        config.mapUrl
                          ? (config.mapUrl.match(/src="([^"]+)"/) ? config.mapUrl.match(/src="([^"]+)"/)[1] : config.mapUrl)
                          : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8415310045903!2d72.8459459!3d19.0707038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf6c4d6687b1%3A0xde402a14d945d596!2sAudio%20Fusion%20Studio!5e0!3m2!1sen!2sin!4v1716762391000!5m2!1sen!2sin"
                      }
                      className="w-full h-full border-0 grayscale invert contrast-[1.2] opacity-60 hover:opacity-100 hover:grayscale-0 hover:invert-0 transition-all duration-700"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Audio Fusion Studio Location"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center border-t border-neutral-900/60 pt-8 text-[9px] font-mono tracking-widest text-[var(--muted)] uppercase gap-3">
                  <p>© 2026 {config.name} Studio. All Rights Reserved.</p>
                </div>
              </footer>
            );
          }

          // ── CUSTOM SECTIONS ───────────────────────────────
          else if (sectionId.startsWith("custom-")) {
            const customSec = config.customSections?.find((s) => s.id === sectionId);
            if (customSec) {
              if (customSec.layout === "text-only") {
                sectionContent = (
                  <section key={customSec.id} id={customSec.id} className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-5xl mx-auto reveal-elem">
                    <span className="text-[10px] tracking-[4px] uppercase font-bold text-[var(--gold)] mb-3 block font-[family-name:var(--font-syne)]">{customSec.subtitle}</span>
                    <h2 className="font-[family-name:var(--font-playfair)] italic text-3xl sm:text-4xl md:text-6xl font-black mb-8 leading-tight text-white">{customSec.title}</h2>
                    <p className="font-sans text-base sm:text-lg md:text-2xl text-[var(--muted)] leading-relaxed whitespace-pre-line">{customSec.content}</p>
                  </section>
                );
              } else if (customSec.layout === "cards-grid") {
                sectionContent = (
                  <section key={customSec.id} id={customSec.id} className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-6xl mx-auto reveal-elem">
                    <span className="text-[10px] tracking-[4px] uppercase font-bold text-[var(--gold)] mb-3 block font-[family-name:var(--font-syne)]">{customSec.subtitle}</span>
                    <h2 className="font-[family-name:var(--font-playfair)] italic text-3xl sm:text-4xl md:text-6xl font-black mb-8 sm:mb-12 leading-tight text-white">{customSec.title}</h2>
                    {customSec.content && <p className="font-sans text-base sm:text-lg text-[var(--muted)] mb-8 sm:mb-12 leading-relaxed max-w-3xl">{customSec.content}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                      {customSec.items?.map((item, idx) => {
                        const hasLink = item.showInquire || item.link;
                        const linkUrl = item.showInquire
                          ? `https://wa.me/91${(config.whatsappNumber || "7738882899").replace(/\D/g, "")}?text=${encodeURIComponent(`Hi! I want to inquire about *${item.title}* from your website.`)}`
                          : item.link;

                        return (
                          <div key={idx} className="relative w-full h-full" style={{ perspective: 1500 }}>
                            <TiltCard>
                              <div 
                                data-cursor={!hasLink ? "" : undefined}
                                data-cursor-text={!hasLink ? "VIEW" : undefined}
                                className="p-6 sm:p-8 glass-card border border-neutral-900/60 rounded-2xl flex flex-col justify-between hover:border-[var(--gold)]/30 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(197,160,89,0.03)] transition-all duration-500 ease-out h-full min-h-[220px]"
                              >
                                <div className="space-y-4 mb-6">
                                  <h3 className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl font-bold text-white">{item.title}</h3>
                                  <p className="font-sans text-sm sm:text-base text-[var(--muted)] leading-relaxed whitespace-pre-line">{item.desc}</p>
                                </div>
                                
                                {hasLink && (
                                  <a
                                    href={linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-cursor
                                    data-cursor-text={item.buttonText || "INQUIRE"}
                                    className="w-full mt-auto py-3 bg-[var(--bg)] border border-neutral-800 rounded text-[11px] font-[family-name:var(--font-syne)] font-bold tracking-[2px] uppercase hover:bg-[var(--text)] hover:text-black hover:border-transparent transition-all duration-300 cursor-pointer text-center block relative z-20 pointer-events-auto"
                                  >
                                    {item.buttonText || "Inquire"}
                                  </a>
                                )}
                              </div>
                            </TiltCard>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              } else if (customSec.layout === "split-image-text") {
                sectionContent = (
                  <section key={customSec.id} id={customSec.id} className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-6xl mx-auto reveal-elem">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                      <div className="lg:col-span-7 space-y-5">
                        <span className="text-[10px] tracking-[4px] uppercase font-bold text-[var(--gold)] block font-[family-name:var(--font-syne)]">{customSec.subtitle}</span>
                        <h2 className="font-[family-name:var(--font-playfair)] italic text-3xl sm:text-4xl md:text-6xl font-black leading-tight text-white">{customSec.title}</h2>
                        <p className="font-sans text-base sm:text-lg md:text-xl text-[var(--muted)] leading-relaxed whitespace-pre-line">{customSec.content}</p>
                      </div>
                      <div className="lg:col-span-5 space-y-4">
                        {customSec.items?.map((item, idx) => {
                          const hasLink = item.showInquire || item.link;
                          const linkUrl = item.showInquire
                            ? `https://wa.me/91${(config.whatsappNumber || "7738882899").replace(/\D/g, "")}?text=${encodeURIComponent(`Hi! I want to inquire about *${item.title}* from your website.`)}`
                            : item.link;

                          return (
                            <div key={idx} className="relative w-full h-full" style={{ perspective: 1500 }}>
                              <TiltCard>
                                <div 
                                  data-cursor={!hasLink ? "" : undefined}
                                  data-cursor-text={!hasLink ? "VIEW" : undefined}
                                  className="p-5 sm:p-6 bg-neutral-950/20 border border-neutral-900/50 rounded-xl flex flex-col justify-between hover:border-[var(--gold)]/30 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-500 ease-out"
                                >
                                  <div className="mb-3">
                                    <h4 className="font-bold text-xs uppercase text-[var(--gold)] tracking-wider mb-2">{item.title}</h4>
                                    <p className="text-xs text-[var(--muted)] leading-relaxed">{item.desc}</p>
                                  </div>
                                  
                                  {hasLink && (
                                    <a
                                      href={linkUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      data-cursor
                                      data-cursor-text={item.buttonText || "INQUIRE"}
                                      className="w-full mt-2 py-2 bg-[var(--bg)] border border-neutral-800 rounded text-[9px] font-[family-name:var(--font-syne)] font-bold tracking-[1.5px] uppercase hover:bg-[var(--text)] hover:text-black hover:border-transparent transition-all duration-300 cursor-pointer text-center block relative z-20 pointer-events-auto"
                                    >
                                      {item.buttonText || "Inquire"}
                                    </a>
                                  )}
                                </div>
                              </TiltCard>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              } else if (customSec.layout === "accordion") {
                sectionContent = (
                  <section key={customSec.id} id={customSec.id} className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-4xl mx-auto reveal-elem">
                    <span className="text-[10px] tracking-[4px] uppercase font-bold text-[var(--gold)] mb-3 block font-[family-name:var(--font-syne)]">{customSec.subtitle}</span>
                    <h2 className="font-[family-name:var(--font-playfair)] italic text-3xl sm:text-4xl md:text-6xl font-black mb-8 sm:mb-12 leading-tight text-white">{customSec.title}</h2>
                    {customSec.content && <p className="font-sans text-base sm:text-lg text-[var(--muted)] mb-8 sm:mb-12 leading-relaxed max-w-3xl">{customSec.content}</p>}
                    <div className="border-t border-neutral-900/60 divide-y divide-neutral-900/60">
                      {customSec.items?.map((item, idx) => {
                        const hasLink = item.showInquire || item.link;
                        const linkUrl = item.showInquire
                          ? `https://wa.me/91${(config.whatsappNumber || "7738882899").replace(/\D/g, "")}?text=${encodeURIComponent(`Hi! I want to inquire about *${item.title}* from your website.`)}`
                          : item.link;

                        return (
                          <CustomAccordionItem 
                            key={idx}
                            title={item.title}
                            desc={item.desc}
                            hasLink={hasLink}
                            linkUrl={linkUrl}
                            buttonText={item.buttonText}
                          />
                        );
                      })}
                    </div>
                  </section>
                );
              } else if (customSec.layout === "carousel") {
                sectionContent = (
                  <section key={customSec.id} id={customSec.id} className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-6xl mx-auto reveal-elem">
                    <span className="text-[10px] tracking-[4px] uppercase font-bold text-[var(--gold)] mb-3 block font-[family-name:var(--font-syne)]">{customSec.subtitle}</span>
                    <h2 className="font-[family-name:var(--font-playfair)] italic text-3xl sm:text-4xl md:text-6xl font-black mb-8 sm:mb-12 leading-tight text-white">{customSec.title}</h2>
                    {customSec.content && <p className="font-sans text-base sm:text-lg text-[var(--muted)] mb-8 sm:mb-12 leading-relaxed max-w-3xl">{customSec.content}</p>}
                    
                    <div className="overflow-x-auto pb-6 scrollbar-thin snap-x snap-mandatory flex gap-6 scroll-smooth">
                      {customSec.items?.map((item, idx) => {
                        const hasLink = item.showInquire || item.link;
                        const linkUrl = item.showInquire
                          ? `https://wa.me/91${(config.whatsappNumber || "7738882899").replace(/\D/g, "")}?text=${encodeURIComponent(`Hi! I want to inquire about *${item.title}* from your website.`)}`
                          : item.link;

                        return (
                          <div key={idx} className="relative w-[280px] sm:w-[350px] shrink-0 snap-start" style={{ perspective: 1500 }}>
                            <TiltCard>
                              <div 
                                data-cursor={!hasLink ? "" : undefined}
                                data-cursor-text={!hasLink ? "VIEW" : undefined}
                                className="p-6 sm:p-8 glass-card border border-neutral-900/60 rounded-2xl flex flex-col justify-between hover:border-[var(--gold)]/30 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(197,160,89,0.03)] transition-all duration-500 ease-out h-full min-h-[220px]"
                              >
                                <div className="space-y-4 mb-6">
                                  <h3 className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl font-bold text-white">{item.title}</h3>
                                  <p className="font-sans text-sm sm:text-base text-[var(--muted)] leading-relaxed whitespace-pre-line">{item.desc}</p>
                                </div>
                                
                                {hasLink && (
                                  <a
                                    href={linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-cursor
                                    data-cursor-text={item.buttonText || "INQUIRE"}
                                    className="w-full mt-auto py-3 bg-[var(--bg)] border border-neutral-800 rounded text-[11px] font-[family-name:var(--font-syne)] font-bold tracking-[2px] uppercase hover:bg-[var(--text)] hover:text-black hover:border-transparent transition-all duration-300 cursor-pointer text-center block relative z-20 pointer-events-auto"
                                  >
                                    {item.buttonText || "Inquire"}
                                  </a>
                                )}
                              </div>
                            </TiltCard>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              }
            }
          }

          if (!sectionContent) return null;

          const sectionAnim = sectionId.startsWith("custom-")
            ? (config.customSections?.find((s) => s.id === sectionId)?.animation || "fade-slide")
            : (config.sectionAnimations?.[sectionId] || "fade-slide");

          return (
            <SectionWrapper 
              key={sectionId} 
              id={sectionId} 
              bgConfig={config.sectionBackgrounds?.[sectionId]}
              animation={sectionAnim}
            >
              {sectionContent}
            </SectionWrapper>
          );
        })}
      </main>

    </>
  );
}
