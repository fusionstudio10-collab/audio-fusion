const fs = require('fs');

const path = 'e:/audio-fusion/app/admin/page.js';
let content = fs.readFileSync(path, 'utf8');

// Replace text sizes sequentially to avoid double-replacement issues
content = content.replace(/text-xs/g, 'text-sm');
content = content.replace(/text-\[11px\]/g, 'text-[13px]');
content = content.replace(/text-\[10px\]/g, 'text-xs');
content = content.replace(/text-\[9px\]/g, 'text-[11px]');

fs.writeFileSync(path, content);
console.log('Successfully increased text sizes in admin panel.');
