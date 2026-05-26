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
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "psyclone",
      name: "Psyclone",
      role: "Sound Architect / Mix Engineer",
      bio: "Analogue synth designer and spatial mixologist. Sweating frequencies and building custom sonic systems for cinematic impact.",
      photo: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=600&auto=format&fit=crop"
    }
  ],

  services: [
    {
      id: "rec-session",
      category: "Recording Services",
      name: "Recording Session",
      price: 800,
      originalPrice: 1000,
      unit: "Per Hour",
      description: "Track in an acoustically perfect room using high-end analog gear to capture the rawest, warmest sound possible.",
      badge: "Best Vocal Space"
    },
    {
      id: "premium-mix",
      category: "Mixing & Mastering",
      name: "Premium Mix & Master",
      price: 3500,
      originalPrice: 5000,
      unit: "Per Song",
      description: "Vocal tuning, dynamic balance, and analog gear warmth for a loud, Spotify-competitive finish.",
      badge: "Popular"
    },
    {
      id: "complete-pack",
      category: "Music Production",
      name: "Complete Music Package",
      price: 10000,
      originalPrice: 12000,
      unit: "Full Track",
      description: "Includes custom beat production, 2 hours recording session, and premium mix/master with revision options.",
      badge: "Artist Choice"
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

  sectionsOrder: ["hero", "custom-studio-philosophy", "founders", "showcase", "services", "booking", "contact"]
};
