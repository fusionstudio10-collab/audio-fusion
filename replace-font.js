const fs = require('fs');

function replaceFont(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/font-\[family-name:var\(--font-instrument\)\] italic/g, 'font-sans');
  content = content.replace(/font-\[family-name:var\(--font-instrument\)\]/g, 'font-sans');
  fs.writeFileSync(filePath, content);
}

replaceFont('e:/audio-fusion/app/page.js');
replaceFont('e:/audio-fusion/components/FounderShowcase.js');

console.log('Font replaced in both files');
