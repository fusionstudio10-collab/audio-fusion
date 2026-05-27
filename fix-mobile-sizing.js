const fs = require('fs');

// 1. Fix YoutubeShowcase (make cards smaller on mobile)
const ytPath = 'e:/audio-fusion/components/YoutubeShowcase.js';
let ytContent = fs.readFileSync(ytPath, 'utf8');
ytContent = ytContent.replace(/w-\[85vw\]/g, 'w-[75vw]');
fs.writeFileSync(ytPath, ytContent);

// 2. Fix PosterGallery (disable drag on mobile + make smaller)
const posterPath = 'e:/audio-fusion/components/PosterGallery.js';
let posterContent = fs.readFileSync(posterPath, 'utf8');

// Disable drag
const dragSearch = `  const handlePointerDown = (e) => {
    isDraggingRef.current = true;`;
const dragReplace = `  const handlePointerDown = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return; // Disable drag on mobile to prevent scroll lag
    isDraggingRef.current = true;`;
posterContent = posterContent.replace(dragSearch, dragReplace);

// Make CSS responsive
const cssSearch = `.carousel-ring {
          position: relative;
          width: 300px;
          height: 400px;
          transform-style: preserve-3d;
        }`;
const cssReplace = `.carousel-ring {
          position: relative;
          width: 200px;
          height: 300px;
          transform-style: preserve-3d;
        }
        @media (min-width: 640px) {
          .carousel-ring {
            width: 300px;
            height: 400px;
          }
        }`;
posterContent = posterContent.replace(cssSearch, cssReplace);

fs.writeFileSync(posterPath, posterContent);
console.log('Fixed mobile sizing and scroll blocks');
