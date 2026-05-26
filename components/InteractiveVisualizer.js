"use client";
import { useEffect, useRef } from "react";

export default function InteractiveVisualizer({ isPlaying = false }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, radius: 150, force: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.force = 1.0; // Reset warp force
    };

    window.addEventListener("mousemove", handleMouseMove);

    let phase = 0;
    
    // Wave configuration: neon pink, neon purple, neon blue
    const waves = [
      { color: "rgba(255, 0, 127, 0.45)", frequency: 0.005, amplitude: 50, speed: 0.03, verticalOffset: 0 },
      { color: "rgba(157, 78, 221, 0.35)", frequency: 0.008, amplitude: 35, speed: 0.02, verticalOffset: -10 },
      { color: "rgba(0, 240, 255, 0.25)", frequency: 0.003, amplitude: 60, speed: 0.015, verticalOffset: 15 },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Damp mouse coordinates
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      mouse.force *= 0.97; // Decay click/warp force over time

      // Set blend mode
      ctx.globalCompositeOperation = "screen";

      // Draw waves
      waves.forEach((w) => {
        ctx.beginPath();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = w.color.replace(/[\d.]+\)$/g, "0.8)"); // Full glow for shadows
        ctx.shadowBlur = 10;

        for (let x = 0; x < width; x++) {
          // Normal sinusoidal height
          let baseAmplitude = w.amplitude;
          if (isPlaying) {
            // Boost amplitude if track is playing
            baseAmplitude *= 1.8;
          }
          let y = Math.sin(x * w.frequency + phase * (isPlaying ? 2.5 : 1) * w.speed) * baseAmplitude + height / 2 + w.verticalOffset;

          // Apply mouse interactive distortion
          const dx = x - mouse.x;
          const distY = Math.abs(y - mouse.y);
          if (dx * dx < mouse.radius * mouse.radius && distY < mouse.radius) {
            const distance = Math.sqrt(dx * dx + (y - mouse.y) * (y - mouse.y));
            const influence = (1 - distance / mouse.radius);
            
            // Warp wave towards mouse coordinates with elastic return
            if (influence > 0) {
              const dy = mouse.y - y;
              y += dy * influence * 0.5;
            }
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      phase += 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80 z-0" />;
}
