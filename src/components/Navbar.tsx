"use client";

import React from "react";
import {
  Sparkles,
  FileText,
  Compass,
  MapPin,
  Mic,
  MessageSquare,
  BarChart3,
  Cpu,
  Layers,
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiConnected: boolean;
  dbStatus?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  apiConnected,
  dbStatus,
}) => {
  const tabs = [
    { id: "analyzer", label: "Resume Analyzer", icon: FileText },
    { id: "prediction", label: "Career Prediction", icon: Compass },
    { id: "roadmap", label: "12-Week Roadmap", icon: MapPin },
    { id: "interview", label: "Interview Simulator", icon: Mic },
    { id: "mentor", label: "AI Career Mentor", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#06090F]/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab("analyzer")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.45)] group-hover:scale-105 transition-all duration-300">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight brand-text-gradient">
                  CareerAI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Pro
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
                Predictive Tech Career Intelligence
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#0C111C]/80 p-1 rounded-xl border border-white/[0.06]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_16px_rgba(99,102,241,0.35)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-cyan-200" : "text-slate-400"
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Backend Status Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md transition-all ${
                apiConnected
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                  : "bg-amber-500/10 border-amber-500/25 text-amber-300"
              }`}
              title={
                apiConnected
                  ? `FastAPI Online | ${dbStatus || "Storage Ready"}`
                  : "Connecting to FastAPI backend..."
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  apiConnected
                    ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"
                    : "bg-amber-400"
                }`}
              />
              <span className="hidden sm:inline font-mono text-[11px]">
                {apiConnected ? "ML Engine Ready" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Nav row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 scrollbar-none border-t border-white/[0.04]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
