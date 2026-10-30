import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Career Assistant | Predictive Tech Career Intelligence",
  description: "Enterprise-grade career intelligence platform powered by Next.js 15, FastAPI, Scikit-Learn, and Contextual AI Mentorship.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#06090F] text-slate-100 selection:bg-indigo-500/30 selection:text-white relative font-sans">
        {/* Subtle background ambient glow */}
        <div className="fixed inset-0 bg-mesh-dark pointer-events-none -z-10" />
        {children}
      </body>
    </html>
  );
}
