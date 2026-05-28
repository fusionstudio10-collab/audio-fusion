const fs = require('fs');

let css = fs.readFileSync('e:/audio-fusion/app/globals.css', 'utf8');

// Replace @theme inline hardcoded values with var() references
css = css.replace(
`@theme inline {
  --color-bg: #070708;
  --color-bg-card: rgba(15, 14, 12, 0.7);
  --color-text: #f5f3ef;
  --color-muted: #8e8b82;
  --color-neon-purple: #c5a059; /* Warm Gold */
  --color-neon-blue: #e2c074;   /* Pale Gold */
  --color-neon-pink: #9a6f27;   /* Bronze Gold */
  --color-neon-orange: #f59e0b; /* Amber Gold */
  --color-neon-green: #eab308;  /* Bright Gold */
  --color-gold: #c5a059;
  --color-border: rgba(197, 160, 89, 0.08);
}`,
`@theme inline {
  --color-bg: var(--bg);
  --color-bg-card: var(--bg-card);
  --color-text: var(--text);
  --color-muted: var(--muted);
  --color-neon-purple: var(--neon-purple);
  --color-neon-blue: var(--neon-blue);
  --color-neon-pink: var(--neon-pink);
  --color-neon-orange: var(--neon-orange);
  --color-neon-green: var(--neon-green);
  --color-gold: var(--gold);
  --color-border: var(--border);
}`
);

// Add [data-theme='light'] variables
const lightThemeVars = `
  [data-theme='light'] {
    --bg: #fdfbf7;
    --bg-card: rgba(253, 251, 247, 0.85);
    --text: #1a1a1a;
    --muted: #737067;
    --neon-purple: #b08d4a;
    --neon-blue: #9a7631;
    --neon-pink: #7a5820;
    --neon-orange: #c26a04;
    --neon-green: #a16f00;
    --gold: #9a7631;
    --border: rgba(0, 0, 0, 0.1);
  }
`;

css = css.replace(
  `  :root {`,
  lightThemeVars + `\n  :root {`
);

// Add smooth transition for theme changes to body
css = css.replace(
  `body {
    background: var(--bg);
    color: var(--text);`,
  `body {
    background: var(--bg);
    color: var(--text);
    transition: background-color 0.8s ease, color 0.8s ease;`
);

// Add clip-path animation classes for the cool switch effect
const animationCss = `
  /* Theme Transition Animation Overlay */
  .theme-transition-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    pointer-events: none;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .theme-transition-overlay.active {
    transform: translate(-50%, -50%) scale(3);
  }
`;

css += animationCss;

fs.writeFileSync('e:/audio-fusion/app/globals.css', css);
console.log('globals.css updated with theme variables');
