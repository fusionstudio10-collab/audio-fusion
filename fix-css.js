const fs = require('fs');
let css = fs.readFileSync('e:/audio-fusion/app/globals.css');
// Convert to string in utf8. The garbage text will be mixed with \u0000.
// We can just find the index of "}" after "@keyframes blink", which is the end of the valid file.
let cssStr = css.toString('utf8');
const lastValidIndex = cssStr.lastIndexOf('}');
if (lastValidIndex !== -1) {
  cssStr = cssStr.substring(0, lastValidIndex + 1);
}
// Now append the correct marquee CSS cleanly
cssStr += `

@keyframes marquee { 
  0% { transform: translateX(0); } 
  100% { transform: translateX(-50%); } 
} 
.animate-marquee { 
  animation: marquee 30s linear infinite; 
}
`;
fs.writeFileSync('e:/audio-fusion/app/globals.css', cssStr, 'utf8');
console.log('Fixed globals.css');
