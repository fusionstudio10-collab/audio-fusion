"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Save, 
  ArrowLeft, 
  Settings, 
  Layout, 
  Users, 
  Briefcase, 
  FileText, 
  Music, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Trash2,
  RotateCcw,
  Volume2,
  Lock,
  Mail,
  MapPin,
  Compass
} from "lucide-react";
import { defaultConfig } from "../lib/defaultConfig";
import { saveRemoteConfig } from "../lib/firebase";
import { uploadToImgBB } from "../lib/imageUploader";

export default function AdminPanel() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [activeTab, setActiveTab] = useState("global");
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState(null);
  const [uploadingField, setUploadingField] = useState(null);

  // Load config & authorization state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("audio_fusion_config");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Merge defaults with stored values so new schema keys are always present
          const merged = { ...defaultConfig, ...parsed };
          setConfig(merged);
        } catch (e) {
          setConfig(defaultConfig);
        }
      } else {
        setConfig(defaultConfig);
      }

      // Check temporary session authorization
      const sessionAuth = sessionStorage.getItem("audio_fusion_auth");
      if (sessionAuth === "true") {
        setIsAuthorized(true);
      }
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!config) return;

    const targetEmail = config.adminEmail || defaultConfig.adminEmail || "";
    const targetPassword = config.adminPassword || defaultConfig.adminPassword || "";

    const emailMatch = loginEmail.trim().toLowerCase() === targetEmail.toLowerCase();
    const passMatch = loginPassword === targetPassword;

    if (emailMatch && passMatch) {
      setIsAuthorized(true);
      sessionStorage.setItem("audio_fusion_auth", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid email or passcode. Please check and try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem("audio_fusion_auth");
  };

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      // 1. Save to Firebase Firestore database
      await saveRemoteConfig(config);
      
      // 2. Local fallback sync
      localStorage.setItem("audio_fusion_config", JSON.stringify(config));
      setIsSaving(false);
      alert("Settings successfully saved to Firebase Firestore & published live!");
    } catch (e) {
      console.error("Failed to save remote config:", e);
      setIsSaving(false);
      alert("Failed to save changes online. Saved to local cache instead.");
      localStorage.setItem("audio_fusion_config", JSON.stringify(config));
    }
  };

  const handleReset = async () => {
    if (confirm("Reset everything to default values both locally and on Firebase?")) {
      try {
        setIsSaving(true);
        await saveRemoteConfig(defaultConfig);
        setConfig(defaultConfig);
        localStorage.setItem("audio_fusion_config", JSON.stringify(defaultConfig));
        setIsSaving(false);
        alert("Config reset to defaults both locally and on Firebase Firestore!");
      } catch (e) {
        console.error("Failed to reset remote config:", e);
        setConfig(defaultConfig);
        localStorage.setItem("audio_fusion_config", JSON.stringify(defaultConfig));
        setIsSaving(false);
        alert("Reset locally. Failed to reset on Firebase.");
      }
    }
  };

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e, fieldType, indexOrId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show indicator
    const uploadKey = `${fieldType}-${indexOrId || 'global'}`;
    setUploadingField(uploadKey);

    try {
      const downloadURL = await uploadToImgBB(file);
      
      if (fieldType === "logo") {
        setConfig({ ...config, logoUrl: downloadURL });
      } else if (fieldType === "founder") {
        const updatedFounders = config.founders.map((f) => {
          if (f.id === indexOrId) {
            return { ...f, photo: downloadURL };
          }
          return f;
        });
        setConfig({ ...config, founders: updatedFounders });
      } else if (fieldType === "showcase") {
        const updatedPortfolio = [...config.portfolio];
        updatedPortfolio[indexOrId] = { ...updatedPortfolio[indexOrId], coverUrl: downloadURL };
        setConfig({ ...config, portfolio: updatedPortfolio });
      }
      
      alert("Image uploaded successfully! Remember to click 'Publish Settings' to make it live.");
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Please verify your internet connection or try a different file.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleAudioChange = (e) => {
    setConfig({
      ...config,
      audios: {
        ...config.audios,
        [e.target.name]: e.target.value
      }
    });
  };

  // --- SECTION REORDERING HANDLERS ---
  const moveSection = (index, direction) => {
    const newOrder = [...config.sectionsOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    
    setConfig({ ...config, sectionsOrder: newOrder });
  };

  const toggleSectionActive = (sectionId) => {
    let newOrder = [...config.sectionsOrder];
    if (newOrder.includes(sectionId)) {
      newOrder = newOrder.filter(id => id !== sectionId);
    } else {
      newOrder.push(sectionId);
    }
    setConfig({ ...config, sectionsOrder: newOrder });
  };

  // --- FOUNDERS HANDLERS ---
  const handleFounderChange = (founderId, field, value) => {
    const updatedFounders = config.founders.map((f) => {
      if (f.id === founderId) {
        return { ...f, [field]: value };
      }
      return f;
    });
    setConfig({ ...config, founders: updatedFounders });
  };

  // --- PORTFOLIO HANDLERS ---
  const handlePortfolioChange = (index, field, value) => {
    const updatedPortfolio = [...config.portfolio];
    updatedPortfolio[index] = { ...updatedPortfolio[index], [field]: value };
    setConfig({ ...config, portfolio: updatedPortfolio });
  };

  const addPortfolioTrack = () => {
    const newTrack = {
      id: `track-${Date.now()}`,
      title: "Midnight Vibing",
      artist: "Manoj Sahu / Psyclone",
      genre: "Trap Soul",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop"
    };
    setConfig({ ...config, portfolio: [...config.portfolio, newTrack] });
  };

  const removePortfolioTrack = (index) => {
    const updated = config.portfolio.filter((_, idx) => idx !== index);
    setConfig({ ...config, portfolio: updated });
  };

  // --- SERVICES HANDLERS ---
  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...config.services];
    const parsedValue = (field === "price" || field === "originalPrice") && value !== "" 
      ? parseInt(value) || 0 
      : value;
    updatedServices[index] = { ...updatedServices[index], [field]: parsedValue };
    setConfig({ ...config, services: updatedServices });
  };

  const addService = () => {
    const newSvc = {
      id: `svc-${Date.now()}`,
      category: "Mixing / Mastering",
      name: "Standard Mix Package",
      price: 2000,
      originalPrice: 2500,
      unit: "Per Song",
      description: "Complete sonic balancing and loudness optimization.",
      badge: "Deal"
    };
    setConfig({ ...config, services: [...config.services, newSvc] });
  };

  const removeService = (index) => {
    const updated = config.services.filter((_, idx) => idx !== index);
    setConfig({ ...config, services: updated });
  };

  // --- DYNAMIC CUSTOM SECTIONS HANDLERS ---
  const handleCustomSectionChange = (sectionId, field, value) => {
    const updatedSections = config.customSections.map((sec) => {
      if (sec.id === sectionId) {
        return { ...sec, [field]: value };
      }
      return sec;
    });
    setConfig({ ...config, customSections: updatedSections });
  };

  const handleCustomItemChange = (sectionId, itemIndex, field, value) => {
    const updatedSections = config.customSections.map((sec) => {
      if (sec.id === sectionId) {
        const updatedItems = [...sec.items];
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value };
        return { ...sec, items: updatedItems };
      }
      return sec;
    });
    setConfig({ ...config, customSections: updatedSections });
  };

  const addCustomItem = (sectionId) => {
    const updatedSections = config.customSections.map((sec) => {
      if (sec.id === sectionId) {
        const newItem = { title: "Item Title", desc: "Brief description of this feature block." };
        return { ...sec, items: [...sec.items, newItem] };
      }
      return sec;
    });
    setConfig({ ...config, customSections: updatedSections });
  };

  const removeCustomItem = (sectionId, itemIndex) => {
    const updatedSections = config.customSections.map((sec) => {
      if (sec.id === sectionId) {
        const updatedItems = sec.items.filter((_, idx) => idx !== itemIndex);
        return { ...sec, items: updatedItems };
      }
      return sec;
    });
    setConfig({ ...config, customSections: updatedSections });
  };

  const addCustomSection = () => {
    const uniqueId = `custom-${Date.now()}`;
    const newSec = {
      id: uniqueId,
      title: "My Custom Sound Statement",
      subtitle: "NEW BLOCK",
      layout: "text-only", // layouts: text-only, cards-grid, split-image-text
      content: "Enter your paragraphs or section contents here. You can toggle or reorder this dynamically.",
      items: []
    };

    // Add to sectionsOrder list as well
    const newOrder = [...config.sectionsOrder];
    newOrder.splice(newOrder.length - 1, 0, uniqueId); // Insert before contact footer

    setConfig({ 
      ...config, 
      customSections: [...config.customSections, newSec],
      sectionsOrder: newOrder
    });
  };

  const removeCustomSection = (sectionId) => {
    const updatedSections = config.customSections.filter(sec => sec.id !== sectionId);
    const updatedOrder = config.sectionsOrder.filter(id => id !== sectionId);
    setConfig({ 
      ...config, 
      customSections: updatedSections,
      sectionsOrder: updatedOrder
    });
  };

  const navItems = [
    { id: "global", icon: <Settings size={16} />, label: "Global Settings" },
    { id: "layout", icon: <Layout size={16} />, label: "Page Layout Sequences" },
    { id: "custom-sections", icon: <Compass size={16} />, label: "Custom Sections" },
    { id: "founders", icon: <Users size={16} />, label: "Founders Profiles" },
    { id: "showcase", icon: <Music size={16} />, label: "Portfolio Tracks" },
    { id: "services", icon: <FileText size={16} />, label: "Services Pricing" },
  ];

  if (!config) return <div className="min-h-screen bg-[#070708] flex items-center justify-center text-sm font-mono text-[var(--gold)]">INITIALIZING ENGINE CONFIG...</div>;

  // Render Login Lock Screen if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#070708] text-[#f3f3f0] font-[family-name:var(--font-syne)] flex items-center justify-center p-6 relative">
        <div className="film-grain" />
        <div className="vhs-scanlines absolute inset-0 pointer-events-none" />
        
        <div className="w-full max-w-md p-8 glass-card border border-neutral-900 rounded-2xl relative z-20 space-y-6 text-center">
          <div className="w-16 h-16 bg-[#121214] border border-[var(--gold)]/20 text-[var(--gold)] rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(197,160,89,0.05)]">
            <Lock className="w-7 h-7" />
          </div>
          
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] italic text-3xl font-black text-white">Studio CMS Gate</h1>
            <p className="text-[9px] font-mono text-[var(--muted)] tracking-widest uppercase mt-1">Authorized Access Only</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[8px] font-mono text-[var(--muted)] mb-2 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="fusionstudio10@gmail.com" 
                className="w-full bg-[#0d0d0f] border border-neutral-950 rounded-lg p-3 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--gold)]/40 font-bold" 
              />
            </div>

            <div>
              <label className="block text-[8px] font-mono text-[var(--muted)] mb-2 uppercase tracking-wider">Passcode</label>
              <input 
                type="password" 
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••" 
                className="w-full bg-[#0d0d0f] border border-neutral-950 rounded-lg p-3 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--gold)]/40 font-mono tracking-widest" 
              />
            </div>

            {loginError && (
              <p className="text-[10px] text-red-500 font-bold tracking-wide mt-2">{loginError}</p>
            )}

            <button 
              type="submit"
              className="w-full py-3 bg-[var(--gold)] text-black rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer text-center"
            >
              Verify Identity
            </button>
          </form>

          <div className="pt-2">
            <Link href="/" className="text-[10px] font-bold text-[var(--muted)] hover:text-white uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors">
              <ArrowLeft size={12} /> Back to Studio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070708] text-[#f3f3f0] font-[family-name:var(--font-syne)] flex flex-col md:flex-row relative">
      <div className="film-grain" />

      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-900 bg-neutral-950/30 backdrop-blur-md flex flex-col z-20">
        <div className="p-6 border-b border-neutral-900 flex justify-between items-center">
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] italic text-xl font-bold tracking-tight text-[var(--text)]">CMS Panel</h2>
            <p className="text-[8px] font-mono text-[var(--gold)] mt-1 tracking-widest uppercase">AUDIO FUSION ACTIVE</p>
          </div>
          <button onClick={handleLogout} className="text-[10px] border border-neutral-900 rounded px-2.5 py-1 text-[var(--muted)] hover:text-white transition-colors">
            Exit
          </button>
        </div>
        
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors text-left ${
                activeTab === item.id 
                  ? "bg-[var(--gold)] text-black shadow-[0_0_12px_rgba(197,160,89,0.2)]" 
                  : "text-[var(--muted)] hover:text-white hover:bg-neutral-900/60"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-900 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[var(--muted)] hover:text-white uppercase transition-colors">
            <ArrowLeft size={14} /> Back to Studio
          </Link>
          <span className="text-[8px] font-mono text-[var(--muted)]">v1.2</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-5xl z-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] italic text-4xl font-black text-[var(--text)]">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-[var(--muted)] text-xs mt-1">Configure layout values dynamically. Synchronizes across live tabs.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-3 border border-neutral-800 rounded-lg font-bold text-[11px] tracking-wider uppercase text-[var(--muted)] hover:text-white hover:border-neutral-700 transition-colors"
            >
              <RotateCcw size={14} />
              Reset Defaults
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-bold text-[11px] tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save size={14} />
              {isSaving ? "Saving..." : "Publish Settings"}
            </button>
          </div>
        </div>

        {/* Tab Cards Content */}
        <div className="bg-neutral-950/40 border border-neutral-900/80 rounded-2xl p-6 md:p-8 space-y-8 backdrop-blur-md">
          
          {/* TAB 1: GLOBAL SETTINGS */}
          {activeTab === "global" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-mono text-[var(--muted)] mb-2 uppercase tracking-widest">Studio Name</label>
                  <input type="text" name="name" value={config.name} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-3.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-bold" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[var(--muted)] mb-2 uppercase tracking-widest">WhatsApp Number (Redirection)</label>
                  <input type="text" name="whatsappNumber" value={config.whatsappNumber} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-3.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-mono" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[var(--muted)] mb-2 uppercase tracking-widest">Logo Headline Text</label>
                  <input type="text" name="logoText" value={config.logoText} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-3.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-bold" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[var(--muted)] mb-2 uppercase tracking-widest">Logo / Intro Screen Image</label>
                  <div className="flex gap-2">
                    <input type="text" name="logoUrl" value={config.logoUrl || ""} onChange={handleChange} className="flex-1 bg-[#070708] border border-neutral-900 rounded-lg p-3.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-mono" />
                    <label className="px-4 py-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg font-bold text-[10px] uppercase tracking-wider text-center cursor-pointer shrink-0 flex items-center justify-center">
                      {uploadingField === 'logo-global' ? 'Uploading...' : 'Upload'}
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="hidden" disabled={uploadingField === 'logo-global'} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[var(--muted)] mb-2 uppercase tracking-widest">Contact Email</label>
                  <input type="text" name="email" value={config.email} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-3.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-bold" />
                </div>
                
                {/* Physical Address and Map */}
                <div>
                  <label className="block text-[9px] font-mono text-[var(--muted)] mb-2 uppercase tracking-widest">Studio Physical Address</label>
                  <input type="text" name="address" value={config.address || ""} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-3.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-bold" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[var(--muted)] mb-2 uppercase tracking-widest">Google Map Embed Iframe URL</label>
                  <input type="text" name="mapUrl" value={config.mapUrl || ""} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-3.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-mono" />
                </div>

                {/* Login Credentials Config */}
                <div className="p-4 border border-dashed border-neutral-900 rounded-xl bg-neutral-950/20 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-xs font-bold uppercase text-[var(--gold)]">
                    <Lock size={14} /> Admin Access Gate Login
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono text-[var(--muted)] mb-1.5 uppercase">Admin Email</label>
                    <input type="email" name="adminEmail" value={config.adminEmail} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono text-[var(--muted)] mb-1.5 uppercase">Admin Passcode</label>
                    <input type="text" name="adminPassword" value={config.adminPassword} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] focus:outline-none font-mono" />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[9px] font-mono text-[var(--muted)] mb-2 uppercase tracking-widest">Hero Dynamic Tagline</label>
                  <input type="text" name="tagline" value={config.tagline} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-3.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-bold" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[9px] font-mono text-[var(--muted)] mb-2 uppercase tracking-widest">Hero Body Intro (1:1 chat column)</label>
                  <textarea rows="3" name="heroIntro" value={config.heroIntro} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-3.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-medium" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[9px] font-mono text-[var(--muted)] mb-2 uppercase tracking-widest">Footer Philosophy Paragraph</label>
                  <textarea rows="3" name="philosophy" value={config.philosophy} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-3.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-medium" />
                </div>
              </div>

              {/* Audio System Assets */}
              <div className="pt-6 border-t border-neutral-900">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text)] mb-4 flex items-center gap-2">
                  <Volume2 size={16} /> Audio System Assets
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase tracking-widest">Ambient Tape Hiss Loop URL</label>
                    <input type="text" name="hissUrl" value={config.audios.hissUrl} onChange={handleAudioChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-2.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase tracking-widest">Button Interaction Click Sound URL</label>
                    <input type="text" name="clickUrl" value={config.audios.clickUrl} onChange={handleAudioChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-2.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase tracking-widest">Intro VHS TV Glitch Sound URL</label>
                    <input type="text" name="glitchUrl" value={config.audios.glitchUrl || ""} onChange={handleAudioChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-2.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-mono" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECTIONS REORDERING */}
          {activeTab === "layout" && (
            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider mb-2">Adjust visual layout elements sequence order:</p>
              <div className="space-y-2.5">
                {config.sectionsOrder.map((section, idx) => {
                  const isCustom = section.startsWith("custom-");
                  const customSecTitle = isCustom ? config.customSections.find(s => s.id === section)?.title : "";
                  return (
                    <div 
                      key={section}
                      className="flex justify-between items-center p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[9px] text-[var(--muted)]">0{idx+1}</span>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs uppercase tracking-widest text-[var(--text)]">
                            {isCustom ? `Custom Block: ${customSecTitle || "Section"}` : `${section} Section`}
                          </span>
                          {isCustom && <span className="text-[8px] font-mono text-[var(--gold)] mt-0.5 uppercase">DYNAMICALLY CREATED</span>}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => moveSection(idx, -1)}
                          disabled={idx === 0}
                          className="p-2 border border-neutral-800 rounded bg-[#070708] text-[var(--muted)] hover:text-white disabled:opacity-20 hover:border-neutral-700 transition-colors"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button 
                          onClick={() => moveSection(idx, 1)}
                          disabled={idx === config.sectionsOrder.length - 1}
                          className="p-2 border border-neutral-800 rounded bg-[#070708] text-[var(--muted)] hover:text-white disabled:opacity-20 hover:border-neutral-700 transition-colors"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => toggleSectionActive(section)}
                          className="px-2.5 py-1 border border-neutral-800 rounded bg-[#070708] text-[9px] uppercase tracking-wider font-bold text-red-400 hover:text-red-500"
                        >
                          Hide
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM SECTIONS BUILDER */}
          {activeTab === "custom-sections" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Dynamically Create Custom Sections ({config.customSections?.length || 0})</span>
                <button 
                  onClick={addCustomSection}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[var(--gold)] text-black rounded text-[10px] font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
                >
                  <Plus size={14} /> Add Custom Block
                </button>
              </div>

              {(!config.customSections || config.customSections.length === 0) ? (
                <div className="py-12 text-center text-xs font-mono text-[var(--muted)] border border-dashed border-neutral-900 rounded-xl">
                  NO CUSTOM SECTIONS CREATED YET. CLICK BUTTON ABOVE TO ADD ONE.
                </div>
              ) : (
                <div className="space-y-8">
                  {config.customSections.map((sec) => (
                    <div key={sec.id} className="p-6 border border-neutral-900 rounded-xl space-y-4 relative bg-neutral-950/20">
                      <button 
                        onClick={() => removeCustomSection(sec.id)}
                        className="absolute top-4 right-4 text-[var(--muted)] hover:text-red-500 p-1.5 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Block Title</label>
                          <input type="text" value={sec.title} onChange={(e) => handleCustomSectionChange(sec.id, "title", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-bold" />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Subtitle Tag</label>
                          <input type="text" value={sec.subtitle} onChange={(e) => handleCustomSectionChange(sec.id, "subtitle", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] uppercase tracking-wider" />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Layout Format</label>
                          <select 
                            value={sec.layout} 
                            onChange={(e) => handleCustomSectionChange(sec.id, "layout", e.target.value)} 
                            className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] focus:outline-none"
                          >
                            <option value="text-only">Simple Text Body</option>
                            <option value="cards-grid">Feature Cards Grid</option>
                            <option value="split-image-text">Split Row (Side Info)</option>
                          </select>
                        </div>
                        <div className="col-span-1 md:col-span-3">
                          <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Block Content Body Paragraph</label>
                          <textarea rows="3" value={sec.content} onChange={(e) => handleCustomSectionChange(sec.id, "content", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2.5 text-xs text-[var(--text)]" />
                        </div>
                      </div>

                      {/* CARD ITEMS FOR GRIDS */}
                      {sec.layout !== "text-only" && (
                        <div className="pt-4 border-t border-neutral-900/60 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase font-bold text-[var(--gold)] tracking-wider">Features / Item Grid Blocks ({sec.items?.length || 0})</span>
                            <button 
                              onClick={() => addCustomItem(sec.id)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-[9px] font-bold uppercase transition-colors hover:border-neutral-700"
                            >
                              <Plus size={10} /> Add Item Card
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {sec.items?.map((item, itemIdx) => (
                              <div key={itemIdx} className="p-4 bg-neutral-900/30 border border-neutral-900 rounded-lg space-y-3 relative">
                                <button 
                                  onClick={() => removeCustomItem(sec.id, itemIdx)}
                                  className="absolute top-3 right-3 text-[var(--muted)] hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={12} />
                                </button>
                                <div>
                                  <label className="block text-[7px] font-mono text-[var(--muted)] mb-1 uppercase">Item Title</label>
                                  <input type="text" value={item.title} onChange={(e) => handleCustomItemChange(sec.id, itemIdx, "title", e.target.value)} className="w-full bg-[#070708] border border-neutral-950 rounded p-1.5 text-xs text-[var(--text)] font-semibold" />
                                </div>
                                <div>
                                  <label className="block text-[7px] font-mono text-[var(--muted)] mb-1 uppercase">Item Description</label>
                                  <textarea rows="2" value={item.desc} onChange={(e) => handleCustomItemChange(sec.id, itemIdx, "desc", e.target.value)} className="w-full bg-[#070708] border border-neutral-950 rounded p-1.5 text-xs text-[var(--text)]" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FOUNDERS PROFILES */}
          {activeTab === "founders" && (
            <div className="space-y-10">
              {config.founders.map((f) => (
                <div key={f.id} className="p-6 border border-neutral-900 rounded-xl space-y-4">
                  <h3 className="font-[family-name:var(--font-playfair)] italic text-lg font-bold border-b border-neutral-900 pb-2">
                    Profile: {f.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Full Name</label>
                      <input type="text" value={f.name} onChange={(e) => handleFounderChange(f.id, "name", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-bold" />
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Role/Tagline Title</label>
                      <input type="text" value={f.role} onChange={(e) => handleFounderChange(f.id, "role", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)]" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Portrait Image</label>
                      <div className="flex gap-2">
                        <input type="text" value={f.photo} onChange={(e) => handleFounderChange(f.id, "photo", e.target.value)} className="flex-1 bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-mono" />
                        <label className="px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded font-bold text-[9px] uppercase tracking-wider text-center cursor-pointer shrink-0 flex items-center justify-center">
                          {uploadingField === `founder-${f.id}` ? 'Uploading...' : 'Upload'}
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'founder', f.id)} className="hidden" disabled={uploadingField === `founder-${f.id}`} />
                        </label>
                      </div>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Personal Statement Quote</label>
                      <textarea rows="2" value={f.bio} onChange={(e) => handleFounderChange(f.id, "bio", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2.5 text-xs text-[var(--text)]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: PORTFOLIO SHOWCASE */}
          {activeTab === "showcase" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Manage Portfolio Tracks ({config.portfolio.length})</span>
                <button 
                  onClick={addPortfolioTrack}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded text-[9px] font-bold uppercase tracking-widest transition-colors"
                >
                  <Plus size={12} /> Add Track
                </button>
              </div>

              <div className="space-y-6">
                {config.portfolio.map((track, idx) => (
                  <div key={track.id} className="p-6 border border-neutral-900 rounded-xl space-y-4 relative bg-neutral-950/20">
                    <button 
                      onClick={() => removePortfolioTrack(idx)}
                      className="absolute top-4 right-4 text-[var(--muted)] hover:text-red-500 p-1.5 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Track Title</label>
                        <input type="text" value={track.title} onChange={(e) => handlePortfolioChange(idx, "title", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-bold" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Artist</label>
                        <input type="text" value={track.artist} onChange={(e) => handlePortfolioChange(idx, "artist", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)]" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Genre Label</label>
                        <input type="text" value={track.genre} onChange={(e) => handlePortfolioChange(idx, "genre", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)]" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Audio File URL / Stream Link</label>
                        <input type="text" value={track.audioUrl} onChange={(e) => handlePortfolioChange(idx, "audioUrl", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-mono" />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Cover Image</label>
                        <div className="flex gap-2">
                          <input type="text" value={track.coverUrl} onChange={(e) => handlePortfolioChange(idx, "coverUrl", e.target.value)} className="flex-1 bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-mono" />
                          <label className="px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded font-bold text-[9px] uppercase tracking-wider text-center cursor-pointer shrink-0 flex items-center justify-center">
                            {uploadingField === `showcase-${idx}` ? 'Uploading...' : 'Upload'}
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'showcase', idx)} className="hidden" disabled={uploadingField === `showcase-${idx}`} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SERVICES */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Manage Services Tiers ({config.services.length})</span>
                <button 
                  onClick={addService}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded text-[9px] font-bold uppercase tracking-widest transition-colors"
                >
                  <Plus size={12} /> Add Service
                </button>
              </div>

              <div className="space-y-6">
                {config.services.map((svc, idx) => (
                  <div key={svc.id} className="p-6 border border-neutral-900 rounded-xl space-y-4 relative bg-neutral-950/20">
                    <button 
                      onClick={() => removeService(idx)}
                      className="absolute top-4 right-4 text-[var(--muted)] hover:text-red-500 p-1.5 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Service Title</label>
                        <input type="text" value={svc.name} onChange={(e) => handleServiceChange(idx, "name", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-bold" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Category Group</label>
                        <input type="text" value={svc.category} onChange={(e) => handleServiceChange(idx, "category", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)]" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Deal Price (₹)</label>
                        <input type="number" value={svc.price} onChange={(e) => handleServiceChange(idx, "price", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-mono font-bold text-[var(--neon-green)]" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Original Price (₹) - Strikethrough</label>
                        <input type="number" value={svc.originalPrice || ""} onChange={(e) => handleServiceChange(idx, "originalPrice", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-mono text-neutral-500" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Billing Unit (e.g. Per Hour, Per Song)</label>
                        <input type="text" value={svc.unit || ""} onChange={(e) => handleServiceChange(idx, "unit", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)]" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Promotion Badge (e.g. Best Deal)</label>
                        <input type="text" value={svc.badge || ""} onChange={(e) => handleServiceChange(idx, "badge", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] text-[var(--gold)]" />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-[8px] font-mono text-[var(--muted)] mb-1 uppercase">Service Summary Details</label>
                        <textarea rows="2" value={svc.description} onChange={(e) => handleServiceChange(idx, "description", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
