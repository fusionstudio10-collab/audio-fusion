const fs = require('fs');

// 1. Remove touch-none from PosterGallery
const posterPath = 'e:/audio-fusion/components/PosterGallery.js';
let posterContent = fs.readFileSync(posterPath, 'utf8');
posterContent = posterContent.replace(/touch-none/g, 'touch-pan-y');
fs.writeFileSync(posterPath, posterContent);

// 2. Refactor TiltCard to be perfectly smooth and lag-free on mobile
const tiltCardBulletproof = `function TiltCard({ children }) {
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
  const regex = /function TiltCard\(\{ children \}\) \{[\s\S]*?return \([\s\S]*?<\/motion\.div>\s*\);\s*\}/;
  content = content.replace(regex, tiltCardBulletproof);
  fs.writeFileSync(file, content);
});

console.log('Fixed touch-none and updated TiltCard across all components.');
