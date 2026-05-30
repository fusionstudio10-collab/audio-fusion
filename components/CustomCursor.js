"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) {
      const frameId = requestAnimationFrame(() => setIsVisible(false));
      document.documentElement.classList.remove("hide-default-cursor");
      return () => cancelAnimationFrame(frameId);
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rAF;
    let hasMoved = false;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        ringX = mouseX;
        ringY = mouseY;
        setIsVisible(true);
        document.documentElement.classList.add("hide-default-cursor");
      }
    };

    const onTouchStart = () => {
      hasMoved = false;
      setIsVisible(false);
      document.documentElement.classList.remove("hide-default-cursor");
    };

    const onMouseOver = (e) => {
      if (!hasMoved) return;
      const target = e.target.closest("[data-cursor]");
      const dot = dotRef.current;
      const ring = ringRef.current;
      const textEl = textRef.current;

      if (target) {
        const text = target.getAttribute("data-cursor-text") || "";
        if (ring) {
          ring.style.width = text ? "70px" : "48px";
          ring.style.height = text ? "70px" : "48px";
          ring.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
        }
        if (dot) {
          dot.style.transform = "translate(-50%, -50%) scale(0.4)";
        }
        if (textEl) {
          textEl.textContent = text;
          textEl.style.opacity = "1";
        }
      } else {
        if (ring) {
          ring.style.width = "28px";
          ring.style.height = "28px";
          ring.style.backgroundColor = "transparent";
        }
        if (dot) {
          dot.style.transform = "translate(-50%, -50%) scale(1)";
        }
        if (textEl) {
          textEl.textContent = "";
          textEl.style.opacity = "0";
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("mouseover", onMouseOver);

    const tick = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;

      // Lag physics
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (dot) {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
        dot.style.opacity = "1";
      }

      if (ring) {
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        ring.style.opacity = "1";
      }

      rAF = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rAF);
      document.documentElement.classList.remove("hide-default-cursor");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Lag Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border border-[rgba(255,255,255,0.25)] pointer-events-none z-[10000] mix-blend-difference -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-[width,height,background-color,opacity] duration-300 ease-out opacity-0"
        style={{
          width: "28px",
          height: "28px"
        }}
      >
        <span 
          ref={textRef}
          className="text-[9px] font-black tracking-widest text-[#f3f3f0] uppercase opacity-0 transition-opacity duration-200"
        />
      </div>

      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#f3f3f0] rounded-full pointer-events-none z-[10001] mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-[transform,opacity] duration-200 opacity-0"
      />
    </>
  );
}

