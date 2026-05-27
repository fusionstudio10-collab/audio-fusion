import { Syne, Instrument_Serif, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "../components/Toast";
import SmoothScroll from "../components/SmoothScroll";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Audio Fusion Studio | Premium Sound",
  description: "Your Design-Led Studio Partner. High-end audio mixing, mastering, and production.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${instrumentSerif.variable} ${playfair.variable} font-sans h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <SmoothScroll>
          {children}
          <ToastContainer />
        </SmoothScroll>
      </body>
    </html>
  );
}
