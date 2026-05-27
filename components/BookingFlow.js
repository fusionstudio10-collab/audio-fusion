"use client";
import { useState, useEffect } from "react";

export default function BookingFlow({ services = [], preselectedService = "", whatsappNumber = "7738882899", globalDiscount }) {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [clientName, setClientName] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService);
      setStep(2);
    }
  }, [preselectedService]);

  const timeSlots = ["10:00 AM", "12:30 PM", "03:00 PM", "05:30 PM", "08:00 PM", "10:30 PM"];

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const selectedSvcDetails = services.find((s) => s.name === selectedService);
  const isRecordingService = selectedService === "Other" ? false : (selectedSvcDetails ? (selectedSvcDetails.category === "Recording & Studio Bundles" || selectedSvcDetails.name.toLowerCase().includes("recording")) : true);

  const handleNextStep = () => {
    if (step === 1 && selectedService && clientName.trim() !== "") {
      if (isRecordingService) {
        setStep(2);
      } else {
        executeWhatsAppBooking(true);
      }
    }
    else if (step === 2 && selectedDate) setStep(3);
  };

  // Group services for optgroup
  const groupedServices = services.reduce((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = [];
    acc[svc.category].push(svc);
    return acc;
  }, {});

  const executeWhatsAppBooking = (skipDateTime = false) => {
    if (!selectedService) return;
    if (skipDateTime !== true && (!selectedDate || !selectedTime)) return;
    
    let dateTimeText = "";
    if (skipDateTime !== true) {
      const formattedDate = new Date(selectedDate).toLocaleDateString("en-IN", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
      dateTimeText = `%0A*Date:* ${formattedDate}%0A*Time:* ${selectedTime}`;
    }

    let promoText = "";
    if (globalDiscount?.active && couponCode.trim().toUpperCase() === globalDiscount.code.toUpperCase()) {
      promoText = `%0A*Promo Code:* ${couponCode.trim().toUpperCase()} (${globalDiscount.type === 'percent' ? globalDiscount.value + '% off' : '₹' + globalDiscount.value + ' off'})`;
    } else if (couponCode.trim()) {
      promoText = `%0A*Promo Code:* ${couponCode.trim().toUpperCase()} (Please verify)`;
    }

    const message = `Hi Audio Fusion Studio! 🎧%0A%0AMy name is *${clientName.trim()}*. I'd like to inquire/book:%0A*Service:* ${selectedService}${dateTimeText}${promoText}%0A%0APlease let me know the next steps. Thanks!`;
    const clean = whatsappNumber.replace(/\D/g, "");
    const num = clean.length === 10 ? `91${clean}` : clean;
    window.open(`https://wa.me/${num}?text=${message}`, "_blank");
  };

  return (
    <section id="booking" className="py-20 sm:py-28 px-5 sm:px-8 md:px-16 max-w-4xl mx-auto relative z-10">
      <div className="text-center mb-10 sm:mb-16 reveal-elem">
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-[var(--gold)]">
          Reserve Your Slot
        </span>
        <h2 className="font-[family-name:var(--font-playfair)] italic text-4xl sm:text-5xl font-black mt-2">
          Secure Session
        </h2>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8 md:p-12 border border-neutral-900 relative">
        {/* Step indicator */}
        {isRecordingService && (
          <div className="flex items-center justify-between mb-8 sm:mb-10 max-w-xs sm:max-w-md mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-neutral-800 -translate-y-1/2 z-0" />
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border z-10 transition-all duration-300 ${
                  step >= s
                    ? "bg-[var(--text)] text-black border-transparent shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                    : "bg-[#070708] text-[var(--muted)] border-neutral-800"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5 max-w-sm sm:max-w-md mx-auto">
            <div className="text-center">
              <h3 className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl font-bold text-center">
                What service are you booking?
              </h3>
              <p className="text-[10px] text-[var(--muted)] font-mono mt-2">(Need multiple? Select your primary one, and let us know on WhatsApp)</p>
            </div>
            
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-[var(--bg)] border border-neutral-800 rounded-lg p-3.5 sm:p-4 text-[var(--text)] focus:outline-none focus:border-[var(--gold)] text-sm"
            >
              <option value="">Choose a Service</option>
              {Object.entries(groupedServices).map(([category, svcs]) => (
                <optgroup key={category} label={category} className="bg-neutral-900 text-[var(--muted)] font-mono text-xs">
                  {svcs.map((svc) => (
                    <option key={svc.id} value={svc.name} className="text-[var(--text)] font-sans text-sm">
                      {svc.name} — ₹{svc.price} {svc.unit ? `/ ${svc.unit}` : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value="Other" className="text-[var(--gold)] font-bold">Other (Discuss via WhatsApp)</option>
            </select>

            <div>
              <input
                type="text"
                placeholder="Your Full Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[var(--bg)] border border-neutral-800 rounded-lg p-3.5 sm:p-4 text-[var(--text)] focus:outline-none focus:border-[var(--gold)] text-sm mb-2"
                required
              />
            </div>

            <div className="pt-1">
              <input
                type="text"
                placeholder="Coupon Code (Optional)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full bg-[var(--bg)] border border-neutral-800 rounded-lg p-3.5 sm:p-4 text-[var(--text)] focus:outline-none focus:border-[var(--gold)] text-sm font-mono uppercase"
              />
              {globalDiscount?.active && couponCode.trim().toUpperCase() === globalDiscount.code.toUpperCase() && (
                <p className="text-[var(--neon-green)] text-[10px] font-mono mt-2 tracking-widest uppercase">
                  ✓ Valid Code: {globalDiscount.type === 'percent' ? `${globalDiscount.value}% off applied!` : `₹${globalDiscount.value} off applied!`}
                </p>
              )}
            </div>

            <button
              onClick={handleNextStep}
              disabled={!selectedService || !clientName.trim()}
              className={`w-full py-3.5 sm:py-4 font-[family-name:var(--font-syne)] font-bold tracking-[2px] uppercase rounded transition-all text-sm mt-4 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${isRecordingService ? 'bg-[var(--text)] text-black hover:opacity-90' : 'bg-[#25D366] text-white hover:bg-[#1bbd56]'}`}
            >
              {!isRecordingService && <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.592 1.97 14.12 1.01 11.49 1.01c-5.436 0-9.86 4.37-9.864 9.8 0 1.702.451 3.361 1.307 4.8l-.988 3.606 3.693-.97c1.536.837 3.063 1.277 4.512 1.277zm10.73-7.872c-.295-.148-1.747-.862-2.016-.957-.27-.099-.467-.148-.662.15-.195.297-.756.957-.927 1.15-.17.195-.34.218-.636.07-2.955-1.477-4.14-2.148-5.77-4.94-.437-.751.437-.698 1.25-2.316.136-.27.068-.507-.034-.705-.102-.197-.812-1.955-1.112-2.68-.293-.706-.59-.61-.812-.622-.21-.01-.45-.011-.69-.011-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3.002 0 1.77 1.29 3.48 1.47 3.71.18.23 2.53 3.86 6.14 5.42.86.37 1.53.59 2.05.76.86.27 1.64.23 2.26.14.69-.1 1.75-.71 1.99-1.4.24-.69.24-1.28.17-1.4-.07-.12-.27-.19-.57-.34z"/></svg>}
              <span>{isRecordingService ? "Next Step" : "Book via WhatsApp"}</span>
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5 max-w-sm sm:max-w-md mx-auto">
            <h3 className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl font-bold text-center">
              Pick your session date
            </h3>
            <input
              type="date"
              min={getMinDate()}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[var(--bg)] border border-neutral-800 rounded-lg p-3.5 sm:p-4 text-[var(--text)] focus:outline-none focus:border-[var(--gold)] text-sm font-mono"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 sm:py-4 border border-neutral-800 text-[var(--text)] font-[family-name:var(--font-syne)] font-bold tracking-[2px] uppercase rounded hover:bg-neutral-900 transition-colors text-sm"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={!selectedDate}
                className="w-2/3 py-3.5 sm:py-4 bg-[var(--text)] text-black font-[family-name:var(--font-syne)] font-bold tracking-[2px] uppercase rounded hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed text-sm"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-5 max-w-sm sm:max-w-md mx-auto">
            <h3 className="font-[family-name:var(--font-playfair)] italic text-xl sm:text-2xl font-bold text-center">
              Select available time
            </h3>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 border rounded-lg text-[11px] sm:text-xs font-mono transition-all duration-300 ${
                    selectedTime === time
                      ? "border-[var(--gold)] text-[var(--gold)] bg-[rgba(197,160,89,0.08)] shadow-[0_0_12px_rgba(197,160,89,0.15)]"
                      : "border-neutral-800 text-[var(--muted)] hover:border-neutral-700 hover:text-[var(--text)]"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 sm:py-4 border border-neutral-800 text-[var(--text)] font-[family-name:var(--font-syne)] font-bold tracking-[2px] uppercase rounded hover:bg-neutral-900 transition-colors text-sm"
              >
                Back
              </button>
              <button
                onClick={executeWhatsAppBooking}
                disabled={!selectedTime}
                className="w-2/3 py-3.5 sm:py-4 bg-[#25D366] text-white font-[family-name:var(--font-syne)] font-bold tracking-[2px] uppercase rounded hover:bg-[#1bbd56] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Book via WhatsApp</span>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.592 1.97 14.12 1.01 11.49 1.01c-5.436 0-9.86 4.37-9.864 9.8 0 1.702.451 3.361 1.307 4.8l-.988 3.606 3.693-.97c1.536.837 3.063 1.277 4.512 1.277zm10.73-7.872c-.295-.148-1.747-.862-2.016-.957-.27-.099-.467-.148-.662.15-.195.297-.756.957-.927 1.15-.17.195-.34.218-.636.07-2.955-1.477-4.14-2.148-5.77-4.94-.437-.751.437-.698 1.25-2.316.136-.27.068-.507-.034-.705-.102-.197-.812-1.955-1.112-2.68-.293-.706-.59-.61-.812-.622-.21-.01-.45-.011-.69-.011-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3.002 0 1.77 1.29 3.48 1.47 3.71.18.23 2.53 3.86 6.14 5.42.86.37 1.53.59 2.05.76.86.27 1.64.23 2.26.14.69-.1 1.75-.71 1.99-1.4.24-.69.24-1.28.17-1.4-.07-.12-.27-.19-.57-.34z"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
