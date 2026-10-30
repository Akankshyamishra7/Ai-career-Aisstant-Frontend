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
  CheckCircle2,
  AlertCircle,
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
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0A0C10]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab("analyzer")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">
                  Career
                </span>
                <span className="font-bold text-lg tracking-tight gold-text-gradient">
                  Assistant
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-gold-500/15 text-gold-300 border border-gold-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-dark-subtle hidden sm:block">
                Predictive Tech Career Intelligence
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gold-500/15 text-gold-300 border border-gold-500/30 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-gold-400" : "text-zinc-400"
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Backend Connection Status Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                apiConnected
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
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
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-amber-400"
                }`}
              />
              <span className="hidden sm:inline">
                {apiConnected ? "Backend Ready" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Nav row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 scrollbar-none border-t border-white/[0.04]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? "bg-gold-500/15 text-gold-300 border border-gold-500/30"
                    : "text-zinc-400 hover:text-white"
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

