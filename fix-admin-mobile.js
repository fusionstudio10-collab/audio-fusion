const fs = require('fs');

let page = fs.readFileSync('e:/audio-fusion/app/admin/page.js', 'utf8');

// 1. Fix the bottom nav
page = page.replace(
  `<nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0c]/95 backdrop-blur-md border-t border-neutral-900 flex items-center justify-around px-2 py-1 safe-area-pb">`,
  `<nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0c]/95 backdrop-blur-md border-t border-neutral-900 flex items-center overflow-x-auto gap-1 px-4 py-2 safe-area-pb hide-scrollbar">`
);

page = page.replace(
  `className={\`flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg transition-all min-w-0 flex-1 \${`,
  `className={\`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all flex-shrink-0 min-w-[70px] \${`
);

page = page.replace(
  `className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg transition-all min-w-0 flex-1 text-neutral-600 hover:text-neutral-400"`,
  `className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all flex-shrink-0 min-w-[70px] text-neutral-600 hover:text-neutral-400"`
);

// 2. Fix the posters layout overlapping issue
page = page.replace(
  `<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="col-span-1 md:col-span-2 flex items-center gap-4">
                        {poster.imageUrl && (
                          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-neutral-900">`,
  `<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {poster.imageUrl && (
                          <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-neutral-900">`
);

// We need to fix the overlapping delete button on the poster Image URL upload section
// The current code has the image URL input, upload button, and delete button in a flex container. 
page = page.replace(
  `<div className="flex gap-2">
                            <input type="text" value={poster.imageUrl} onChange={(e) => handlePosterChange(index, "imageUrl", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-3 text-sm text-[var(--text)]" />
                            <label className="flex items-center justify-center px-4 bg-neutral-800 hover:bg-neutral-700 rounded cursor-pointer border border-neutral-700 text-xs uppercase font-bold transition-colors">
                              {uploadingField === \`poster-\${index}\` ? "Wait..." : "Upload"}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePosterUpload(e, index)} />
                            </label>
                            {poster.imageUrl && poster.imageUrl.includes('cloudinary') && (
                              <button 
                                type="button"
                                onClick={() => handleDeleteMedia(poster.imageUrl, () => handlePosterChange(index, "imageUrl", ""))}
                                className="px-3 bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 hover:border-red-500 text-red-500 rounded flex items-center justify-center transition-colors"
                                title="Delete image from Cloudinary"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>`,
  `<div className="flex flex-wrap sm:flex-nowrap gap-2">
                            <input type="text" value={poster.imageUrl} onChange={(e) => handlePosterChange(index, "imageUrl", e.target.value)} className="flex-1 min-w-[150px] bg-neutral-900/50 border border-neutral-800 rounded p-3 text-sm text-[var(--text)]" />
                            <label className="flex items-center justify-center px-4 py-2 sm:py-0 bg-neutral-800 hover:bg-neutral-700 rounded cursor-pointer border border-neutral-700 text-xs uppercase font-bold transition-colors shrink-0">
                              {uploadingField === \`poster-\${index}\` ? "Wait..." : "Upload"}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePosterUpload(e, index)} />
                            </label>
                            {poster.imageUrl && poster.imageUrl.includes('cloudinary') && (
                              <button 
                                type="button"
                                onClick={() => handleDeleteMedia(poster.imageUrl, () => handlePosterChange(index, "imageUrl", ""))}
                                className="px-4 py-2 sm:py-0 bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 hover:border-red-500 text-red-500 rounded flex items-center justify-center transition-colors shrink-0"
                                title="Delete image from Cloudinary"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>`
);

// Ensure text truncation on the nav bar items is safe
page = page.replace(
  `{item.label.split(" ")[0]}`,
  `{item.label}`
);
page = page.replace(
  `<span className="text-[9px] font-bold uppercase tracking-wide leading-tight text-center truncate w-full">`,
  `<span className="text-[9px] font-bold uppercase tracking-wide leading-tight text-center truncate w-full whitespace-normal">`
);

fs.writeFileSync('e:/audio-fusion/app/admin/page.js', page);
console.log('Admin mobile layout fixes applied');
