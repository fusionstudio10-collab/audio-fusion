const fs = require('fs');

const adminPath = 'e:/audio-fusion/app/admin/page.js';
let content = fs.readFileSync(adminPath, 'utf8');

// 1. Update handleImageUpload
const handleImgSearch = `      const { url } = await res.json();`;
const handleImgReplace = `      const { url } = await res.json();

      let oldUrl = null;
      if (fieldType === "logo") oldUrl = config.logoUrl;
      else if (fieldType === "founder") oldUrl = config.founders?.find(f => f.id === indexOrId)?.photo;
      else if (fieldType === "showcase") oldUrl = config.portfolio?.[indexOrId]?.coverUrl;
      else if (fieldType === "testimonial") oldUrl = config.testimonials?.[indexOrId]?.imageUrl;
      
      if (oldUrl && oldUrl.includes("res.cloudinary.com") && oldUrl !== url) {
        fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: oldUrl }) }).catch(console.error);
      }`;
content = content.replace(handleImgSearch, handleImgReplace);

// 2. Update handlePosterUpload
const posterSearch = `      const { url } = await res.json();

      const updatedPosters = [...config.posters];`;
const posterReplace = `      const { url } = await res.json();

      const oldUrl = config.posters?.[index]?.imageUrl;
      if (oldUrl && oldUrl.includes("res.cloudinary.com") && oldUrl !== url) {
        fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: oldUrl }) }).catch(console.error);
      }

      const updatedPosters = [...config.posters];`;
content = content.replace(posterSearch, posterReplace);

// 3. Update handleBackgroundUpload
const bgSearch = `      const { url } = await res.json();

      const updatedBgs = { ...(config.sectionBackgrounds || {}) };`;
const bgReplace = `      const { url } = await res.json();

      const oldUrl = config.sectionBackgrounds?.[sectionId]?.url;
      if (oldUrl && oldUrl.includes("res.cloudinary.com") && oldUrl !== url) {
        fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: oldUrl }) }).catch(console.error);
      }

      const updatedBgs = { ...(config.sectionBackgrounds || {}) };`;
content = content.replace(bgSearch, bgReplace);

fs.writeFileSync(adminPath, content);
console.log('Added Cloudinary auto-delete logic to all uploads.');
