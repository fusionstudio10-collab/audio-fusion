"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("audio-fusion-theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme !== "dark") {
      setTimeout(() => {
        setTheme(savedTheme);
      }, 0);
    }
  }, []);

  const toggleTheme = (e) => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("audio-fusion-theme", newTheme);
    
    // Animation logic
    const isDark = newTheme === "dark";
    const overlayColor = isDark ? "#070708" : "#fdfbf7";
    
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "theme-transition-overlay";
    overlay.style.backgroundColor = overlayColor;
    
    // Get click position or default to center
    const x = e?.clientX || window.innerWidth / 2;
    const y = e?.clientY || window.innerHeight / 2;
    
    overlay.style.left = `${x}px`;
    overlay.style.top = `${y}px`;
    
    document.body.appendChild(overlay);
    
    // Trigger animation
    requestAnimationFrame(() => {
      overlay.classList.add("active");
    });
    
    // Set actual theme halfway through animation
    setTimeout(() => {
      document.documentElement.setAttribute("data-theme", newTheme);
    }, 400);
    
    // Cleanup
    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
      }, 500);
    }, 1000);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
