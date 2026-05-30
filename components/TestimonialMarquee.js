"use client";
import { useState } from "react";
import { Quote, MessageSquare, Star, X, CheckCircle2 } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

function StarRating({ count }) {
  if (!count) return null;
  return (
    <div className="flex gap-0.5 mb-4 text-[var(--gold)]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          className={`w-3.5 h-3.5 ${i < count ? "fill-[var(--gold)] text-[var(--gold)]" : "text-neutral-800"}`} 
        />
      ))}
    </div>
  );
}

// Client-side image compression utility
const compressImage = (file, maxDimension = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Canvas blob conversion failed"));
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

function SwipeCard({ item, active, index, onSwipe }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform drag distance into rotation and opacity
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 120) {
      onSwipe("right");
    } else if (info.offset.x < -120) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        opacity,
        zIndex: index,
        transformStyle: "preserve-3d",
      }}
      drag={active}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={
        active
          ? { scale: 1, y: 0, rotateY: 0 }
          : { scale: 0.95 - (index * 0.02), y: index * 10, rotateY: 10 }
      }
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`absolute w-full max-w-[400px] glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-neutral-900/60 bg-neutral-950/80 shadow-2xl ${active ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"} select-none`}
    >
      <div>
        <Quote className="w-10 h-10 text-[var(--gold)]/40 mb-6" />
        {item.rating && <StarRating count={item.rating} />}
        <p className="font-sans text-base sm:text-lg text-white leading-relaxed mb-8 italic">
          &quot;{item.text}&quot;
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[var(--bg)] flex items-center justify-center border border-[var(--border)] overflow-hidden shrink-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.client} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-[var(--gold)] text-lg">{item.client ? item.client.charAt(0) : ''}</span>
          )}
        </div>
        <div>
          <h4 className="font-bold text-white text-base">{item.client}</h4>
          <p className="font-mono text-xs text-[var(--muted)] tracking-widest uppercase">{item.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialMarquee({ testimonials = [], layout = "marquee", googleReviewUrl = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newTestimonials, setNewTestimonials] = useState([]);
  
  // Merge newly submitted reviews in local state with the props list
  const allTestimonials = [...newTestimonials, ...testimonials];

  // Review submission state variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientRole, setClientRole] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");

  // Review photo upload state variables
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");

  if (!allTestimonials || allTestimonials.length === 0) return null;

  // Duplicate array for infinite marquee layout
  const marqueeItems = [...allTestimonials, ...allTestimonials, ...allTestimonials, ...allTestimonials];

  const handleSwipe = () => {
    setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file.");
      return;
    }

    setUploadingPhoto(true);
    setPhotoError("");
    setPhotoUrl("");

    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed);
      formData.append("folder", "audio-fusion/testimonials");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setPhotoUrl(data.url);
      } else {
        setPhotoError("Failed to upload image. Please try again.");
      }
    } catch (err) {
      setPhotoError("Failed to process image.");
      console.error(err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientRole.trim() || !reviewText.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    
    setSubmitting(true);
    setError("");
    
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: clientName,
          role: clientRole,
          text: reviewText,
          rating,
          imageUrl: photoUrl
        })
      });
      
      if (res.ok) {
        setSubmitted(true);
        // Prepend review directly in local UI state
        const newReview = {
          client: clientName.trim(),
          role: clientRole.trim(),
          text: reviewText.trim(),
          rating: Number(rating) || 5,
          imageUrl: photoUrl
        };
        setNewTestimonials((prev) => [newReview, ...prev]);

        setClientName("");
        setClientRole("");
        setReviewText("");
        setRating(5);
        setPhotoUrl("");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const card1 = allTestimonials[currentIndex];
  const card2 = allTestimonials[(currentIndex + 1) % allTestimonials.length];
  const card3 = allTestimonials[(currentIndex + 2) % allTestimonials.length];

  return (
    <section className="py-14 sm:py-20 md:py-28 bg-[var(--bg)] relative overflow-hidden z-10 border-t border-[var(--border)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--gold)]/5 via-[var(--bg)]/80 to-[var(--bg)] z-0" />
      
      <div className="text-center mb-12 sm:mb-16 relative z-10 reveal-elem px-5">
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-[var(--gold)]">
          Client Feedback
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl font-black mt-2">
          Artists We&apos;ve Amplified
        </h2>
      </div>

      {allTestimonials.length > 0 && (
        <>
          {layout === "slider" ? (
            <div className="relative w-full max-w-[400px] h-[380px] mx-auto flex items-center justify-center z-10 select-none">
              {/* Card 3 (Bottom-most) */}
              {allTestimonials.length > 2 && (
                <SwipeCard item={card3} active={false} index={0} onSwipe={handleSwipe} key={`swipe-${(currentIndex + 2) % allTestimonials.length}`} />
              )}
              {/* Card 2 (Middle) */}
              {allTestimonials.length > 1 && (
                <SwipeCard item={card2} active={false} index={1} onSwipe={handleSwipe} key={`swipe-${(currentIndex + 1) % allTestimonials.length}`} />
              )}
              {/* Card 1 (Top, draggable) */}
              <SwipeCard item={card1} active={true} index={2} onSwipe={handleSwipe} key={`swipe-${currentIndex}`} />
              
              <div className="absolute -bottom-12 flex items-center gap-4">
                <span className="text-[10px] font-mono tracking-widest text-[var(--muted)] uppercase">Drag / Swipe Card to Next</span>
              </div>
            </div>
          ) : layout === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 z-10 relative">
              {allTestimonials.map((item, idx) => (
                <div 
                  key={idx} 
                  className="glass-card border border-neutral-900/60 rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--gold)]/30 hover:-translate-y-1.5 transition-all duration-300 relative"
                >
                  <div>
                    <Quote className="w-8 h-8 text-[var(--gold)]/40 mb-4" />
                    {item.rating && <StarRating count={item.rating} />}
                    <p className="font-sans text-sm sm:text-base text-[var(--text)] leading-relaxed mb-6 italic">
                      &quot;{item.text}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--bg)] flex items-center justify-center border border-[var(--border)] overflow-hidden shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.client} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-[var(--gold)]">{item.client ? item.client.charAt(0) : ''}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text)] text-sm">{item.client}</h4>
                      <p className="font-mono text-[10px] text-[var(--muted)] tracking-widest uppercase">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative w-full overflow-hidden flex flex-col gap-6 z-10">
              <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[var(--bg)] to-transparent z-20" />
              <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[var(--bg)] to-transparent z-20" />

              <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                {marqueeItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="w-[260px] sm:w-[360px] mx-3 sm:mx-4 flex-shrink-0 glass-card rounded-2xl p-4 sm:p-6 hover:border-[var(--gold)]/30 transition-all duration-300"
                  >
                    <Quote className="w-8 h-8 text-[var(--gold)]/40 mb-4" />
                    {item.rating && <StarRating count={item.rating} />}
                    <p className="font-sans text-sm sm:text-base text-[var(--text)] leading-relaxed mb-6 italic">
                      &quot;{item.text}&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--bg)] flex items-center justify-center border border-[var(--border)] overflow-hidden shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.client} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-[var(--gold)]">{item.client ? item.client.charAt(0) : ''}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--text)] text-sm">{item.client}</h4>
                        <p className="font-mono text-[10px] text-[var(--muted)] tracking-widest uppercase">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* CTA Buttons - Web Review Modal and Google Maps */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 sm:mt-16 z-10 relative reveal-elem px-5">
        {googleReviewUrl && (
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-mono text-[11px] tracking-widest uppercase bg-neutral-900/80 border border-neutral-800 text-[var(--gold)] hover:text-white hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            <svg className="w-3.5 h-3.5 fill-current text-[var(--gold)] animate-pulse" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.415 0-6.19-2.775-6.19-6.19s2.775-6.19 6.19-6.19c1.554 0 2.969.577 4.057 1.536l3.076-3.076C19.297 2.053 15.938 1 12.24 1 5.922 1 12.24s4.922 11.24 11.24 11.24c6.236 0 11.24-5.004 11.24-11.24 0-.792-.096-1.56-.276-2.28H12.24z"/>
            </svg>
            <span>Write a Review on Google</span>
          </a>
        )}
        <button
          onClick={() => { setIsModalOpen(true); setSubmitted(false); setError(""); setPhotoUrl(""); setPhotoError(""); }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-mono text-[11px] tracking-widest uppercase bg-[var(--gold)] hover:bg-white text-black font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Write a Website Review</span>
        </button>
      </div>

      {/* DIRECT REVIEW FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => { if (!submitting) setIsModalOpen(false); }} 
            className="absolute inset-0 bg-[#070708]/85 backdrop-blur-md"
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-[500px] bg-neutral-950/90 border border-neutral-900 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-scale-up max-h-[90vh] overflow-y-auto hide-scrollbar">
            
            {/* Close button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
              className="absolute top-5 right-5 p-1.5 rounded-full border border-neutral-900 bg-[#0d0d0f]/60 hover:bg-neutral-800 text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
            
            {!submitted ? (
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] italic text-2xl sm:text-3xl font-black text-white">
                    Submit Website Review
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
                    Share your experience working with Audio Fusion Studio. Submitted reviews are published instantly on the wall.
                  </p>
                </div>
                
                {error && (
                  <div className="p-3 bg-red-950/20 border border-red-900/50 rounded-lg text-xs text-red-400 font-mono">
                    {error}
                  </div>
                )}
                
                {/* Rating Stars */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider font-bold">Your Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star 
                          className={`w-6 h-6 ${
                            star <= rating 
                              ? "fill-[var(--gold)] text-[var(--gold)]" 
                              : "text-neutral-700 hover:text-neutral-500"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-3 p-4 bg-neutral-900/20 border border-neutral-900 rounded-2xl">
                  <label className="block text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider font-bold">Your Photo (Optional)</label>
                  <div className="flex items-center gap-4">
                    {/* Preview circle */}
                    <div className="w-14 h-14 rounded-full bg-[#070708] flex items-center justify-center border border-neutral-800 overflow-hidden shrink-0">
                      {uploadingPhoto ? (
                        <div className="w-4 h-4 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
                      ) : photoUrl ? (
                        <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-neutral-600 font-mono text-[9px] uppercase tracking-wider">Empty</span>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 border border-neutral-850 bg-[#070708] hover:bg-neutral-800 text-[10px] font-mono tracking-widest uppercase text-white transition-colors rounded-xl select-none">
                        {photoUrl ? "Change Photo" : "Select Photo"}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoChange} 
                          className="hidden" 
                          disabled={uploadingPhoto}
                        />
                      </label>
                      <p className="text-[9px] text-[var(--muted)] italic">JPG/PNG. Resized & compressed automatically.</p>
                    </div>
                  </div>
                  {photoError && (
                    <p className="text-[10px] font-mono text-red-400 mt-1">{photoError}</p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider font-bold mb-2">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. MC Kabir, Aman Sahu"
                      className="w-full bg-[#070708]/60 border border-neutral-900 rounded-xl p-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--gold)]/40 font-bold"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider font-bold mb-2">Your Role / Profession</label>
                    <input 
                      type="text" 
                      required
                      value={clientRole}
                      onChange={(e) => setClientRole(e.target.value)}
                      placeholder="e.g. Music Producer, Rapper, Indie Artist"
                      className="w-full bg-[#070708]/60 border border-neutral-900 rounded-xl p-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--gold)]/40 font-mono tracking-wider uppercase text-xs"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider font-bold mb-2">Review Content</label>
                    <textarea 
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write details of your experience working with us, quality of sonics, mix/master output, or studio vibe..."
                      className="w-full bg-[#070708]/60 border border-neutral-900 rounded-xl p-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--gold)]/40 min-h-[120px] leading-relaxed resize-none"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting || uploadingPhoto}
                  className="w-full py-4 rounded-xl font-mono text-xs tracking-widest uppercase bg-[var(--gold)] text-black font-bold hover:bg-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-5 animate-fade-in">
                <div className="w-16 h-16 bg-[var(--gold)]/10 border border-[var(--gold)]/20 text-[var(--gold)] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] italic text-2xl font-black text-white">
                    Feedback Published Live!
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed max-w-sm mx-auto">
                    Aapka review website pe instantly live ho gaya hai! Hamare dynamic testimonial widgets me aapki feedback add ho chuki hai. Thank you!
                  </p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setIsModalOpen(false); }}
                  className="px-6 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-xs font-mono tracking-wider uppercase text-white transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}
    </section>
  );
}
