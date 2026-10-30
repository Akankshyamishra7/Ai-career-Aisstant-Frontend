"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
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
import { CareerRoadmapResponse, RoadmapMilestone } from "@/types";
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

  // Local checklist progress state
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
    // Generate initial roadmap on first view
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 glass-panel-gold rounded-2xl p-6 sm:p-8">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-300 border border-gold-500/30">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>AI Curriculum Architect & Progress Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            12-Week Personalized <span className="gold-text-gradient">Career Learning Roadmap</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Targeted weekly progression bridging your skill gaps with curated resources, production capstones,
            and interview milestone checkpoints.
          </p>
        </div>

        {/* Role Switcher form */}
        <div className="bg-[#0E1117] p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block mb-1">
              Select Target Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-[#141822] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-gold-500/50"
            >
              {ROLES_LIST.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateRoadmap}
            disabled={loading}
            className="self-end sm:self-auto mt-auto px-4 py-2 rounded-lg text-xs font-bold bg-gold-gradient text-black hover:opacity-95 transition-all shadow-[0_0_12px_rgba(212,175,55,0.2)] flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 fill-black" />
            )}
            <span>Regenerate Plan</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Progress & Overview Strip */}
      {roadmap && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Target Objective:</span>
                <span className="text-sm font-extrabold text-gold-400">{roadmap.target_role}</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{roadmap.overview}</p>
            </div>

            {/* Checklist Completion Gauge */}
            <div className="bg-[#0E1117] px-4 py-3 rounded-xl border border-white/10 flex items-center gap-4 min-w-[200px]">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Roadmap Progress
                </span>
                <span className="text-base font-black text-white">
                  {completedCount} of {totalMilestones} Completed
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-xs">
                {progressPercent}%
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-gradient rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Milestones Cards Progression */}
      {roadmap?.milestones && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-400" />
            <span>Phased Learning Sprints</span>
          </h2>

          <div className="space-y-4">
            {roadmap.milestones.map((m, idx) => {
              const isDone = Boolean(completedMilestones[idx]);
              return (
                <div
                  key={`${m.week_or_month}-${idx}`}
                  className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 border ${
                    isDone
                      ? "bg-emerald-950/20 border-emerald-500/30"
                      : "glass-panel hover:border-gold-500/30"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-white/[0.06]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-500/15 text-gold-300 border border-gold-500/30">
                          {m.week_or_month}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white">{m.title}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 pt-1 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    {/* Interactive Mark Complete Button */}
                    <button
                      onClick={() => toggleMilestoneComplete(idx)}
                      className={`self-start lg:self-center px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isDone
                          ? "bg-emerald-500 text-black font-bold"
                          : "bg-white/[0.04] text-zinc-300 hover:text-white border border-white/10"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isDone ? "Completed" : "Mark as Done"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
                    {/* Focus Skills */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                        Focus Skills to Learn
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.skills_to_learn.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-md text-xs font-medium bg-gold-500/10 text-gold-300 border border-gold-500/20"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Resources */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                        Authoritative Resources
                      </span>
                      <div className="space-y-1.5">
                        {m.recommended_resources.map((res, rIdx) => (
                          <a
                            key={rIdx}
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2 rounded-lg bg-[#0E1117] border border-white/5 hover:border-gold-500/30 text-xs text-zinc-300 hover:text-gold-300 transition-colors group"
                          >
                            <span className="truncate pr-2 font-medium">{res.title}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[10px] text-zinc-500 px-1 rounded bg-white/[0.04]">
                                {res.type}
                              </span>
                              <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-gold-400" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Capstone Practice Project */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-gold-400" />
                        Hands-on Capstone Project
                      </span>
                      <div className="p-3 rounded-lg bg-[#0E1117] border border-white/5 text-xs text-zinc-300 leading-relaxed">
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
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-400" />
              <span>Recommended Industry Certifications</span>
            </h3>
            <ul className="space-y-2 text-xs text-zinc-300">
              {roadmap.key_certifications.map((cert, cIdx) => (
                <li key={cIdx} className="flex items-start gap-2 bg-[#0E1117] p-2.5 rounded-lg border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interview Readiness Tips Card */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gold-400" />
              <span>Interview Readiness Checklist</span>
            </h3>
            <ul className="space-y-2 text-xs text-zinc-300">
              {roadmap.interview_readiness_tips.map((tip, tIdx) => (
                <li key={tIdx} className="flex items-start gap-2 bg-[#0E1117] p-2.5 rounded-lg border border-white/5">
                  <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
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

