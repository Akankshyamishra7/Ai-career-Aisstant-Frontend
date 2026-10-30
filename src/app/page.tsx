"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ResumeAnalyzer } from "@/components/ResumeAnalyzer";
import { CareerPrediction } from "@/components/CareerPrediction";
import { RoadmapView } from "@/components/RoadmapView";
import { InterviewSimulator } from "@/components/InterviewSimulator";
import { AIMentor } from "@/components/AIMentor";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { ResumeAnalysisResponse } from "@/types";
import { api } from "@/services/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("analyzer");
  const [analysis, setAnalysis] = useState<ResumeAnalysisResponse | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<string>("Checking storage...");

  // Context passed between tabs
  const [roadmapRole, setRoadmapRole] = useState<string>("Full Stack Developer");
  const [roadmapMissing, setRoadmapMissing] = useState<string[]>([]);
  const [interviewRole, setInterviewRole] = useState<string>("Full Stack Developer");
  const [interviewSkills, setInterviewSkills] = useState<string[]>([]);

  // Check health and try to load recent analysis from history
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const health = await api.checkHealth();
        if (health.status === "healthy") {
          setApiConnected(true);
          setDbStatus(
            health.database?.active_storage === "MongoDB"
              ? "MongoDB Atlas Connected"
              : "Persistent JSON Storage Ready"
          );
        } else {
          setApiConnected(false);
          setDbStatus("Backend Offline");
        }
      } catch {
        setApiConnected(false);
        setDbStatus("Backend Offline");
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  // When analysis changes, sync default roles for other tabs
  useEffect(() => {
    if (analysis) {
      setRoadmapRole(analysis.top_predicted_role);
      setRoadmapMissing(analysis.missing_skills || []);
      setInterviewRole(analysis.top_predicted_role);
      setInterviewSkills(analysis.extracted_skills.map((s) => s.name));
    }
  }, [analysis]);

  return (
    <div className="min-h-screen bg-[#06090F] flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiConnected={apiConnected}
        dbStatus={dbStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === "analyzer" && (
          <ResumeAnalyzer
            analysis={analysis}
            setAnalysis={(data) => {
              setAnalysis(data);
            }}
            onNavigateToPrediction={() => setActiveTab("prediction")}
          />
        )}

        {activeTab === "prediction" && (
          <CareerPrediction
            analysis={analysis}
            onNavigateToRoadmap={(role, missing) => {
              setRoadmapRole(role);
              setRoadmapMissing(missing);
              setActiveTab("roadmap");
            }}
            onNavigateToInterview={(role, skills) => {
              setInterviewRole(role);
              setInterviewSkills(skills);
              setActiveTab("interview");
            }}
            onNavigateToMentor={() => {
              setActiveTab("mentor");
            }}
          />
        )}

        {activeTab === "roadmap" && (
          <RoadmapView
            initialRole={roadmapRole}
            initialMissingSkills={roadmapMissing}
            currentSkills={interviewSkills}
          />
        )}

        {activeTab === "interview" && (
          <InterviewSimulator
            initialRole={interviewRole}
            skills={interviewSkills}
          />
        )}

        {activeTab === "mentor" && <AIMentor analysis={analysis} />}

        {activeTab === "analytics" && (
          <AnalyticsDashboard
            currentAnalysis={analysis}
            onSelectAnalysis={(selected) => {
              setAnalysis(selected);
              setActiveTab("analyzer");
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#06090F]/90 backdrop-blur-xl py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="font-bold text-slate-300">CareerAI Pro</span>
            <span>—</span>
            <span className="text-slate-400">Next.js 15, FastAPI, TF-IDF + Scikit-Learn & Multi-LLM Mentorship</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Obsidian & Cyber Violet Theme • 100% Production Ready
          </div>
        </div>
      </footer>
    </div>
  );
}
