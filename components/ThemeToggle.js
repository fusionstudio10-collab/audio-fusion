"use client";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 md:p-3 rounded-full bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 text-[var(--gold)] transition-all z-50 fixed bottom-24 right-4 sm:bottom-28 sm:right-8 group shadow-[0_0_15px_rgba(197,160,89,0.15)] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] backdrop-blur-md"
      title="Toggle Day/Night Mode"
    >
      <div className="relative w-5 h-5 md:w-6 md:h-6 overflow-hidden">
        <div className={`absolute inset-0 transition-transform duration-500 flex items-center justify-center ${theme === 'dark' ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Moon className="w-4 h-4 md:w-5 md:h-5 fill-current" />
        </div>
        <div className={`absolute inset-0 transition-transform duration-500 flex items-center justify-center ${theme === 'light' ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <Sun className="w-4 h-4 md:w-5 md:h-5 fill-current" />
        </div>
      </div>
    </button>
  );
}
