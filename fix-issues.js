const fs = require('fs');
const path = require('path');

// 1. Fix TiltCard in components
const tiltCardOptimized = `function TiltCard({ children }) {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  if (isMobile) {
    return <div className="h-full w-full relative">{children}</div>;
  }

  const handleMouseMove = (e) => {
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
}`;

const tiltFiles = [
  'e:/audio-fusion/components/FounderShowcase.js',
  'e:/audio-fusion/components/PortfolioShowcase.js',
  'e:/audio-fusion/components/PosterGallery.js',
  'e:/audio-fusion/components/ServicesList.js',
  'e:/audio-fusion/components/YoutubeShowcase.js'
];

tiltFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match the TiltCard function
  const regex = /function TiltCard\(\{ children \}\) \{[\s\S]*?return \([\s\S]*?<\/motion\.div>\s*\);\s*\}/;
  content = content.replace(regex, tiltCardOptimized);
  fs.writeFileSync(file, content);
});

// 2. Fix Admin Panel Poster Layout
const adminPath = 'e:/audio-fusion/app/admin/page.js';
let adminContent = fs.readFileSync(adminPath, 'utf8');

const posterLayoutOld = `                  <div key={poster.id} className="p-6 border border-neutral-800 rounded-xl space-y-4 relative bg-[#070708] hover:border-neutral-700 transition-colors">
                    <button 
                      onClick={() => removePoster(index)}
                      className="absolute top-4 right-4 text-[var(--muted)] hover:text-red-500 p-1.5 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="col-span-1 md:col-span-2 flex items-center gap-4">`;

const posterLayoutNew = `                  <div key={poster.id} className="p-6 border border-neutral-800 rounded-xl relative bg-[#070708] hover:border-neutral-700 transition-colors">
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-neutral-900">
                      <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-widest text-[var(--gold)] uppercase">Poster Item {index + 1}</span>
                      <button 
                        onClick={() => removePoster(index)}
                        className="flex items-center gap-2 text-xs text-red-500 hover:text-red-400 bg-red-950/20 hover:bg-red-950/40 px-3 py-1.5 rounded transition-colors"
                        title="Remove Entire Card"
                      >
                        <Trash2 size={14} /> Remove Card
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                      <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row md:items-center gap-4">`;

adminContent = adminContent.replace(posterLayoutOld, posterLayoutNew);
fs.writeFileSync(adminPath, adminContent);

console.log('Fixes applied.');
