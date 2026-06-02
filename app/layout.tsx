import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: { default: "Mythic Games Store", template: "%s | Mythic Games" },
  description: "Your ultimate destination for premium gaming adventures.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'var(--surface)' }}
          className="py-10 mt-20">
          <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #60A5FA)' }}>
                <span className="text-white text-xs font-black">M</span>
              </div>
              <span className="text-sm font-bold text-white">MYTHIC GAMES</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Mythic Games Store · University Database Project
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
