"use client";
import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";

export default function SmoothScroll({ children }) {
  const pathname = usePathname();

  // Disable global smooth scroll hijacking inside the Admin CMS Panel
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothTouch: true }}>
      {children}
    </ReactLenis>

  );
}
