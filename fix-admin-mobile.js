const fs = require('fs');

const adminPath = 'e:/audio-fusion/app/admin/page.js';
let content = fs.readFileSync(adminPath, 'utf8');

// 1. Fix Admin Sidebar Tabs on Mobile (Make them horizontally scrollable)
const navSearch = `        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors text-left \${`;
const navReplace = `        <nav className="p-4 flex md:flex-col gap-2 flex-1 overflow-x-auto md:overflow-y-auto custom-scrollbar md:space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={\`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors text-left whitespace-nowrap \${`;
content = content.replace(navSearch, navReplace);

// 2. Fix Poster Image Upload Layout
const posterUploadSearch = `                          <div className="flex gap-2">
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
                          </div>`;
const posterUploadReplace = `                          <div className="flex flex-col sm:flex-row gap-2">
                            <input type="text" value={poster.imageUrl} onChange={(e) => handlePosterChange(index, "imageUrl", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-3 text-sm text-[var(--text)]" />
                            <div className="flex gap-2">
                              <label className="flex-1 sm:flex-none flex items-center justify-center px-4 py-3 sm:py-0 bg-neutral-800 hover:bg-neutral-700 rounded cursor-pointer border border-neutral-700 text-xs uppercase font-bold transition-colors whitespace-nowrap">
                                {uploadingField === \`poster-\${index}\` ? "Wait..." : "Upload"}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePosterUpload(e, index)} />
                              </label>
                              {poster.imageUrl && poster.imageUrl.includes('cloudinary') && (
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteMedia(poster.imageUrl, () => handlePosterChange(index, "imageUrl", ""))}
                                  className="px-4 sm:px-3 bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 hover:border-red-500 text-red-500 rounded flex items-center justify-center transition-colors"
                                  title="Delete image from Cloudinary"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>`;
content = content.replace(posterUploadSearch, posterUploadReplace);

// 3. Fix Portfolio Image Upload Layout (It might have the same issue)
const portfolioUploadSearch = `                          <div className="flex gap-2">
                            <input type="text" value={item.coverUrl} onChange={(e) => handlePortfolioChange(idx, "coverUrl", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-3 text-sm text-[var(--text)]" />
                            <label className="flex items-center justify-center px-4 bg-neutral-800 hover:bg-neutral-700 rounded cursor-pointer border border-neutral-700 text-xs uppercase font-bold transition-colors">
                              {uploadingField === \`showcase-\${idx}\` ? 'Wait...' : 'Upload'}
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'showcase', idx)} className="hidden" disabled={uploadingField === \`showcase-\${idx}\`} />
                            </label>
                            {item.coverUrl && item.coverUrl.includes('cloudinary') && (
                              <button type="button" onClick={() => handleDeleteMedia(item.coverUrl, () => handlePortfolioChange(idx, "coverUrl", ""))} className="px-3 bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 hover:border-red-500 text-red-500 rounded flex items-center justify-center transition-colors">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>`;
const portfolioUploadReplace = `                          <div className="flex flex-col sm:flex-row gap-2">
                            <input type="text" value={item.coverUrl} onChange={(e) => handlePortfolioChange(idx, "coverUrl", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-3 text-sm text-[var(--text)]" />
                            <div className="flex gap-2">
                              <label className="flex-1 sm:flex-none flex items-center justify-center px-4 py-3 sm:py-0 bg-neutral-800 hover:bg-neutral-700 rounded cursor-pointer border border-neutral-700 text-xs uppercase font-bold transition-colors whitespace-nowrap">
                                {uploadingField === \`showcase-\${idx}\` ? 'Wait...' : 'Upload'}
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'showcase', idx)} className="hidden" disabled={uploadingField === \`showcase-\${idx}\`} />
                              </label>
                              {item.coverUrl && item.coverUrl.includes('cloudinary') && (
                                <button type="button" onClick={() => handleDeleteMedia(item.coverUrl, () => handlePortfolioChange(idx, "coverUrl", ""))} className="px-4 sm:px-3 bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 hover:border-red-500 text-red-500 rounded flex items-center justify-center transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>`;
content = content.replace(portfolioUploadSearch, portfolioUploadReplace);

fs.writeFileSync(adminPath, content);
console.log('Mobile layout fixes applied to Admin Panel');
