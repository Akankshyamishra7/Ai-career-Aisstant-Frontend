"use client";

import React, { useState } from "react";
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Star,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { ResumeAnalysisResponse } from "@/types";

interface CareerPredictionProps {
  analysis: ResumeAnalysisResponse | null;
  onNavigateToRoadmap: (role: string, missing: string[]) => void;
  onNavigateToInterview: (role: string, skills: string[]) => void;
  onNavigateToMentor: (context: any) => void;
}

export const CareerPrediction: React.FC<CareerPredictionProps> = ({
  analysis,
  onNavigateToRoadmap,
  onNavigateToInterview,
  onNavigateToMentor,
}) => {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);

  if (!analysis) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-300 mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Resume Analyzed Yet</h2>
        <p className="text-xs text-slate-400">
          Upload or paste your resume in the Resume Analyzer tab to generate ML-powered role predictions,
          match percentages, and skill gap analysis across 12 technology domains.
        </p>
      </div>
    );
  }

  const predictions = analysis.predictions || [];
  const currentRole = predictions[selectedRoleIndex] || predictions[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>TF-IDF + Scikit-Learn Multiclass Classifier (12 Tech Roles)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Predictive Career Matching & <span className="brand-text-gradient">Skill Gap Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real algorithmic calculations comparing your extracted skills against 12 authoritative industry benchmarks.
          </p>
        </div>

        {/* Global readiness badge */}
        <div className="glass-panel-brand px-6 py-4 rounded-2xl flex items-center gap-4 self-start md:self-auto shadow-lg">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">
              Readiness Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-mono">{analysis.readiness_score}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            {analysis.readiness_score >= 80 ? "Top 10%" : "Strong"}
          </div>
        </div>
      </div>

      {/* Featured Selected Role Card */}
      {currentRole && (
        <div className="glass-panel-brand rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            {/* Role Header Info */}
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm font-mono">
                  #{selectedRoleIndex + 1} Best Fit
                </span>
                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/25">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  {currentRole.market_demand} Market Demand
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {currentRole.role}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentRole.description}
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-mono">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-bold">{currentRole.avg_salary_range}</span>
                  <span className="text-slate-400">(Avg Benchmark)</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  <span className="text-white font-bold">{currentRole.matched_skills.length}</span>
                  <span className="text-slate-400">Skills Matched</span>
                </div>
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="flex flex-col items-center justify-center bg-[#090D16] p-6 rounded-3xl border border-indigo-500/30 min-w-[220px] shadow-xl">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 font-mono">
                Role Compatibility
              </span>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#131A2B]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-indigo-500 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * currentRole.match_percentage) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-white font-mono">
                    {currentRole.match_percentage}%
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Matched</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 font-mono">
                ML Probability: {(currentRole.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-400 font-medium">
              Next recommended career sprints for {currentRole.role}:
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() =>
                  onNavigateToRoadmap(
                    currentRole.role,
                    currentRole.missing_skills
                  )
                }
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 via-violet-600 to-cyan-500 text-white hover:opacity-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)] flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Generate 12-Week Roadmap</span>
              </button>
              <button
                onClick={() =>
                  onNavigateToInterview(
                    currentRole.role,
                    currentRole.matched_skills
                  )
                }
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#090D16] text-white hover:bg-white/[0.08] border border-white/10 transition-all flex items-center gap-1.5"
              >
                <span>Launch Interview Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Skill Gap Analysis: Matched vs Missing Core vs Recommended */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
            {/* 1. Matched Skills */}
            <div className="bg-[#090D16] p-5 rounded-2xl border border-emerald-500/20 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Matched Skills
                </span>
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full font-mono">
                  {currentRole.matched_skills.length} Present
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Skills found on your resume matching this role benchmark.
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {currentRole.matched_skills.length > 0 ? (
                  currentRole.matched_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">None identified</span>
                )}
              </div>
            </div>

            {/* 2. Missing Core Skills */}
            <div className="bg-[#090D16] p-5 rounded-2xl border border-rose-500/20 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Missing Core Skills
                </span>
                <span className="text-[11px] font-bold text-rose-300 bg-rose-500/15 px-2.5 py-0.5 rounded-full font-mono">
                  {currentRole.missing_skills.length} Priority
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Essential competencies required by employers for this role.
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {currentRole.missing_skills.length > 0 ? (
                  currentRole.missing_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 font-medium">All core skills matched!</span>
                )}
              </div>
            </div>

            {/* 3. Recommended Growth Skills */}
            <div className="bg-[#090D16] p-5 rounded-2xl border border-violet-500/20 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-violet-400" />
                  Recommended Differentiators
                </span>
                <span className="text-[11px] font-bold text-violet-300 bg-violet-500/15 px-2.5 py-0.5 rounded-full font-mono">
                  Growth
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Advanced concepts that differentiate senior candidates in interviews.
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {analysis.recommended_skills?.length > 0 ? (
                  analysis.recommended_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">Advanced Architecture</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12-Role Predictions Matrix Grid */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Complete 12 Technology Roles Evaluation Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Click on any role card to inspect your personalized compatibility breakdown and missing skills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {predictions.map((pred, idx) => {
            const isSelected = selectedRoleIndex === idx;
            return (
              <div
                key={pred.role}
                onClick={() => setSelectedRoleIndex(idx)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  isSelected
                    ? "bg-indigo-500/15 border-indigo-400/50 shadow-[0_0_24px_rgba(99,102,241,0.25)]"
                    : "bg-[#090D16] border-white/5 hover:border-indigo-500/30 hover:bg-[#0E1424]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Rank #{idx + 1}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full font-mono ${
                      pred.match_percentage >= 75
                        ? "bg-emerald-500/15 text-emerald-300"
                        : pred.match_percentage >= 50
                        ? "bg-indigo-500/15 text-cyan-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {pred.match_percentage}% Match
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                  {pred.role}
                </h4>

                {/* Match bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${pred.match_percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400 font-mono">
                  <span>{pred.avg_salary_range}</span>
                  <span className="text-slate-500">{pred.matched_skills.length} matched</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
