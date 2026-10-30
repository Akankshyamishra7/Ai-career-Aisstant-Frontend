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
import { ResumeAnalysisResponse, RolePrediction } from "@/types";

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
      <div className="glass-panel rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Resume Analyzed Yet</h2>
        <p className="text-xs text-zinc-400">
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-300 border border-gold-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>TF-IDF + Scikit-Learn Multiclass Classifier (12 Tech Roles)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Predictive Career Matching & <span className="gold-text-gradient">Skill Gap Analysis</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real algorithmic calculations comparing your extracted skills against our 12 authoritative industry benchmarks.
          </p>
        </div>

        {/* Global readiness badge */}
        <div className="glass-panel-gold px-5 py-3 rounded-xl flex items-center gap-4 self-start md:self-auto">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
              Career Readiness Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{analysis.readiness_score}</span>
              <span className="text-xs text-zinc-400">/ 100</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-bold text-xs">
            {analysis.readiness_score >= 80 ? "Top 10%" : "Competitive"}
          </div>
        </div>
      </div>

      {/* Featured Selected Role Card */}
      {currentRole && (
        <div className="glass-panel-gold rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            {/* Role Header Info */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gold-500 text-black">
                  #{selectedRoleIndex + 1} Ranked Match
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {currentRole.market_demand} Market Demand
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentRole.role}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {currentRole.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-gold-400" />
                  <span className="text-zinc-200 font-semibold">{currentRole.avg_salary_range}</span>
                  <span>(Avg Benchmark)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-gold-400" />
                  <span className="text-zinc-200 font-semibold">{currentRole.matched_skills.length}</span>
                  <span>Skills Matched</span>
                </div>
              </div>
            </div>

            {/* Circular / Progress Metric Gauge */}
            <div className="flex flex-col items-center justify-center bg-[#0E1117] p-6 rounded-2xl border border-gold-500/30 min-w-[220px]">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-2">
                Role Compatibility
              </span>
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-zinc-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#D4AF37] transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * currentRole.match_percentage) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-white">
                    {currentRole.match_percentage}%
                  </span>
                  <span className="text-[10px] text-gold-400 font-semibold">Matched</span>
                </div>
              </div>
              <span className="text-[11px] text-zinc-400 mt-2">
                ML Confidence: {(currentRole.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-zinc-400">
              Next recommended actions for {currentRole.role}:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() =>
                  onNavigateToRoadmap(
                    currentRole.role,
                    currentRole.missing_skills
                  )
                }
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gold-gradient text-black hover:opacity-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>Generate 12-Week Roadmap</span>
              </button>
              <button
                onClick={() =>
                  onNavigateToInterview(
                    currentRole.role,
                    currentRole.matched_skills
                  )
                }
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.04] text-white hover:bg-white/[0.08] border border-white/10 transition-all flex items-center gap-1.5"
              >
                <span>Launch Interview Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Skill Gap Analysis: Matched vs Missing Core vs Recommended */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* 1. Matched Skills */}
            <div className="bg-[#0E1117] p-5 rounded-xl border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Matched Skills
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {currentRole.matched_skills.length} Present
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Skills found on your resume matching this role benchmark.
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {currentRole.matched_skills.length > 0 ? (
                  currentRole.matched_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-500 italic">None identified</span>
                )}
              </div>
            </div>

            {/* 2. Missing Core Skills */}
            <div className="bg-[#0E1117] p-5 rounded-xl border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Missing Core Skills
                </span>
                <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  {currentRole.missing_skills.length} Priority
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Essential competencies required by employers for this role.
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {currentRole.missing_skills.length > 0 ? (
                  currentRole.missing_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
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
            <div className="bg-[#0E1117] p-5 rounded-xl border border-indigo-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-indigo-400" />
                  Recommended Differentiators
                </span>
                <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  Growth
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Advanced tools that differentiate senior candidates in interviews.
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {analysis.recommended_skills?.length > 0 ? (
                  analysis.recommended_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-500 italic">Advanced Architecture</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12-Role Predictions Matrix Grid */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold-400" />
            <span>Complete 12 Technology Roles Evaluation Matrix</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
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
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? "bg-gold-500/10 border-gold-500/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                    : "bg-[#0E1117] border-white/5 hover:border-gold-500/30 hover:bg-[#131722]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-zinc-400">
                    Rank #{idx + 1}
                  </span>
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      pred.match_percentage >= 75
                        ? "bg-emerald-500/15 text-emerald-400"
                        : pred.match_percentage >= 50
                        ? "bg-gold-500/15 text-gold-300"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {pred.match_percentage}% Match
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-gold-300 transition-colors">
                  {pred.role}
                </h4>

                {/* Match bar */}
                <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gold-gradient rounded-full transition-all duration-500"
                    style={{ width: `${pred.match_percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-3 text-[11px] text-zinc-400">
                  <span>{pred.avg_salary_range}</span>
                  <span className="text-zinc-500">{pred.matched_skills.length} matched</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

