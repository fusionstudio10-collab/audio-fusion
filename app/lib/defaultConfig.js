export const defaultConfig = {
  name: "Audio Fusion",
  whatsappNumber: "7738882899",
  email: "studio@audiofusion.com",
  logoText: "AUDIO FUSION",
  logoUrl: "/logo.jpg", // default logo
  tagline: "Your design-led audio co-founder. Hands-on. With No Overhead.",
  heroIntro: "I partner with ambitious artists & producers building the next generation of sound in hip-hop, pop & cinematic scores.",
  philosophy: "In a world where presets make it easy to mix, what truly stands out is taste. We're entering an era where sonics are the moat — and building a unique sound requires artists who can also engineer.",
  
  // Admin credentials
  adminEmail: "fusionstudio10@gmail.com",
  adminPassword: "fusionstudio2026",

  // Contact & Map info
  address: "Shop No. 17, Plot 27, Sector 20, Kharghar, Navi Mumbai, Maharashtra 410210",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8037385311235!2d73.0620864758253!3d19.028399153496035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3db2690d52b%3A0xea8a705141e2de9c!2sAudio%20Fusion%20Studio!5e0!3m2!1sen!2sin!4v1716757000000!5m2!1sen!2sin",

  audios: {
    hissUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", 
    clickUrl: "https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav", 
    glitchUrl: "https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav" 
  },

  founders: [
    {
      id: "sahu",
      name: "Manoj Sahu",
      role: "Emcee Sahu / Executive Producer",
      bio: "Raw underground pioneer. Shaping heavy low-ends, hard-hitting drill beats, and raw vocal textures that cut through the noise.",
      experience: "Over a decade of experience producing for the underground hip-hop scene. Has engineered over 500+ tracks, specializing in hard-hitting drill and trap arrangements. Co-founder of multiple independent labels and a master of vocal chain processing.",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "psyclone",
      name: "Psyclone",
      role: "Sound Architect / Mix Engineer",
      bio: "Analogue synth designer and spatial mixologist. Sweating frequencies and building custom sonic systems for cinematic impact.",
      experience: "Certified spatial audio mix engineer with deep expertise in analog hardware. Has scored independent short films and mixed chart-topping electronic tracks. Known for custom-built synthesizer patches and surgical EQ precision.",
      photo: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=600&auto=format&fit=crop"
    }
  ],

  services: [
    // 1. Recording & Studio Bundles
    {
      id: "vocal-rec", category: "Recording & Studio Bundles",
      name: "Vocal Recording", price: 800, unit: "Hour",
      description: "Raw vocal tracking session inside professionally treated acoustic booths, using industry-standard microphones."
    },
    {
      id: "rec-3hr", category: "Recording & Studio Bundles",
      name: "3-Hour Recording Package", price: 2100, originalPrice: 2400, unit: "Package",
      description: "A bulk booking discount that locks in a continuous 3-hour block for extended recording sessions.", badge: "Special Offer"
    },
    {
      id: "ultimate-bundle", category: "Recording & Studio Bundles",
      name: "The Ultimate All-In-One Bundle", price: 10000, unit: "Package",
      description: "The studio's flagship production package. It includes 2 hours of vocal recording time + Full Custom Beat Production + Premium Mix & Master.", badge: "Special Offer"
    },
    // 2. Mixing & Mastering Tiers
    {
      id: "basic-mix", category: "Mixing & Mastering Tiers",
      name: "Basic Mix & Master", price: 2000, unit: "Track",
      description: "Budget-friendly post-production leveling, standard EQ, and compression setup inside the DAW for quick preview or independent releases."
    },
    {
      id: "premium-mix", category: "Mixing & Mastering Tiers",
      name: "Premium Mix & Master", price: 3500, unit: "Track",
      description: "Industry-standard digital post-production. Includes detailed vocal tuning/pitch correction, multi-track leveling, surgical EQ, creative effects, compression, and a final polished commercial master."
    },
    {
      id: "analogue-master", category: "Mixing & Mastering Tiers",
      name: "Standard Analogue Master", price: 7500, unit: "Track",
      description: "Premium hybrid workflow. Individual multi-track stems are separated and routed through physical outboard analogue hardware to inject warmth, punch, and high-end commercial-grade harmonic depth."
    },
    // 3. Beat Production
    {
      id: "custom-beat", category: "Beat Production",
      name: "Custom Beat Production", price: 6500, unit: "Track",
      description: "An exclusive, scratch-made instrumental production service. Music arrangements are tailor-made from the ground up to match the artist's specific style, tempo, and creative vision."
    },
    // 4. Video & Post-Production Visuals
    {
      id: "basic-video", category: "Video & Post-Production Visuals",
      name: "Basic Video Shoot", price: 8500, unit: "Project",
      description: "On-location high-quality raw video capture with professional camera rigs (post-production editing not included)."
    },
    {
      id: "cinematic-video", category: "Video & Post-Production Visuals",
      name: "Cinematic Video Shoot & Edit", price: 15500, unit: "Project",
      description: "A complete visual package combining professional on-location filming with full post-production editing, transitions, and cinematic color grading."
    },
    {
      id: "complete-visual", category: "Video & Post-Production Visuals",
      name: "The Complete Visual Suite", price: 17500, unit: "Project",
      description: "The definitive media package including On-Location Video Shooting + Full Video Editing + Promotional Poster Design + Creative Visualizers/Short-form Assets for a turn-key release."
    },
    // 5. Creative Art & Poster Design
    {
      id: "standard-poster", category: "Creative Art & Poster Design",
      name: "Standard Creative Poster", price: 2000, unit: "Design",
      description: "Custom-designed cover art or promotional poster tailored to the track's theme for digital platforms."
    },
    {
      id: "master-poster", category: "Creative Art & Poster Design",
      name: "Master Creative Poster Kit", price: 3500, unit: "Kit",
      description: "Premium custom artwork adapted and resized into all required display sizes (e.g., Spotify Square, Instagram Stories/Reels, YouTube Banners, and widescreen formats)."
    },
    // 6. Distribution & Profile Management
    {
      id: "distro-basic", category: "Distribution & Profile Management",
      name: "Digital Music Distribution (Basic)", price: 2000, unit: "Release",
      description: "Global distribution bringing your tracks to Spotify, Apple Music/iTunes, JioSaavn, Amazon Music, and more."
    },
    {
      id: "distro-star", category: "Distribution & Profile Management",
      name: "Digital Music Distribution (Star Plan)", price: 2999, unit: "Release",
      description: "Premium release tier associated directly with industry partners Madverse and Songdew."
    },
    {
      id: "profile-retainer", category: "Distribution & Profile Management",
      name: "Artist Profile Management Retainer", price: 5500, unit: "Month",
      description: "A comprehensive monthly subscription handling your brand's digital presence across Instagram, Streaming Profiles (Spotify/Apple Music), and YouTube Channels. Includes hands-on management, asset uploads, strategic posting, bio updates, and setting up targeted paid ad campaigns."
    }
  ],

  posters: [
    {
      id: "p1",
      title: "Silent Kinetics",
      tag: "Identity / 2026",
      type: "poster", // 'poster' for 1:1, 'thumbnail' for 16:9
      description: "Exploring fluid dynamics in minimalist structural forms. Designed for digital exhibition panels.",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
    }
  ],

  portfolio: [
    {
      id: "track-1",
      title: "Midnight Echoes",
      artist: "Manoj Sahu",
      genre: "Underground Hip-Hop",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "track-2",
      title: "Atmospheres",
      artist: "Psyclone",
      genre: "Cinematic Ambient",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop"
    }
  ],

  customSections: [
    {
      id: "custom-studio-philosophy",
      title: "Sonic Moat Stance",
      subtitle: "PHILOSOPHY",
      layout: "text-only",
      content: "Taste is the only moat in modern audio. We believe sonics define identity, and true art is engineered, not just recorded.",
      items: []
    }
  ],

  testimonials: [
    {
      client: "Aman",
      role: "Music Producer",
      text: "Audio Fusion took my track to the next level. The mix was punchy, the master was loud, and the overall vibe was exactly what I wanted. Highly recommend!"
    },
    {
      client: "Sarah J.",
      role: "Indie Artist",
      text: "Working with this studio was an absolute dream. The attention to detail and creative input helped shape my EP into something truly special."
    },
    {
      client: "DJ Kael",
      role: "Electronic Producer",
      text: "The low-end on my tracks has never sounded so tight. These guys know exactly how to get that industry standard sound without losing the soul."
    },
    {
      client: "Priya",
      role: "Singer-Songwriter",
      text: "From vocal tuning to the final master, everything was flawless. A design-led audio approach is rare, and it shows in the final product."
    }
  ],

  youtubeWorks: [
    {
      id: "yt-1",
      title: "Audio Fusion Behind the Scenes",
      videoId: "dQw4w9WgXcQ", // Placeholder ID
      thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "yt-2",
      title: "Live Studio Session",
      videoId: "ScMzIvxBSi4", // Placeholder ID
      thumbnail: "https://images.unsplash.com/photo-1520626337854-325785f81216?q=80&w=600&auto=format&fit=crop"
    }
  ],

  globalDiscount: {
    active: false,
    type: "percent", // 'percent' or 'fixed'
    value: 10,
    code: "FESTIVAL10",
    bannerText: "Festival Sale! Get 10% off on all services. Use code: FESTIVAL10"
  },

  sectionBackgrounds: {
    "founders": { type: "color", url: "", overlayOpacity: 0 },
    "services": { type: "color", url: "", overlayOpacity: 0 },
    "portfolio": { type: "color", url: "", overlayOpacity: 0 },
    "booking": { type: "color", url: "", overlayOpacity: 0 },
    "youtube-works": { type: "color", url: "", overlayOpacity: 0 },
    "custom-studio-philosophy": { type: "color", url: "", overlayOpacity: 0 }
  },

  sectionsOrder: [
    "hero",
    "founders",
    "services",
    "posters",
    "showcase",
    "youtube-works",
    "booking",
    "contact"
  ],
};
