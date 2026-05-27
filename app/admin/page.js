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
  Compass,
  Video,
  Tag,
  GripVertical,
  Image as ImageIcon
} from "lucide-react";
import { defaultConfig } from "../lib/defaultConfig";
import { toast } from "../../components/Toast";

const CategoryInput = ({ initialValue, onCommit }) => {
  const [val, setVal] = useState(initialValue || "");
  
  useEffect(() => {
    setVal(initialValue || "");
  }, [initialValue]);

  return (
    <input 
      type="text" 
      value={val} 
      onChange={(e) => setVal(e.target.value)} 
      onBlur={(e) => {
        if (val !== initialValue) {
          onCommit(val);
        }
      }}
      className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-2 text-xs text-[var(--text)]" 
    />
  );
};

export default function AdminPanel() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [activeTab, setActiveTab] = useState("global");
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState(null);
  const [uploadingField, setUploadingField] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [draggedSectionIndex, setDraggedSectionIndex] = useState(null);
  const [draggedServiceIndex, setDraggedServiceIndex] = useState(null);
  const [draggedFounderIndex, setDraggedFounderIndex] = useState(null);
  const [draggedYoutubeIndex, setDraggedYoutubeIndex] = useState(null);
  const [draggedCategory, setDraggedCategory] = useState(null);

  // Load config & authorization state
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const fetched = await res.json();
          setConfig({ ...defaultConfig, ...fetched });
        } else {
          setConfig(defaultConfig);
        }
      } catch (err) {
        console.error("Failed to load config from database:", err);
        setConfig(defaultConfig);
      }
    };

    fetchConfig();

    if (typeof window !== "undefined") {
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
      // Save locally as a fallback just in case
      localStorage.setItem("audio_fusion_config", JSON.stringify(config));
      
      // Save to Vercel KV Database
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      
      if (!res.ok) throw new Error("Failed to save to database");

      // Notify other open tabs (main site) to reload config if open locally
      window.dispatchEvent(new StorageEvent("storage", {
        key: "audio_fusion_config",
        newValue: JSON.stringify(config),
      }));
      toast.success("Settings saved globally to Database!");
    } catch (e) {
      console.error("Save failed:", e);
      toast.error("Save failed. Check console or Vercel KV setup.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset everything to default values globally?")) return;
    try {
      setConfig(defaultConfig);
      // Reset local
      localStorage.setItem("audio_fusion_config", JSON.stringify(defaultConfig));
      // Reset KV
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultConfig)
      });
      toast.info("Config reset to defaults.");
    } catch (e) {
      console.error("Reset failed:", e);
      toast.error("Reset failed.");
    }
  };

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e, fieldType, indexOrId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WEBP, etc.)");
      return;
    }

    const uploadKey = `${fieldType}-${indexOrId || "global"}`;
    setUploadingField(uploadKey);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "audio-fusion");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }

      const { url } = await res.json();

      if (fieldType === "logo") {
        setConfig({ ...config, logoUrl: url });
      } else if (fieldType === "founder") {
        const updatedFounders = config.founders.map((f) => {
          if (f.id === indexOrId) return { ...f, photo: url };
          return f;
        });
        setConfig({ ...config, founders: updatedFounders });
      } else if (fieldType === "showcase") {
        const updatedPortfolio = [...config.portfolio];
        updatedPortfolio[indexOrId] = { ...updatedPortfolio[indexOrId], coverUrl: url };
        setConfig({ ...config, portfolio: updatedPortfolio });
      }

      toast.success("Image uploaded! Click Publish Settings to go live.");
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleDeleteMedia = async (url, clearCallback) => {
    if (url && url.includes("res.cloudinary.com")) {
      try {
        const res = await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (!res.ok) throw new Error("Delete failed on server");
        toast.success("Deleted from Cloudinary storage!");
      } catch (err) {
        toast.error(`Cloudinary delete failed: ${err.message}`);
      }
    }
    // Always clear it from the UI/config anyway
    clearCallback();
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

  const handleCategoryRename = (index, newCat) => {
    const oldCat = config.services[index].category || "Uncategorized";
    if (oldCat !== newCat) {
      handleServiceChange(index, "category", newCat);
      if (expandedCategory === oldCat) {
        setExpandedCategory(newCat || "Uncategorized");
      }
    }
  };

  const handleSectionDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedSectionIndex === null || draggedSectionIndex === targetIdx) return;
    const newOrder = [...config.sectionsOrder];
    const item = newOrder.splice(draggedSectionIndex, 1)[0];
    newOrder.splice(targetIdx, 0, item);
    setConfig({ ...config, sectionsOrder: newOrder });
    setDraggedSectionIndex(null);
  };

  const handleServiceDrop = (e, targetOriginalIdx) => {
    e.preventDefault();
    e.stopPropagation(); // prevent category drop
    if (draggedServiceIndex === null || draggedServiceIndex === targetOriginalIdx) return;
    const newServices = [...config.services];
    const draggedItem = newServices[draggedServiceIndex];
    newServices.splice(draggedServiceIndex, 1);
    const currentTargetIndex = newServices.findIndex(s => s.id === config.services[targetOriginalIdx].id);
    newServices.splice(currentTargetIndex >= 0 ? currentTargetIndex : targetOriginalIdx, 0, draggedItem);
    setConfig({ ...config, services: newServices });
    setDraggedServiceIndex(null);
  };

  const handleCategoryDrop = (e, targetCategory) => {
    e.preventDefault();
    if (draggedCategory === null || draggedCategory === targetCategory) return;

    const categories = [];
    const categoryMap = {};
    config.services.forEach(svc => {
      const cat = svc.category || "Uncategorized";
      if (!categoryMap[cat]) {
        categoryMap[cat] = [];
        categories.push(cat);
      }
      categoryMap[cat].push(svc);
    });

    const draggedIdx = categories.indexOf(draggedCategory);
    const targetIdx = categories.indexOf(targetCategory);
    if (draggedIdx === -1 || targetIdx === -1) return;

    const catToMove = categories.splice(draggedIdx, 1)[0];
    categories.splice(targetIdx, 0, catToMove);

    const newServices = [];
    categories.forEach(cat => {
      newServices.push(...categoryMap[cat]);
    });

    setConfig({ ...config, services: newServices });
    setDraggedCategory(null);
  };

  const handleFounderDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedFounderIndex === null || draggedFounderIndex === targetIdx) return;
    const newList = [...config.founders];
    const item = newList.splice(draggedFounderIndex, 1)[0];
    newList.splice(targetIdx, 0, item);
    setConfig({ ...config, founders: newList });
    setDraggedFounderIndex(null);
  };

  const handleYoutubeDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedYoutubeIndex === null || draggedYoutubeIndex === targetIdx) return;
    const newList = [...config.youtubeWorks];
    const item = newList.splice(draggedYoutubeIndex, 1)[0];
    newList.splice(targetIdx, 0, item);
    setConfig({ ...config, youtubeWorks: newList });
    setDraggedYoutubeIndex(null);
  };

  const addService = (targetCategory) => {
    const newSvc = {
      id: `svc-${Date.now()}`,
      category: typeof targetCategory === 'string' ? targetCategory : "Mixing / Mastering",
      name: "New Service Package",
      price: 2000,
      originalPrice: 2500,
      unit: "Per Song",
      description: "Complete sonic balancing and loudness optimization.",
      badge: ""
    };
    setConfig({ ...config, services: [...config.services, newSvc] });
  };

  const removeService = (index) => {
    const updated = config.services.filter((_, idx) => idx !== index);
    setConfig({ ...config, services: updated });
  };

  // --- YOUTUBE HANDLERS ---
  const handleYoutubeChange = (index, field, value) => {
    const updated = [...(config.youtubeWorks || [])];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, youtubeWorks: updated });
  };

  const addYoutubeTrack = () => {
    const newVid = {
      id: `yt-${Date.now()}`,
      title: "New YouTube Video",
      videoId: "",
      thumbnail: "",
      tags: ""
    };
    setConfig({ ...config, youtubeWorks: [...(config.youtubeWorks || []), newVid] });
  };

  const removeYoutubeTrack = (index) => {
    const updated = (config.youtubeWorks || []).filter((_, idx) => idx !== index);
    setConfig({ ...config, youtubeWorks: updated });
  };

  const [fetchingYoutube, setFetchingYoutube] = useState(null);

  const handleFetchYoutubeInfo = async (index, videoId) => {
    if (!videoId) return toast.error("Please enter a Video ID or URL first");
    setFetchingYoutube(index);
    try {
      const res = await fetch(`/api/youtube?id=${encodeURIComponent(videoId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      
      const updated = [...(config.youtubeWorks || [])];
      updated[index] = { 
        ...updated[index], 
        title: data.title, 
        thumbnail: data.thumbnail,
        videoId: data.videoId // Automatically replaces URL with clean ID
      };
      setConfig({ ...config, youtubeWorks: updated });
      toast.success("Successfully fetched video info!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFetchingYoutube(null);
    }
  };

  const handlePromoChange = (field, value) => {
    const parsedValue = (field === "value" && value !== "") ? parseInt(value) || 0 : value;
    const updated = { ...(config.globalDiscount || {}), [field]: field === "active" ? value : parsedValue };
    setConfig({ ...config, globalDiscount: updated });
  };

  // --- BACKGROUNDS HANDLERS ---
  const handleBackgroundChange = (sectionId, field, value) => {
    const updatedBg = { ...(config.sectionBackgrounds || {}) };
    if (!updatedBg[sectionId]) updatedBg[sectionId] = { type: "color", url: "", overlayOpacity: 0.5 };
    
    // Parse opacity as number
    const finalValue = field === "overlayOpacity" ? parseFloat(value) || 0 : value;
    updatedBg[sectionId] = { ...updatedBg[sectionId], [field]: finalValue };
    
    setConfig({ ...config, sectionBackgrounds: updatedBg });
  };

  const handleBackgroundUpload = async (e, sectionId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(`bg-${sectionId}`);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `audio-fusion/backgrounds`);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      
      handleBackgroundChange(sectionId, "url", url);
      toast.success("Background uploaded! Click Publish Settings to save.");
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
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
    { id: "backgrounds", icon: <ImageIcon size={16} />, label: "Section Backgrounds & FX" },
    { id: "founders", icon: <Users size={16} />, label: "Founders Profiles" },
    { id: "youtube-works", icon: <Video size={16} />, label: "YouTube Works" },
    { id: "services", icon: <FileText size={16} />, label: "Services Pricing" },
    { id: "promotions", icon: <Tag size={16} />, label: "Promotions & Offers" },
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
              <label className="block text-[11px] font-mono text-[var(--muted)] mb-2 uppercase tracking-wider">Email Address</label>
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
              <label className="block text-[11px] font-mono text-[var(--muted)] mb-2 uppercase tracking-wider">Passcode</label>
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
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#070708] text-[#f3f3f0] font-[family-name:var(--font-syne)] flex flex-col md:flex-row relative">
      <div className="film-grain" />

      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-900 bg-neutral-950/30 backdrop-blur-md flex flex-col z-20">
        <div className="p-6 border-b border-neutral-900 flex justify-between items-center">
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] italic text-xl font-bold tracking-tight text-[var(--text)]">CMS Panel</h2>
            <p className="text-[11px] font-mono text-[var(--gold)] mt-1 tracking-widest uppercase">AUDIO FUSION ACTIVE</p>
          </div>
          <button onClick={handleLogout} className="text-[10px] border border-neutral-900 rounded px-2.5 py-1 text-[var(--muted)] hover:text-white transition-colors">
            Exit
          </button>
        </div>
        
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
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
          <span className="text-[11px] font-mono text-[var(--muted)]">v1.2</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full p-6 md:p-12 overflow-y-auto custom-scrollbar relative z-20">
        <div className="max-w-5xl mx-auto pb-20">
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
                    <label className="block text-[11px] font-mono text-[var(--muted)] mb-1.5 uppercase">Admin Email</label>
                    <input type="email" name="adminEmail" value={config.adminEmail} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[var(--muted)] mb-1.5 uppercase">Admin Passcode</label>
                    <input type="password" name="adminPassword" value={config.adminPassword} onChange={handleChange} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] focus:outline-none font-mono" />
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
                    <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase tracking-widest">Ambient Tape Hiss Loop URL</label>
                    <input type="text" name="hissUrl" value={config.audios.hissUrl} onChange={handleAudioChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-2.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase tracking-widest">Button Interaction Click Sound URL</label>
                    <input type="text" name="clickUrl" value={config.audios.clickUrl} onChange={handleAudioChange} className="w-full bg-[#070708] border border-neutral-900 rounded-lg p-2.5 text-xs text-[var(--text)] focus:outline-none focus:border-neutral-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase tracking-widest">Intro VHS TV Glitch Sound URL</label>
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
                      draggable
                      onDragStart={(e) => setDraggedSectionIndex(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleSectionDrop(e, idx)}
                      className={`flex justify-between items-center p-4 bg-neutral-900/60 border rounded-xl transition-colors cursor-move ${draggedSectionIndex === idx ? 'opacity-50 border-[var(--gold)]' : 'border-neutral-800/80 hover:border-neutral-700'}`}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical size={16} className="text-neutral-600" />
                        <span className="font-mono text-[9px] text-[var(--muted)]">0{idx+1}</span>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs uppercase tracking-widest text-[var(--text)]">
                            {isCustom ? `Custom Block: ${customSecTitle || "Section"}` : `${section} Section`}
                          </span>
                          {isCustom && <span className="text-[11px] font-mono text-[var(--gold)] mt-0.5 uppercase">DYNAMICALLY CREATED</span>}
                        </div>
                      </div>

                      <div className="flex gap-2">
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
                          <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Block Title</label>
                          <input type="text" value={sec.title} onChange={(e) => handleCustomSectionChange(sec.id, "title", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-bold" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Subtitle Tag</label>
                          <input type="text" value={sec.subtitle} onChange={(e) => handleCustomSectionChange(sec.id, "subtitle", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] uppercase tracking-wider" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Layout Format</label>
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
                          <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Block Content Body Paragraph</label>
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
              <div className="p-3 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-lg">
                <p className="text-[10px] text-[var(--gold)] uppercase font-mono tracking-wider font-bold">Recommended Portrait Ratio</p>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  Use a 3:4 Portrait ratio (e.g. 1080x1440) for best results in the Founder Popup. The image will automatically fill the space.
                </p>
              </div>
              {config.founders.map((f, idx) => (
                <div 
                  key={f.id} 
                  draggable
                  onDragStart={(e) => setDraggedFounderIndex(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleFounderDrop(e, idx)}
                  className={`p-6 border rounded-xl space-y-4 relative cursor-move transition-colors ${draggedFounderIndex === idx ? 'opacity-50 border-[var(--gold)]' : 'border-neutral-900 hover:border-neutral-800'}`}
                >
                  <div className="absolute top-4 right-4 text-neutral-600">
                    <GripVertical size={16} />
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] italic text-lg font-bold border-b border-neutral-900 pb-2 mr-8">
                    Profile: {f.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Full Name</label>
                      <input type="text" value={f.name} onChange={(e) => handleFounderChange(f.id, "name", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-bold" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Role/Tagline Title</label>
                      <input type="text" value={f.role} onChange={(e) => handleFounderChange(f.id, "role", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)]" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Portrait Image</label>
                      <div className="flex gap-2">
                        <input type="text" value={f.photo} onChange={(e) => handleFounderChange(f.id, "photo", e.target.value)} className="flex-1 bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-mono" />
                        <label className="px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded font-bold text-[9px] uppercase tracking-wider text-center cursor-pointer shrink-0 flex items-center justify-center">
                          {uploadingField === `founder-${f.id}` ? 'Uploading...' : 'Upload'}
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'founder', f.id)} className="hidden" disabled={uploadingField === `founder-${f.id}`} />
                        </label>
                        <button 
                          onClick={() => handleDeleteMedia(f.photo, () => handleFounderChange(f.id, "photo", ""))} 
                          className="px-3 py-2 bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 text-red-500 rounded font-bold text-[9px] uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center"
                          title="Delete portrait"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Personal Statement Quote</label>
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
                        <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Track Title</label>
                        <input type="text" value={track.title} onChange={(e) => handlePortfolioChange(idx, "title", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-bold" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Artist</label>
                        <input type="text" value={track.artist} onChange={(e) => handlePortfolioChange(idx, "artist", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)]" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Genre Label</label>
                        <input type="text" value={track.genre} onChange={(e) => handlePortfolioChange(idx, "genre", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)]" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Audio File URL / Stream Link</label>
                        <input type="text" value={track.audioUrl} onChange={(e) => handlePortfolioChange(idx, "audioUrl", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-mono" />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Cover Image</label>
                        <div className="flex gap-2">
                          <input type="text" value={track.coverUrl} onChange={(e) => handlePortfolioChange(idx, "coverUrl", e.target.value)} className="flex-1 bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-mono" />
                          <label className="px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded font-bold text-[9px] uppercase tracking-wider text-center cursor-pointer shrink-0 flex items-center justify-center">
                            {uploadingField === `showcase-${idx}` ? 'Uploading...' : 'Upload'}
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'showcase', idx)} className="hidden" disabled={uploadingField === `showcase-${idx}`} />
                          </label>
                          <button 
                            onClick={() => handleDeleteMedia(track.coverUrl, () => handlePortfolioChange(idx, "coverUrl", ""))} 
                            className="px-3 py-2 bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 text-red-500 rounded font-bold text-[9px] uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center"
                            title="Delete cover"
                          >
                            Delete
                          </button>
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

              <div className="space-y-4">
                {Object.entries((config.services || []).reduce((acc, svc, idx) => {
                  const cat = svc.category || "Uncategorized";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push({ ...svc, originalIndex: idx });
                  return acc;
                }, {})).map(([category, svcs]) => (
                  <div 
                    key={category} 
                    draggable
                    onDragStart={(e) => setDraggedCategory(category)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleCategoryDrop(e, category)}
                    className={`border rounded-xl overflow-hidden cursor-move transition-colors ${draggedCategory === category ? 'opacity-50 border-[var(--gold)]' : 'border-neutral-900'}`}
                  >
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                      className="w-full flex items-center justify-between p-4 bg-neutral-950/60 hover:bg-neutral-900 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical size={16} className="text-neutral-600" />
                        <span className="font-[family-name:var(--font-syne)] font-bold text-[var(--gold)] uppercase tracking-widest text-xs">{category} ({svcs.length})</span>
                      </div>
                      <span className="text-[var(--muted)]">{expandedCategory === category ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>
                    </button>
                    {expandedCategory === category && (
                      <div className="p-4 space-y-6 bg-neutral-950/20 border-t border-neutral-900">
                        {svcs.map((svc) => (
                          <div 
                            key={svc.id} 
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              setDraggedServiceIndex(svc.originalIndex);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleServiceDrop(e, svc.originalIndex)}
                            className={`p-6 border rounded-xl space-y-4 relative bg-[#070708] transition-all cursor-move ${draggedServiceIndex === svc.originalIndex ? 'opacity-50 border-[var(--gold)]' : 'border-neutral-800 hover:border-neutral-700'}`}
                          >
                            <button 
                              onClick={() => removeService(svc.originalIndex)}
                              className="absolute top-4 right-4 text-[var(--muted)] hover:text-red-500 p-1.5 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                            <div className="absolute top-4 left-4 text-neutral-600">
                              <GripVertical size={16} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              <div>
                                <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Service Title</label>
                                <input type="text" value={svc.name} onChange={(e) => handleServiceChange(svc.originalIndex, "name", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-2 text-xs text-[var(--text)] font-bold" />
                              </div>
                              <div>
                                <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Category Group</label>
                                <CategoryInput 
                                  initialValue={svc.category} 
                                  onCommit={(newVal) => handleCategoryRename(svc.originalIndex, newVal)} 
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Deal Price (₹)</label>
                                <input type="number" value={svc.price} onChange={(e) => handleServiceChange(svc.originalIndex, "price", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-2 text-xs text-[var(--text)] font-mono font-bold text-[var(--neon-green)]" />
                              </div>
                              <div>
                                <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Original Price (₹) - Strikethrough</label>
                                <input type="number" value={svc.originalPrice || ""} onChange={(e) => handleServiceChange(svc.originalIndex, "originalPrice", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-2 text-xs text-[var(--text)] font-mono text-neutral-500" />
                              </div>
                              <div>
                                <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Billing Unit (e.g. Per Hour, Per Song)</label>
                                <input type="text" value={svc.unit || ""} onChange={(e) => handleServiceChange(svc.originalIndex, "unit", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-2 text-xs text-[var(--text)]" />
                              </div>
                              <div>
                                <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Promotion Badge (e.g. Best Deal)</label>
                                <input type="text" value={svc.badge || ""} onChange={(e) => handleServiceChange(svc.originalIndex, "badge", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-2 text-xs text-[var(--text)] text-[var(--gold)]" />
                              </div>
                              <div className="col-span-1 md:col-span-2">
                                <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Service Summary Details</label>
                                <textarea rows="2" value={svc.description} onChange={(e) => handleServiceChange(svc.originalIndex, "description", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-2 text-xs text-[var(--text)]" />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addService(category)}
                          className="w-full py-3 border border-dashed border-[var(--gold)]/30 rounded-xl text-[var(--gold)] font-bold text-xs uppercase tracking-widest hover:bg-[var(--gold)]/10 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={14} /> Add Service Here
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: YOUTUBE WORKS */}
          {activeTab === "youtube-works" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Manage YouTube Works ({(config.youtubeWorks || []).length})</span>
                <button 
                  onClick={addYoutubeTrack}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded text-[9px] font-bold uppercase tracking-widest transition-colors"
                >
                  <Plus size={12} /> Add Video
                </button>
              </div>

              <div className="space-y-6">
                {(config.youtubeWorks || []).map((vid, idx) => (
                  <div 
                    key={vid.id} 
                    draggable
                    onDragStart={(e) => setDraggedYoutubeIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleYoutubeDrop(e, idx)}
                    className={`p-6 border rounded-xl space-y-4 relative cursor-move transition-colors ${draggedYoutubeIndex === idx ? 'opacity-50 border-[var(--gold)]' : 'border-neutral-900 bg-neutral-950/20 hover:border-neutral-800'}`}
                  >
                    <button 
                      onClick={() => removeYoutubeTrack(idx)}
                      className="absolute top-4 right-4 text-[var(--muted)] hover:text-red-500 p-1.5 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="absolute top-4 left-4 text-neutral-600">
                      <GripVertical size={16} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">YouTube URL or ID</label>
                        <div className="flex gap-2">
                          <input type="text" value={vid.videoId} onChange={(e) => handleYoutubeChange(idx, "videoId", e.target.value)} className="flex-1 w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-mono text-[var(--neon-blue)]" placeholder="https://youtu.be/... or ID" />
                          <button 
                            onClick={() => handleFetchYoutubeInfo(idx, vid.videoId)}
                            disabled={fetchingYoutube === idx}
                            className="px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-[var(--gold)] text-[var(--gold)] rounded font-bold text-[9px] uppercase tracking-wider transition-colors shrink-0 disabled:opacity-50"
                          >
                            {fetchingYoutube === idx ? "Fetching..." : "Auto Fetch"}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Video Title</label>
                        <input type="text" value={vid.title} onChange={(e) => handleYoutubeChange(idx, "title", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-bold" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Tags / Roles (e.g. Mix, Master, Beat Production)</label>
                        <input type="text" value={vid.tags || ""} onChange={(e) => handleYoutubeChange(idx, "tags", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] text-[var(--gold)] font-mono" placeholder="Comma separated roles..." />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Custom Thumbnail URL (Optional)</label>
                        <input type="text" value={vid.thumbnail || ""} onChange={(e) => handleYoutubeChange(idx, "thumbnail", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-mono text-neutral-500" placeholder="Leaves empty to auto-fetch" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: PROMOTIONS */}
          {activeTab === "promotions" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Manage Global Discount & Promo Codes</span>
              </div>

              <div className="p-6 border border-neutral-900 rounded-xl space-y-4 bg-neutral-950/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2 flex items-center gap-3">
                    <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.globalDiscount?.active || false} 
                        onChange={(e) => handlePromoChange("active", e.target.checked)}
                        className="w-4 h-4 accent-[var(--gold)] cursor-pointer"
                      />
                      Enable Global Promotion
                    </label>
                  </div>
                  
                  <div className={`col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${!config.globalDiscount?.active ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                    <div>
                      <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Banner Text (Shows at the top of the site)</label>
                      <input type="text" value={config.globalDiscount?.bannerText || ""} onChange={(e) => handlePromoChange("bannerText", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-bold" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Secret Coupon Code</label>
                      <input type="text" value={config.globalDiscount?.code || ""} onChange={(e) => handlePromoChange("code", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-mono uppercase" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Discount Type</label>
                      <select value={config.globalDiscount?.type || "percent"} onChange={(e) => handlePromoChange("type", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] focus:outline-none">
                        <option value="percent">Percentage (%)</option>
                        <option value="flat">Flat Amount (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Discount Value</label>
                      <input type="number" value={config.globalDiscount?.value || 0} onChange={(e) => handlePromoChange("value", e.target.value)} className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--neon-green)] font-mono font-bold" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BACKGROUNDS */}
          {activeTab === "backgrounds" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Manage Section Backgrounds</span>
              </div>
              <p className="text-xs text-[var(--muted)]">Upload a background image/video or paste a direct MP4/YouTube link for each section.</p>
              <div className="p-3 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-lg">
                <p className="text-[10px] text-[var(--gold)] uppercase font-mono tracking-wider font-bold">Recommended Aspect Ratio</p>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  16:9 Landscape (e.g. 1920x1080) for best desktop view. The website automatically crops and centers the image/video to fill the screen on mobile devices. You do not need separate files for mobile.
                </p>
              </div>

              <div className="space-y-6">
                {config.sectionsOrder.map((sectionId) => {
                  const bg = config.sectionBackgrounds?.[sectionId] || { type: "color", url: "", overlayOpacity: 0.5 };
                  return (
                    <div key={sectionId} className="p-6 border border-neutral-900 rounded-xl space-y-4 relative bg-neutral-950/20">
                      <h3 className="font-[family-name:var(--font-playfair)] italic text-lg font-bold border-b border-neutral-900 pb-2 uppercase text-[var(--gold)]">
                        {sectionId.replace(/-/g, " ")} Section
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Background Type</label>
                          <select 
                            value={bg.type} 
                            onChange={(e) => handleBackgroundChange(sectionId, "type", e.target.value)} 
                            className="w-full bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] focus:outline-none"
                          >
                            <option value="color">Solid Dark (Default)</option>
                            <option value="image">Image (Upload/Link)</option>
                            <option value="video">Video (MP4/YouTube)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Dark Overlay Opacity (0 to 1)</label>
                          <input 
                            type="range" 
                            min="0" max="1" step="0.1" 
                            value={bg.overlayOpacity} 
                            onChange={(e) => handleBackgroundChange(sectionId, "overlayOpacity", e.target.value)} 
                            className="w-full accent-[var(--gold)] mt-2" 
                          />
                          <div className="text-right text-[9px] font-mono mt-1 text-[var(--gold)]">{bg.overlayOpacity} opacity</div>
                        </div>

                        {bg.type !== "color" && (
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-[11px] font-mono text-[var(--muted)] mb-1 uppercase">Media URL (Paste direct link OR upload)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={bg.url} 
                                onChange={(e) => handleBackgroundChange(sectionId, "url", e.target.value)} 
                                className="flex-1 bg-[#070708] border border-neutral-900 rounded p-2 text-xs text-[var(--text)] font-mono text-[var(--neon-blue)]" 
                                placeholder="Paste MP4, Image, or YouTube URL..." 
                              />
                              <label className="px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded font-bold text-[9px] uppercase tracking-wider text-center cursor-pointer shrink-0 flex items-center justify-center">
                                {uploadingField === `bg-${sectionId}` ? 'Uploading...' : 'Upload File'}
                                <input 
                                  type="file" 
                                  accept={bg.type === "video" ? "video/*" : "image/*"} 
                                  onChange={(e) => handleBackgroundUpload(e, sectionId)} 
                                  className="hidden" 
                                  disabled={uploadingField === `bg-${sectionId}`} 
                                />
                              </label>
                              <button 
                                onClick={() => handleDeleteMedia(bg.url, () => handleBackgroundChange(sectionId, "url", ""))} 
                                className="px-3 py-2 bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 text-red-500 rounded font-bold text-[9px] uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center"
                                title="Delete media from Cloudinary"
                              >
                                Delete
                              </button>
                            </div>
                            {bg.type === "video" && <p className="text-[9px] text-[var(--muted)] mt-1 italic">For optimal performance, use a compressed .mp4 file or paste a YouTube URL.</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          </div>
        </div>
      </main>
    </div>
  );
}
