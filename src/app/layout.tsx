import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Career Assistant | Predictive Career Intelligence",
  description: "Enterprise AI Career Platform powered by Next.js, FastAPI, TF-IDF + Scikit-Learn Machine Learning, and Multi-LLM Mentorship.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0A0C10] text-[#F1F4F9] selection:bg-[#D4AF37]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
