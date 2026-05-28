const fs = require('fs');

let page = fs.readFileSync('e:/audio-fusion/components/PosterGallery.js', 'utf8');

// 1. Remove justify-center and absolute top-10 to let the layout flow naturally
page = page.replace(
  `className="py-20 sm:py-28 overflow-hidden relative z-10 flex flex-col items-center bg-[#070708] min-h-[90vh] justify-center touch-pan-y select-none"`,
  `className="py-14 sm:py-20 md:py-28 overflow-hidden relative z-10 flex flex-col items-center bg-[#070708] touch-pan-y select-none"`
);

page = page.replace(
  `className="absolute top-10 w-full text-center reveal-elem z-20 pointer-events-none"`,
  `className="w-full text-center reveal-elem z-20 pointer-events-none mb-8 sm:mb-16 mt-4"`
);

// 2. Adjust carousel-scene margin-top 
page = page.replace(
  `margin-top: 50px;`,
  `margin-top: 0px;`
);

// 3. For mobile overrides, adjust heights so it doesn't take too much empty space
page = page.replace(
  `@media (max-width: 640px) {
          .carousel-scene {
            height: 400px;
          }`,
  `@media (max-width: 640px) {
          .carousel-scene {
            height: 350px;
          }`
);

fs.writeFileSync('e:/audio-fusion/components/PosterGallery.js', page);
console.log('PosterGallery mobile layout fixes applied');
