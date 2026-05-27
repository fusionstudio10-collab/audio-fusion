const fs = require('fs');

const adminPath = 'e:/audio-fusion/app/admin/page.js';
let content = fs.readFileSync(adminPath, 'utf8');

// 1. Add tab to sidebar
const tabsSearch = `    { id: "youtube-works", label: "Youtube Thumbnail", icon: Play },`;
const tabsReplace = `    { id: "youtube-works", label: "Youtube Thumbnail", icon: Play },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },`;
content = content.replace(tabsSearch, tabsReplace);

// 2. Add handler functions
const handlersSearch = `  // --- POSTERS HANDLERS ---`;
const handlersReplace = `  // --- TESTIMONIALS HANDLERS ---
  const handleTestimonialChange = (index, field, value) => {
    const updated = [...(config.testimonials || [])];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, testimonials: updated });
  };
  const addTestimonial = () => {
    const updated = [...(config.testimonials || []), { client: "New Client", role: "Artist", text: "New feedback" }];
    setConfig({ ...config, testimonials: updated });
  };
  const removeTestimonial = (index) => {
    const updated = (config.testimonials || []).filter((_, idx) => idx !== index);
    setConfig({ ...config, testimonials: updated });
  };

  // --- POSTERS HANDLERS ---`;
content = content.replace(handlersSearch, handlersReplace);

// 3. Add UI Block
const uiSearch = `          {activeTab === "services" && (`;
const uiReplace = `          {activeTab === "testimonials" && (
            <div className="animate-fade-in space-y-10">
              <div className="flex items-center justify-between pb-6 border-b border-neutral-900">
                <h3 className="font-mono text-sm tracking-[3px] text-[var(--muted)] uppercase">Manage Testimonials ({(config.testimonials || []).length})</h3>
                <button 
                  onClick={addTestimonial}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 hover:bg-[var(--gold)] hover:text-black rounded text-[11px] font-bold uppercase tracking-widest transition-colors"
                >
                  <Plus size={12} /> Add Testimonial
                </button>
              </div>
              <div className="space-y-4">
                {(config.testimonials || []).map((t, index) => (
                  <div key={index} className="p-6 border border-neutral-800 rounded-xl relative bg-[#070708] hover:border-neutral-700 transition-colors">
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-neutral-900">
                      <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-widest text-[var(--gold)] uppercase">Testimonial {index + 1}</span>
                      <button 
                        onClick={() => removeTestimonial(index)}
                        className="flex items-center gap-2 text-xs text-red-500 hover:text-red-400 bg-red-950/20 hover:bg-red-950/40 px-3 py-1.5 rounded transition-colors"
                        title="Remove Testimonial"
                      >
                        <Trash2 size={14} /> Remove Card
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                      <div>
                        <label className="block text-[13px] font-mono text-[var(--muted)] mb-1 uppercase">Client Name</label>
                        <input type="text" value={t.client || ""} onChange={(e) => handleTestimonialChange(index, "client", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-3 text-sm text-[var(--text)] font-bold" />
                      </div>
                      <div>
                        <label className="block text-[13px] font-mono text-[var(--muted)] mb-1 uppercase">Client Role / Category</label>
                        <input type="text" value={t.role || ""} onChange={(e) => handleTestimonialChange(index, "role", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-3 text-sm text-[var(--gold)] font-mono uppercase tracking-widest" />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-[13px] font-mono text-[var(--muted)] mb-1 uppercase">Review Text</label>
                        <textarea value={t.text || ""} onChange={(e) => handleTestimonialChange(index, "text", e.target.value)} className="w-full bg-neutral-900/50 border border-neutral-800 rounded p-3 text-sm text-[var(--text)] min-h-[100px] leading-relaxed" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "services" && (`;
content = content.replace(uiSearch, uiReplace);

fs.writeFileSync(adminPath, content);
console.log('Admin updated with Testimonials');
