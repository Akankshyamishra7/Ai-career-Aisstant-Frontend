"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Award,
  Sparkles,
  Zap,
  Loader2,
  Code2,
  Check,
} from "lucide-react";
import { CareerRoadmapResponse } from "@/types";
import { api } from "@/services/api";

interface RoadmapViewProps {
  initialRole?: string;
  initialMissingSkills?: string[];
  currentSkills?: string[];
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  initialRole = "Full Stack Developer",
  initialMissingSkills = [],
  currentSkills = [],
}) => {
  const [targetRole, setTargetRole] = useState(initialRole);
  const [missingSkills, setMissingSkills] = useState(initialMissingSkills);
  const [roadmap, setRoadmap] = useState<CareerRoadmapResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [completedMilestones, setCompletedMilestones] = useState<Record<number, boolean>>({});

  const ROLES_LIST = [
    "Data Analyst",
    "Machine Learning Engineer",
    "Data Scientist",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps / Cloud Engineer",
    "Mobile App Developer",
    "Cybersecurity Analyst",
    "AI / NLP Engineer",
    "Cloud Solutions Architect",
    "QA & Test Automation Engineer",
  ];

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.generateRoadmap({
        target_role: targetRole,
        current_skills: currentSkills,
        missing_skills: missingSkills.length > 0 ? missingSkills : ["Advanced Architecture"],
        timeline_weeks: 12,
      });
      setRoadmap(data);
      setCompletedMilestones({});
    } catch (err: any) {
      setError(err.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateRoadmap();
  }, [targetRole]);

  const toggleMilestoneComplete = (idx: number) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const totalMilestones = roadmap?.milestones?.length || 4;
  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalMilestones) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 glass-panel-brand rounded-3xl p-6 sm:p-10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Curriculum Architect & Progress Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            12-Week Personalized <span className="brand-text-gradient">Career Roadmap</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Targeted weekly progression bridging your skill gaps with curated industry resources, production capstones,
            and interview milestone checkpoints.
          </p>
        </div>

        {/* Role Switcher form */}
        <div className="bg-[#090D16] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1 font-mono">
              Target Objective
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-[#0D121F] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500/50"
            >
              {ROLES_LIST.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateRoadmap}
            disabled={loading}
            className="self-end sm:self-auto mt-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:opacity-95 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            <span>Regenerate Plan</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Progress & Overview Strip */}
      {roadmap && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-400">Target Role:</span>
                <span className="text-base font-extrabold text-cyan-300">{roadmap.target_role}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">{roadmap.overview}</p>
            </div>

            {/* Checklist Completion Gauge */}
            <div className="bg-[#090D16] px-5 py-3.5 rounded-2xl border border-white/10 flex items-center gap-4 min-w-[210px] shadow-md">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                  Roadmap Progress
                </span>
                <span className="text-base font-black text-white font-mono">
                  {completedCount} of {totalMilestones} Completed
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs font-mono">
                {progressPercent}%
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Milestones Cards Progression */}
      {roadmap?.milestones && (
        <div className="space-y-6">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>Phased Learning Sprints</span>
          </h2>

          <div className="space-y-4">
            {roadmap.milestones.map((m, idx) => {
              const isDone = Boolean(completedMilestones[idx]);
              return (
                <div
                  key={`${m.week_or_month}-${idx}`}
                  className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 border ${
                    isDone
                      ? "bg-emerald-950/25 border-emerald-500/30"
                      : "glass-panel hover:border-indigo-500/40"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-white/[0.06]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-cyan-200 border border-indigo-500/30 font-mono">
                          {m.week_or_month}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white">{m.title}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 pt-1 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    {/* Interactive Mark Complete Button */}
                    <button
                      onClick={() => toggleMilestoneComplete(idx)}
                      className={`self-start lg:self-center px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isDone
                          ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                          : "bg-[#090D16] text-slate-300 hover:text-white border border-white/10 hover:border-indigo-500/30"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isDone ? "Sprint Completed" : "Mark as Done"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
                    {/* Focus Skills */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                        Focus Skills
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.skills_to_learn.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-cyan-200 border border-indigo-500/20"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Resources */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                        Authoritative Resources
                      </span>
                      <div className="space-y-1.5">
                        {m.recommended_resources.map((res, rIdx) => (
                          <a
                            key={rIdx}
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#090D16] border border-white/5 hover:border-indigo-500/30 text-xs text-slate-300 hover:text-cyan-300 transition-colors group shadow-sm"
                          >
                            <span className="truncate pr-2 font-medium">{res.title}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-white/[0.04] font-mono">
                                {res.type}
                              </span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Capstone Practice Project */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                        Capstone Project
                      </span>
                      <div className="p-3.5 rounded-xl bg-[#090D16] border border-white/5 text-xs text-slate-300 leading-relaxed shadow-sm">
                        {m.practice_project}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certifications & Interview Prep Tips Footer */}
      {roadmap && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certifications Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Recommended Industry Certifications</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {roadmap.key_certifications.map((cert, cIdx) => (
                <li key={cIdx} className="flex items-start gap-2.5 bg-[#090D16] p-3 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interview Readiness Tips Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Interview Readiness Checklist</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {roadmap.interview_readiness_tips.map((tip, tIdx) => (
                <li key={tIdx} className="flex items-start gap-2.5 bg-[#090D16] p-3 rounded-xl border border-white/5">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
