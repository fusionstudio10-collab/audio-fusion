const fs = require('fs');

// 1. Update layout.js
let layout = fs.readFileSync('e:/audio-fusion/app/layout.js', 'utf8');

if (!layout.includes('ThemeProvider')) {
  layout = layout.replace(
    `import SmoothScroll from "../components/SmoothScroll";`,
    `import SmoothScroll from "../components/SmoothScroll";\nimport { ThemeProvider } from "../components/ThemeProvider";`
  );
  
  layout = layout.replace(
    `<SmoothScroll>`,
    `<ThemeProvider>\n          <SmoothScroll>`
  );
  
  layout = layout.replace(
    `</SmoothScroll>`,
    `</SmoothScroll>\n        </ThemeProvider>`
  );
  
  // Remove hardcoded 'dark' from html class if any
  layout = layout.replace(`antialiased dark`, `antialiased`);
  
  fs.writeFileSync('e:/audio-fusion/app/layout.js', layout);
}

// 2. Update page.js
let page = fs.readFileSync('e:/audio-fusion/app/page.js', 'utf8');

if (!page.includes('ThemeToggle')) {
  page = page.replace(
    `import CustomCursor from "../components/CustomCursor";`,
    `import CustomCursor from "../components/CustomCursor";\nimport ThemeToggle from "../components/ThemeToggle";`
  );
  
  page = page.replace(
    `<CustomCursor />`,
    `<CustomCursor />\n      <ThemeToggle />`
  );
  
  fs.writeFileSync('e:/audio-fusion/app/page.js', page);
}

console.log('Layout and page updated for ThemeProvider');
