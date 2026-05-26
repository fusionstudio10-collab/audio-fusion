"use client";
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Toast Store (module-level singleton) ─────────────────────────────────────
let listeners = [];
let toasts = [];

function notify(toast) {
  toasts = [
    ...toasts,
    { id: Date.now() + Math.random(), ...toast },
  ];
  listeners.forEach((l) => l(toasts));
}

export const toast = {
  success: (msg) => notify({ type: "success", msg }),
  error:   (msg) => notify({ type: "error",   msg }),
  warn:    (msg) => notify({ type: "warn",     msg }),
  info:    (msg) => notify({ type: "info",     msg }),
};

// ─── Single Toast Item ────────────────────────────────────────────────────────
const ICONS = {
  success: <CheckCircle2 className="w-4 h-4 shrink-0" />,
  error:   <XCircle      className="w-4 h-4 shrink-0" />,
  warn:    <AlertTriangle className="w-4 h-4 shrink-0" />,
  info:    <Info          className="w-4 h-4 shrink-0" />,
};

const COLORS = {
  success: "border-[#22c55e]/30 text-[#22c55e]",
  error:   "border-red-500/30   text-red-400",
  warn:    "border-amber-400/30 text-amber-400",
  info:    "border-[var(--gold)]/30 text-[var(--gold)]",
};

function ToastItem({ id, type = "info", msg, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    const t1 = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after 3.5 s
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 350);
    }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [id, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-md
        bg-[#0d0d0f]/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)]
        transition-all duration-350 ease-out
        ${COLORS[type]}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
      `}
      style={{ minWidth: 260, maxWidth: 360 }}
    >
      <span className="mt-0.5">{ICONS[type]}</span>
      <p className="flex-1 text-[11px] font-[family-name:var(--font-syne)] font-bold tracking-wide text-[#f5f3ef] leading-relaxed">
        {msg}
      </p>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(id), 350); }}
        className="text-neutral-600 hover:text-white transition-colors mt-0.5 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Toast Container (render at root via portal) ──────────────────────────────
export function ToastContainer() {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    listeners.push(setItems);
    return () => { listeners = listeners.filter((l) => l !== setItems); };
  }, []);

  const remove = useCallback((id) => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toasts));
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] flex flex-col gap-2 items-center">
      {items.map((t) => (
        <ToastItem key={t.id} {...t} onRemove={remove} />
      ))}
    </div>,
    document.body
  );
}
