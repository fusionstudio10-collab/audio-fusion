const fs = require('fs');

// ─── FounderShowcase.js ─────────────────────────────────────────
let founder = fs.readFileSync('e:/audio-fusion/components/FounderShowcase.js', 'utf8');

// py-28 → py-16 sm:py-28, px-6 → px-4 sm:px-6, mb-20 → mb-10 sm:mb-20
founder = founder.replace(
  `<section id="founders" className="py-28 px-6 md:px-16 max-w-6xl mx-auto relative z-10">`,
  `<section id="founders" className="py-16 sm:py-28 px-4 sm:px-8 md:px-16 max-w-6xl mx-auto relative z-10">`
);
founder = founder.replace(
  `<div className="mb-20 text-center md:text-left reveal-elem">`,
  `<div className="mb-10 sm:mb-20 text-center md:text-left reveal-elem">`
);
// h2 text size
founder = founder.replace(
  `<h2 className="font-[family-name:var(--font-playfair)] italic text-5xl md:text-6xl font-black mt-2">`,
  `<h2 className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl md:text-6xl font-black mt-2">`
);
// Card padding mobile
founder = founder.replace(
  `className="relative rounded-2xl overflow-hidden glass-card p-8 md:p-10 border border-neutral-900 group transition-all duration-500 ease-out hover:-translate-y-1.5 cursor-pointer h-full"`,
  `className="relative rounded-2xl overflow-hidden glass-card p-5 sm:p-8 md:p-10 border border-neutral-900 group transition-all duration-500 ease-out hover:-translate-y-1.5 cursor-pointer h-full"`
);
// grid gap
founder = founder.replace(
  `<div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">`,
  `<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-16">`
);
// photo size
founder = founder.replace(
  `className="relative w-36 h-36 rounded-xl overflow-hidden shrink-0 border border-neutral-800 group-hover:border-[var(--gold)]/40 transition-colors duration-300"`,
  `className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-xl overflow-hidden shrink-0 border border-neutral-800 group-hover:border-[var(--gold)]/40 transition-colors duration-300"`
);
// name text size
founder = founder.replace(
  `<h3 className="font-[family-name:var(--font-playfair)] italic text-3xl font-bold text-[var(--text)]">`,
  `<h3 className="font-[family-name:var(--font-playfair)] italic text-2xl sm:text-3xl font-bold text-[var(--text)]">`
);
// flex direction on mobile
founder = founder.replace(
  `<div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">`,
  `<div className="relative z-10 flex flex-col gap-5 sm:gap-8 items-center">`
);
fs.writeFileSync('e:/audio-fusion/components/FounderShowcase.js', founder);
console.log('✓ FounderShowcase.js');

// ─── ServicesList.js ─────────────────────────────────────────────
let services = fs.readFileSync('e:/audio-fusion/components/ServicesList.js', 'utf8');
// Card padding
services = services.replace(
  `className="glass-card neon-glow-border rounded-xl p-8 flex flex-col justify-between border border-neutral-900 bg-[#121214] h-full transition-colors duration-300 group-hover:border-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"`,
  `className="glass-card neon-glow-border rounded-xl p-5 sm:p-8 flex flex-col justify-between border border-neutral-900 bg-[#121214] h-full transition-colors duration-300 group-hover:border-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"`
);
// Price text size
services = services.replace(
  `<span className="text-4xl font-black text-[var(--text)] font-sans tracking-normal">`,
  `<span className="text-3xl sm:text-4xl font-black text-[var(--text)] font-sans tracking-normal">`
);
// Service title
services = services.replace(
  `<h4 className="font-[family-name:var(--font-playfair)] italic text-2xl font-bold mb-4 text-[var(--text)] group-hover:text-[var(--gold)] transition-colors pr-2">`,
  `<h4 className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-[var(--text)] group-hover:text-[var(--gold)] transition-colors pr-2">`
);
fs.writeFileSync('e:/audio-fusion/components/ServicesList.js', services);
console.log('✓ ServicesList.js');

// ─── PortfolioShowcase.js ─────────────────────────────────────────
let portfolio = fs.readFileSync('e:/audio-fusion/components/PortfolioShowcase.js', 'utf8');
// Cover image height
portfolio = portfolio.replace(
  `className="relative h-[340px] w-full overflow-hidden"`,
  `className="relative h-[220px] sm:h-[280px] md:h-[340px] w-full overflow-hidden"`
);
// Track title
portfolio = portfolio.replace(
  `<h3 className="font-[family-name:var(--font-playfair)] italic text-2xl font-bold text-[var(--text)]">`,
  `<h3 className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl font-bold text-[var(--text)]">`
);
// Card padding
portfolio = portfolio.replace(
  `<div className="p-6 flex justify-between items-center bg-[var(--bg-card)]">`,
  `<div className="p-4 sm:p-6 flex justify-between items-center bg-[var(--bg-card)]">`
);
fs.writeFileSync('e:/audio-fusion/components/PortfolioShowcase.js', portfolio);
console.log('✓ PortfolioShowcase.js');

// ─── YoutubeShowcase.js ─────────────────────────────────────────
let youtube = fs.readFileSync('e:/audio-fusion/components/YoutubeShowcase.js', 'utf8');
// Card snap width - reduce on mobile
youtube = youtube.replace(
  `className="flex overflow-x-auto gap-6 sm:gap-10 pb-12 pt-4 px-4 -mx-4 custom-scrollbar snap-x snap-mandatory"`,
  `className="flex overflow-x-auto gap-4 sm:gap-10 pb-10 pt-4 px-4 -mx-4 custom-scrollbar snap-x snap-mandatory"`
);
// Thumbnail card size
youtube = youtube.replace(
  /className="w-\[75vw\] sm:w-\[420px\]/g,
  `className="w-[80vw] sm:w-[380px]`
);
youtube = youtube.replace(
  /className="w-\[85vw\]/g,
  `className="w-[80vw]`
);
fs.writeFileSync('e:/audio-fusion/components/YoutubeShowcase.js', youtube);
console.log('✓ YoutubeShowcase.js');

// ─── TestimonialMarquee.js ─────────────────────────────────────────
let marquee = fs.readFileSync('e:/audio-fusion/components/TestimonialMarquee.js', 'utf8');
// Card width
marquee = marquee.replace(
  `className="w-[300px] sm:w-[400px] mx-3 sm:mx-4 flex-shrink-0`,
  `className="w-[260px] sm:w-[360px] mx-3 sm:mx-4 flex-shrink-0`
);
// Card padding
marquee = marquee.replace(
  `className="w-[260px] sm:w-[360px] mx-3 sm:mx-4 flex-shrink-0 bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 sm:p-8`,
  `className="w-[260px] sm:w-[360px] mx-3 sm:mx-4 flex-shrink-0 bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-2xl p-4 sm:p-6`
);
fs.writeFileSync('e:/audio-fusion/components/TestimonialMarquee.js', marquee);
console.log('✓ TestimonialMarquee.js');

// ─── IntroSplash.js ─────────────────────────────────────────────
let intro = fs.readFileSync('e:/audio-fusion/components/IntroSplash.js', 'utf8');
// Logo size
intro = intro.replace(
  `<div className="w-80 h-80 sm:w-96 sm:h-96 mx-auto mb-6 relative flex items-center justify-center">`,
  `<div className="w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto mb-6 relative flex items-center justify-center">`
);
fs.writeFileSync('e:/audio-fusion/components/IntroSplash.js', intro);
console.log('✓ IntroSplash.js');

// ─── app/page.js ─────────────────────────────────────────────────
let page = fs.readFileSync('e:/audio-fusion/app/page.js', 'utf8');

// Founders section py-28 fix
page = page.replace(
  `className="min-h-[100svh] flex flex-col justify-end px-5 sm:px-8 md:px-16 pb-16 sm:pb-24 relative overflow-hidden pt-20"`,
  `className="min-h-[100svh] flex flex-col justify-end px-4 sm:px-8 md:px-16 pb-12 sm:pb-24 relative overflow-hidden pt-20"`
);

// Hero title size – clamp is already good, no change needed
// Chat bot button size fix (if too large on mobile)
page = page.replace(
  /className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-\[90\]/g,
  `className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-[90]`
);

fs.writeFileSync('e:/audio-fusion/app/page.js', page);
console.log('✓ app/page.js');

// ─── globals.css ─────────────────────────────────────────────────
// Reduce glow-blob blur on mobile (it adds jank on low-end phones)
let css = fs.readFileSync('e:/audio-fusion/app/globals.css', 'utf8');
// Reduce film-grain animation on mobile via reduced-motion
if (!css.includes('@media (prefers-reduced-motion: reduce)')) {
  css = css.replace(
    `@keyframes grain-dance {`,
    `@media (prefers-reduced-motion: reduce) {
    .film-grain { animation: none; }
    .glow-blob { animation: none; }
  }
  
  @keyframes grain-dance {`
  );
}
// Safe-area bottom padding for mobile bottom nav in admin
if (!css.includes('safe-area-pb')) {
  css += `
.safe-area-pb {
  padding-bottom: max(8px, env(safe-area-inset-bottom));
}
`;
}
fs.writeFileSync('e:/audio-fusion/app/globals.css', css);
console.log('✓ globals.css');

console.log('\n✅ All responsive fixes applied!');
