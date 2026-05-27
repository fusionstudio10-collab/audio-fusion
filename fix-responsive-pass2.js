const fs = require('fs');

// ─── globals.css ─────────────────────────────────────────────────
let css = fs.readFileSync('e:/audio-fusion/app/globals.css', 'utf8');
// Fix 100vh → 100svh for iOS Safari
css = css.replace(
  `height: 100vh !important;`,
  `height: 100svh !important;`
);
fs.writeFileSync('e:/audio-fusion/app/globals.css', css);
console.log('✓ globals.css - 100svh fix');

// ─── FounderShowcase.js ─────────────────────────────────────────
let founder = fs.readFileSync('e:/audio-fusion/components/FounderShowcase.js', 'utf8');
// Modal max-h-[90vh] → max-h-[90svh]
founder = founder.replace(
  `max-h-[90vh]`,
  `max-h-[90svh]`
);
// Modal heading text-4xl sm:text-5xl → text-3xl sm:text-4xl md:text-5xl
founder = founder.replace(
  `text-4xl sm:text-5xl font-black mt-1 text-white`,
  `text-3xl sm:text-4xl md:text-5xl font-black mt-1 text-white`
);
// Modal bio text-lg sm:text-xl → text-base sm:text-lg
founder = founder.replace(
  `text-lg sm:text-xl leading-relaxed text-[var(--muted)] font-sans`,
  `text-sm sm:text-base md:text-lg leading-relaxed text-[var(--muted)] font-sans`
);
// VHS corner text — wrap parent in overflow-hidden
founder = founder.replace(
  `<div className="text-center relative z-20 px-6 max-w-lg">`,
  `<div className="text-center relative z-20 px-5 max-w-lg overflow-hidden">`
);
fs.writeFileSync('e:/audio-fusion/components/FounderShowcase.js', founder);
console.log('✓ FounderShowcase.js');

// ─── app/page.js ─────────────────────────────────────────────────
let page = fs.readFileSync('e:/audio-fusion/app/page.js', 'utf8');

// Hero h1 clamp - increase min clamp a bit, set safe min 
page = page.replace(
  `text-[clamp(56px,14vw,220px)]`,
  `text-[clamp(48px,13vw,220px)]`
);

// Hero bottom padding pb-16 sm:pb-24 → pb-10 sm:pb-16 md:pb-24
page = page.replace(
  `pb-16 sm:pb-24 relative overflow-hidden pt-20`,
  `pb-10 sm:pb-16 md:pb-24 relative overflow-hidden pt-20`
);

// Footer grid gap-12 → gap-6 sm:gap-12
page = page.replace(
  `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16`,
  `grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-16`
);

// Inner footer grid gap-10 → gap-6 sm:gap-10
page = page.replace(
  `grid grid-cols-1 sm:grid-cols-3 gap-10`,
  `grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10`
);

fs.writeFileSync('e:/audio-fusion/app/page.js', page);
console.log('✓ app/page.js');

// ─── IntroSplash.js ─────────────────────────────────────────────
let intro = fs.readFileSync('e:/audio-fusion/components/IntroSplash.js', 'utf8');
// VHS corner absolute text - hide on very small screens
intro = intro.replace(
  `className="absolute top-[-100px] left-[-30px] font-mono text-[9px] tracking-widest text-[var(--neon-green)] opacity-60 text-left"`,
  `className="hidden sm:block absolute top-[-100px] left-[-30px] font-mono text-[9px] tracking-widest text-[var(--neon-green)] opacity-60 text-left"`
);
// Fallback h1 add sm: breakpoint
intro = intro.replace(
  `font-black text-5xl md:text-7xl text-[var(--text)]`,
  `font-black text-4xl sm:text-5xl md:text-7xl text-[var(--text)]`
);
fs.writeFileSync('e:/audio-fusion/components/IntroSplash.js', intro);
console.log('✓ IntroSplash.js');

// ─── ServicesList.js ─────────────────────────────────────────────
let svc = fs.readFileSync('e:/audio-fusion/components/ServicesList.js', 'utf8');
// Section py reduction
svc = svc.replace(
  `<section id="services" className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-6xl mx-auto relative z-10">`,
  `<section id="services" className="py-14 sm:py-20 md:py-28 px-4 sm:px-8 md:px-16 max-w-6xl mx-auto relative z-10">`
);
// space-y reduction 
svc = svc.replace(
  `<div className="space-y-16 sm:space-y-24">`,
  `<div className="space-y-10 sm:space-y-16 md:space-y-24">`
);
// Inquire button touch target
svc = svc.replace(
  `className="w-full py-3 border rounded-lg`,
  `className="w-full py-3.5 border rounded-lg`
);
fs.writeFileSync('e:/audio-fusion/components/ServicesList.js', svc);
console.log('✓ ServicesList.js');

// ─── BookingFlow.js ─────────────────────────────────────────────
let booking = fs.readFileSync('e:/audio-fusion/components/BookingFlow.js', 'utf8');
// Section py reduction
booking = booking.replace(
  `<section id="booking" className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-4xl mx-auto relative z-10">`,
  `<section id="booking" className="py-14 sm:py-20 md:py-28 px-4 sm:px-8 md:px-16 max-w-4xl mx-auto relative z-10">`
);
fs.writeFileSync('e:/audio-fusion/components/BookingFlow.js', booking);
console.log('✓ BookingFlow.js');

// ─── PortfolioShowcase.js ─────────────────────────────────────────
let portfolio = fs.readFileSync('e:/audio-fusion/components/PortfolioShowcase.js', 'utf8');
// Section py reduction
portfolio = portfolio.replace(
  `<section id="showcase" className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-6xl mx-auto relative z-10">`,
  `<section id="showcase" className="py-14 sm:py-20 md:py-28 px-4 sm:px-8 md:px-16 max-w-6xl mx-auto relative z-10">`
);
fs.writeFileSync('e:/audio-fusion/components/PortfolioShowcase.js', portfolio);
console.log('✓ PortfolioShowcase.js');

// ─── YoutubeShowcase.js ─────────────────────────────────────────
let yt = fs.readFileSync('e:/audio-fusion/components/YoutubeShowcase.js', 'utf8');
// Section py reduction
yt = yt.replace(
  `<section id="youtube-works" className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-7xl mx-auto relative z-10">`,
  `<section id="youtube-works" className="py-14 sm:py-20 md:py-28 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto relative z-10">`
);
fs.writeFileSync('e:/audio-fusion/components/YoutubeShowcase.js', yt);
console.log('✓ YoutubeShowcase.js');

// ─── TestimonialMarquee.js ─────────────────────────────────────────
let marquee = fs.readFileSync('e:/audio-fusion/components/TestimonialMarquee.js', 'utf8');
// Section py reduction
marquee = marquee.replace(
  `<section className="py-20 sm:py-28 bg-[#070708] relative overflow-hidden z-10 border-t border-neutral-900">`,
  `<section className="py-14 sm:py-20 md:py-28 bg-[#070708] relative overflow-hidden z-10 border-t border-neutral-900">`
);
fs.writeFileSync('e:/audio-fusion/components/TestimonialMarquee.js', marquee);
console.log('✓ TestimonialMarquee.js');

console.log('\n✅ All remaining responsive fixes applied!');
