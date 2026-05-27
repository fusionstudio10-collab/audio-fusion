const fs = require('fs');

// 1. Update TestimonialMarquee.js
const marqueePath = 'e:/audio-fusion/components/TestimonialMarquee.js';
let marqueeContent = fs.readFileSync(marqueePath, 'utf8');
const avatarSearch = `<div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                  <span className="font-bold text-[var(--gold)]">{item.client.charAt(0)}</span>
                </div>`;
const avatarReplace = `<div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.client} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-[var(--gold)]">{item.client ? item.client.charAt(0) : ''}</span>
                  )}
                </div>`;
marqueeContent = marqueeContent.replace(avatarSearch, avatarReplace);
fs.writeFileSync(marqueePath, marqueeContent);

// 2. Update Admin Page
const adminPath = 'e:/audio-fusion/app/admin/page.js';
let adminContent = fs.readFileSync(adminPath, 'utf8');

// Add upload handler logic
const uploadSearch = `setConfig({ ...config, portfolio: updatedPortfolio });
      }`;
const uploadReplace = `setConfig({ ...config, portfolio: updatedPortfolio });
      } else if (fieldType === "testimonial") {
        const updatedTestimonials = [...(config.testimonials || [])];
        updatedTestimonials[indexOrId] = { ...updatedTestimonials[indexOrId], imageUrl: url };
        setConfig({ ...config, testimonials: updatedTestimonials });
      }`;
adminContent = adminContent.replace(uploadSearch, uploadReplace);

// Add UI fields
const uiSearch = `                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-[13px] font-mono text-[var(--muted)] mb-1 uppercase">Review Text</label>
                        <textarea value={t.text || ""} onChange={(e) => handleTestimonialChange(index, "text", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-3 text-sm text-[var(--text)] min-h-[100px] leading-relaxed" />
                      </div>`;
const uiReplace = `                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-[13px] font-mono text-[var(--muted)] mb-1 uppercase">Review Text</label>
                        <textarea value={t.text || ""} onChange={(e) => handleTestimonialChange(index, "text", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-3 text-sm text-[var(--text)] min-h-[100px] leading-relaxed" />
                      </div>
                      <div className="col-span-1 md:col-span-2 border-t border-neutral-900 pt-4 mt-2">
                        <label className="block text-[13px] font-mono text-[var(--muted)] mb-2 uppercase">Client Photo (URL or Upload)</label>
                        <div className="flex items-center gap-4">
                          {t.imageUrl && (
                            <img src={t.imageUrl} alt="Client" className="w-12 h-12 rounded-full object-cover border border-neutral-700" />
                          )}
                          <input type="text" value={t.imageUrl || ""} onChange={(e) => handleTestimonialChange(index, "imageUrl", e.target.value)} placeholder="Paste image URL here" className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded p-3 text-sm text-[var(--text)]" />
                          <label className={\`cursor-pointer px-4 py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap \${uploadingField === \`testimonial-\${index}\` ? 'bg-neutral-800 text-[var(--muted)]' : 'bg-[#0b0b0d] hover:bg-neutral-800 text-white border border-neutral-800'}\`}>
                            {uploadingField === \`testimonial-\${index}\` ? "Wait..." : "Upload"}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "testimonial", index)} disabled={uploadingField === \`testimonial-\${index}\`} />
                          </label>
                        </div>
                      </div>`;
adminContent = adminContent.replace(uiSearch, uiReplace);

fs.writeFileSync(adminPath, adminContent);
console.log('Updated testimonials with image support');
