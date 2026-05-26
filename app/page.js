"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { MessageSquare, Send, X, Calendar, Mail, ArrowUpRight, MapPin } from "lucide-react";

import { defaultConfig } from "./lib/defaultConfig";
import audioEngine from "./lib/audioEngine";
import { fetchRemoteConfig } from "./lib/firebase";

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
  
  // Custom Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey! 🎧 Manoj and Psyclone here (via our assistant). How can we help you create today? Ask us about recording, mixing/mastering, custom production, or bookings." }
  ]);
  const messagesEndRef = useRef(null);

  // Navigation Scroll Hide
  const [scrolledDown, setScrolledDown] = useState(false);
  const lastScroll = useRef(0);

  // 1. Sync Configuration from localStorage
  // 1. Sync Configuration from Firebase & local cache fallback
  const loadConfig = async () => {
    if (typeof window !== "undefined") {
      // First try Firebase Firestore
      const remote = await fetchRemoteConfig();
      if (remote) {
        const merged = { ...defaultConfig, ...remote };
        setConfig(merged);
        localStorage.setItem("audio_fusion_config", JSON.stringify(merged));
        if (merged.audios) {
          audioEngine.updateUrls(merged.audios);
        }
        return;
      }

      // Fallback to local storage cache if offline or remote empty
      const stored = localStorage.getItem("audio_fusion_config");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const merged = { ...defaultConfig, ...parsed };
          setConfig(merged);
          if (merged.audios) {
            audioEngine.updateUrls(merged.audios);
          }
        } catch (e) {
          console.error("Failed to parse config, resetting to default.", e);
          setConfig(defaultConfig);
          localStorage.setItem("audio_fusion_config", JSON.stringify(defaultConfig));
        }
      } else {
        setConfig(defaultConfig);
        localStorage.setItem("audio_fusion_config", JSON.stringify(defaultConfig));
        if (defaultConfig.audios) {
          audioEngine.updateUrls(defaultConfig.audios);
        }
      }
    }
  };

  useEffect(() => {
    loadConfig();

    // 2. Real-time sync if changed in another tab (Admin Panel)
    const handleStorageChange = (e) => {
      if (e.key === "audio_fusion_config") {
        loadConfig();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // 3. Scroll Reveal Handler
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      // Nav bar hide/show
      if (currentScroll > lastScroll.current && currentScroll > 100) {
        setScrolledDown(true);
      } else {
        setScrolledDown(false);
      }
      lastScroll.current = currentScroll;

      // Class reveals
      const reveals = document.querySelectorAll(".reveal-elem");
      reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
          el.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial call to reveal elements above the fold
    setTimeout(handleScroll, 800);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Sync scroll reveals when entry completes
  useEffect(() => {
    if (hasEntered) {
      setTimeout(() => {
        const reveals = document.querySelectorAll(".reveal-elem");
        reveals.forEach((el) => el.classList.add("visible"));
      }, 100);
    }
  }, [hasEntered]);

  // Chat scroll sync
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  if (!config) return null;

  // Sound triggering helper
  const handleNavClick = () => {
    audioEngine.playClick();
  };

  const handleBookClick = (serviceName) => {
    audioEngine.playClick();
    setPreselectedService(serviceName);
    // Smooth scroll to booking
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Bot response engine
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
      } else if (input.includes("price") || input.includes("rate") || input.includes("cost") || input.includes("discount")) {
        response = `Humare rates fully clear hain. Standard slots ₹800/hr se start hote hain, aur Mix & Master packages ₹2000 se up to ₹7500 tak hain. Aap dynamic pricing section niche browse kar sakte hain, discounts update hote rehte hain!`;
      } else if (input.includes("book") || input.includes("slot") || input.includes("appoint")) {
        response = `Session secure karne ke liye dynamic Booking section (page ke bottom mein) date and time slot pick karke directly click karein, details WhatsApp par transmit ho jayengi.`;
      } else if (input.includes("vocal") || input.includes("record") || input.includes("studio")) {
        response = `Humare paas high-end microphones (Neumann/Shure) aur premium analog outboard preamps hain. Voice tracking acoustically treated, perfect reverb-isolated booth mein hoti hai.`;
      } else if (input.includes("mix") || input.includes("master") || input.includes("analog")) {
        response = `Manoj aur Psyclone hybrid analog/digital routing se tracks mix and master karte hain takki heavy bass retention ke sath global level clarity mile. Def Jam / Netflix standards ready!`;
      } else if (input.includes("number") || input.includes("whatsapp") || input.includes("contact") || input.includes("phone")) {
        response = `Aap hume directly phone or WhatsApp par query send kar sakte hain: +91 ${config.whatsappNumber}. Main site booking redirect directly isi number pe handle karegi.`;
      } else {
        response = `Solid! Isko detail mein connect karne ke liye niche calendar flow ya booking request select karke WhatsApp send kar dein. We reply instantly!`;
      }

      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    }, 600);
  };

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

      {/* FIXED NAV BAR */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-5 px-8 md:px-16 transition-transform duration-500 bg-[#070708]/30 backdrop-blur-md border-b border-neutral-900/40 ${
          scrolledDown ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <a 
          href="#" 
          onClick={handleNavClick}
          className="flex items-center gap-3 font-[family-name:var(--font-playfair)] italic text-xl md:text-2xl font-black text-[var(--text)] tracking-tight hover:text-white transition-colors"
        >
          <img
            src={config.logoUrl || "/logo.jpg"}
            alt={config.name}
            className="w-10 h-10 object-contain logo-gold-invert"
          />
          <span className="hidden sm:inline">{config.name}</span>
        </a>
        <ul className="flex gap-6 md:gap-10 items-center list-none text-[10px] font-[family-name:var(--font-syne)] font-bold tracking-[3px] uppercase">
          {config.sectionsOrder.includes("founders") && (
            <li>
              <a href="#founders" onClick={handleNavClick} className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">Founders</a>
            </li>
          )}
          {config.sectionsOrder.includes("showcase") && (
            <li>
              <a href="#showcase" onClick={handleNavClick} className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">Showcase</a>
            </li>
          )}
          {config.sectionsOrder.includes("services") && (
            <li>
              <a href="#services" onClick={handleNavClick} className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">Services</a>
            </li>
          )}
          {config.sectionsOrder.includes("booking") && (
            <li>
              <a href="#booking" onClick={handleNavClick} className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">Book</a>
            </li>
          )}
          <li>
            <Link href="/admin" className="px-3.5 py-1.5 border border-neutral-800 rounded hover:border-[var(--gold)] text-[var(--gold)] transition-colors">
              Admin
            </Link>
          </li>
        </ul>
      </nav>

      {/* RENDER DYNAMIC SECTIONS ORDER */}
      <main className={`transition-all duration-1000 ${hasEntered ? "opacity-100 filter-none" : "opacity-0 blur-md pointer-events-none"}`}>
        
        {config.sectionsOrder.map((sectionId) => {
          
          // SECTION: HERO
          if (sectionId === "hero") {
            return (
              <section key="hero" className="min-h-screen flex flex-col justify-end px-8 md:px-16 pb-24 relative overflow-hidden">
                {/* Visualizer reactive canvas */}
                <InteractiveVisualizer isPlaying={isPlayingTrack} />
                
                {/* Sidebar details */}
                <div className="absolute top-[42%] md:top-1/2 -translate-y-1/2 right-8 md:right-16 max-w-[360px] z-10 space-y-6 text-center md:text-left reveal-elem">
                  <p className="font-[family-name:var(--font-instrument)] italic text-lg md:text-xl leading-relaxed text-[var(--muted)]">
                    {config.heroIntro}
                  </p>
                  <button 
                    onClick={() => { audioEngine.playClick(); setIsChatOpen(true); }}
                    data-cursor
                    data-cursor-text="CHAT"
                    className="inline-flex items-center gap-2 text-[var(--text)] font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[2px] uppercase border-b border-neutral-800 pb-1.5 hover:border-[var(--text)] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Consult 1:1 with us</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Big typography title */}
                <div className="relative z-10 text-center md:text-left reveal-elem">
                  <h1 className="font-[family-name:var(--font-playfair)] italic font-black text-[clamp(64px,15vw,220px)] leading-[0.85] tracking-[-3px] md:tracking-[-6px] select-none text-[var(--text)]">
                    <span className="block">Audio</span>
                    <span className="block text-glow" style={{ textShadow: "0 0 40px rgba(197, 160, 89, 0.15)" }}>Fusion</span>
                  </h1>
                </div>

                {/* Tagline footer */}
                <div className="flex flex-col md:flex-row items-center gap-8 mt-12 z-10 relative reveal-elem">
                  <p className="font-[family-name:var(--font-instrument)] italic text-xl md:text-2xl text-[var(--muted)] max-w-lg leading-relaxed text-center md:text-left">
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

          // SECTION: FOUNDERS SHOWCASE
          if (sectionId === "founders") {
            return (
              <FounderShowcase key="founders" founders={config.founders} />
            );
          }

          // SECTION: SHOWCASE
          if (sectionId === "showcase") {
            return (
              <PortfolioShowcase 
                key="showcase" 
                tracks={config.portfolio} 
                onTrackPlayChange={(playing) => setIsPlayingTrack(playing)} 
              />
            );
          }

          // SECTION: SERVICES
          if (sectionId === "services") {
            return (
              <ServicesList 
                key="services" 
                services={config.services} 
                onBookClick={handleBookClick} 
              />
            );
          }

          // SECTION: BOOKING
          if (sectionId === "booking") {
            return (
              <BookingFlow 
                key="booking" 
                services={config.services} 
                preselectedService={preselectedService} 
                whatsappNumber={config.whatsappNumber} 
              />
            );
          }

          // SECTION: CONTACT (FOOTER)
          if (sectionId === "contact") {
            return (
              <footer key="contact" className="bg-[#0b0b0d]/50 border-t border-neutral-900 pt-24 px-8 md:px-16 pb-12 z-10 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
                  {/* Left columns */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-12">
                    <div>
                      <h2 className="font-[family-name:var(--font-playfair)] italic text-3xl font-black mb-4 text-[var(--text)]">
                        {config.name}
                      </h2>
                      <p className="font-[family-name:var(--font-instrument)] italic text-base text-[var(--muted)] leading-relaxed">
                        {config.philosophy}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[3px] uppercase mb-6 text-[var(--text)]">
                        Connect
                      </h4>
                      <ul className="space-y-3 font-[family-name:var(--font-syne)] text-xs text-[var(--muted)]">
                        <li>
                          <a href={`mailto:${config.email}`} className="hover:text-[var(--text)] transition-colors flex items-center gap-2">
                            <Mail className="w-4 h-4" /> {config.email}
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
                      <h4 className="font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[3px] uppercase mb-6 text-[var(--text)]">
                        Studio Hours
                      </h4>
                      <p className="font-[family-name:var(--font-instrument)] italic text-[15px] text-[var(--muted)] leading-relaxed">
                        Studio operates 24/7 for booked recording slots. Consultations by appointment only.
                      </p>
                    </div>
                  </div>

                  {/* Right side Map */}
                  <div className="lg:col-span-4 h-60 md:h-auto min-h-[200px] rounded-xl overflow-hidden glass-card border border-neutral-900/80 relative">
                    <iframe
                      src={config.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8415310045903!2d72.8459459!3d19.0707038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf6c4d6687b1%3A0xde402a14d945d596!2sAudio%20Fusion%20Studio!5e0!3m2!1sen!2sin!4v1716762391000!5m2!1sen!2sin"}
                      className="w-full h-full border-0 grayscale invert contrast-[1.2] opacity-60 hover:opacity-100 hover:grayscale-0 hover:invert-0 transition-all duration-700"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center border-t border-neutral-900/60 pt-10 text-[9px] font-mono tracking-widest text-[var(--muted)] uppercase">
                  <p>© 2026 {config.name} Studio. All Rights Reserved.</p>
                  <p className="mt-4 sm:mt-0">Y2K Glitch Engine // Built by Antigravity</p>
                </div>
              </footer>
            );
          }

          // DYNAMIC CUSTOM SECTIONS RENDERER
          if (sectionId.startsWith("custom-")) {
            const customSec = config.customSections?.find(s => s.id === sectionId);
            if (!customSec) return null;

            if (customSec.layout === "text-only") {
              return (
                <section key={customSec.id} id={customSec.id} className="py-28 px-8 md:px-16 max-w-5xl mx-auto reveal-elem">
                  <span className="text-[10px] tracking-[4px] uppercase font-bold text-[var(--gold)] mb-3 block font-[family-name:var(--font-syne)]">{customSec.subtitle}</span>
                  <h2 className="font-[family-name:var(--font-playfair)] italic text-4xl md:text-6xl font-black mb-8 leading-tight text-white">{customSec.title}</h2>
                  <p className="font-[family-name:var(--font-instrument)] italic text-lg md:text-2xl text-[var(--muted)] leading-relaxed whitespace-pre-line">{customSec.content}</p>
                </section>
              );
            }

            if (customSec.layout === "cards-grid") {
              return (
                <section key={customSec.id} id={customSec.id} className="py-28 px-8 md:px-16 max-w-6xl mx-auto reveal-elem">
                  <span className="text-[10px] tracking-[4px] uppercase font-bold text-[var(--gold)] mb-3 block font-[family-name:var(--font-syne)]">{customSec.subtitle}</span>
                  <h2 className="font-[family-name:var(--font-playfair)] italic text-4xl md:text-6xl font-black mb-12 leading-tight text-white">{customSec.title}</h2>
                  {customSec.content && <p className="font-[family-name:var(--font-instrument)] italic text-lg text-[var(--muted)] mb-12 leading-relaxed max-w-3xl">{customSec.content}</p>}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customSec.items?.map((item, idx) => (
                      <div key={idx} className="p-8 glass-card border border-neutral-900/60 rounded-2xl space-y-4 hover:border-[var(--gold)]/25 hover:shadow-[0_0_20px_rgba(197,160,89,0.05)] transition-all duration-300">
                        <h3 className="font-[family-name:var(--font-playfair)] italic text-2xl font-bold text-white">{item.title}</h3>
                        <p className="font-[family-name:var(--font-instrument)] italic text-base text-[var(--muted)] leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (customSec.layout === "split-image-text") {
              return (
                <section key={customSec.id} id={customSec.id} className="py-28 px-8 md:px-16 max-w-6xl mx-auto reveal-elem">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                      <span className="text-[10px] tracking-[4px] uppercase font-bold text-[var(--gold)] block font-[family-name:var(--font-syne)]">{customSec.subtitle}</span>
                      <h2 className="font-[family-name:var(--font-playfair)] italic text-4xl md:text-6xl font-black leading-tight text-white">{customSec.title}</h2>
                      <p className="font-[family-name:var(--font-instrument)] italic text-lg md:text-xl text-[var(--muted)] leading-relaxed whitespace-pre-line">{customSec.content}</p>
                    </div>
                    <div className="lg:col-span-5 space-y-6">
                      {customSec.items?.map((item, idx) => (
                        <div key={idx} className="p-6 bg-neutral-950/20 border border-neutral-900/50 rounded-xl hover:border-[var(--gold)]/20 transition-colors">
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

      {/* FLOAT CHAT TOGGLE BUTTON */}
      {hasEntered && !isChatOpen && (
        <button
          onClick={() => { audioEngine.playClick(); setIsChatOpen(true); }}
          data-cursor
          data-cursor-text="CHAT"
          className="fixed bottom-6 right-6 z-[1000] w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform cursor-pointer"
        >
          <MessageSquare className="w-6 h-6 fill-current" />
        </button>
      )}

      {/* CHAT INTERACTIVE PANEL MODAL */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-[2000] w-[90vw] sm:w-[380px] h-[500px] rounded-2xl overflow-hidden glass-card border border-neutral-800 flex flex-col shadow-[0_12px_40px_rgba(0,0,0,0.8)] animate-[fadeIn_0.3s_ease_forwards]">
          {/* Header */}
          <div className="p-5 border-b border-neutral-900 bg-neutral-950/60 flex justify-between items-center">
            <div>
              <h3 className="font-[family-name:var(--font-playfair)] italic text-lg font-bold text-[var(--text)]">
                Audio Fusion Bot
              </h3>
              <p className="text-[8px] font-mono text-[var(--neon-green)] tracking-widest uppercase mt-0.5">ONLINE // 24/7 SUPPORT</p>
            </div>
            <button 
              onClick={() => { audioEngine.playClick(); setIsChatOpen(false); }}
              className="text-[var(--muted)] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-neutral-950/20">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`max-w-[80%] p-3.5 rounded-xl text-xs leading-relaxed ${
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

          {/* Input field */}
          <div className="p-4 border-t border-neutral-900 bg-neutral-950/40 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
              placeholder="Ask us a question..."
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--neon-purple)]"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={!chatInput.trim()}
              className="w-10 h-10 rounded-lg bg-[var(--text)] text-black flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
