"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Calendar,
  Trash2,
  Sparkles,
  Database,
  Briefcase,
  Layers,
  Award,
  FolderOpen,
} from "lucide-react";
import { ResumeAnalysisResponse } from "@/types";
import { api } from "@/services/api";

interface AnalyticsDashboardProps {
  currentAnalysis: ResumeAnalysisResponse | null;
  onSelectAnalysis: (data: ResumeAnalysisResponse) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  currentAnalysis,
  onSelectAnalysis,
}) => {
  const [history, setHistory] = useState<ResumeAnalysisResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const records = await api.getHistory();
      setHistory(records);
      const status = await api.checkHealth();
      setDbStatus(status.database);
    } catch (e) {
      console.log("Analytics data load note:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentAnalysis]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this resume analysis record?")) return;
    try {
      await api.deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  const totalAnalyzed = history.length || (currentAnalysis ? 1 : 0);
  const topRoleFrequency: Record<string, number> = {};
  history.forEach((h) => {
    topRoleFrequency[h.top_predicted_role] = (topRoleFrequency[h.top_predicted_role] || 0) + 1;
  });
  if (currentAnalysis && history.length === 0) {
    topRoleFrequency[currentAnalysis.top_predicted_role] = 1;
  }

  const mostFrequentRole =
    Object.entries(topRoleFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    currentAnalysis?.top_predicted_role ||
    "Full Stack Developer";

  const avgReadiness = history.length
    ? Math.round(history.reduce((acc, h) => acc + h.readiness_score, 0) / history.length)
    : currentAnalysis?.readiness_score || 85;

  const totalSkillsAcross = history.reduce((acc, h) => acc + (h.total_skills_found || 0), 0) ||
    currentAnalysis?.total_skills_found ||
    20;

  const activeRecord = currentAnalysis || history[0];
  const chartPredictions = activeRecord?.predictions?.slice(0, 6) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel-brand rounded-3xl p-6 sm:p-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>MongoDB & Persistent Analytics Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Career Intelligence <span className="brand-text-gradient">Analytics & History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track historical resume analyses, predict career trends, and benchmark candidate readiness.
          </p>
        </div>

        {/* Database status badge */}
        <div className="bg-[#090D16] p-3.5 rounded-2xl border border-white/10 flex items-center gap-2.5 self-start sm:self-auto text-xs shadow-md">
          <Database className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold font-mono">Storage Engine</span>
            <span className="text-slate-200 font-semibold font-mono">
              {dbStatus?.active_storage === "MongoDB" ? "MongoDB Atlas" : "Persistent Local JSON"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="glass-panel p-6 rounded-2xl space-y-2 border hover:border-indigo-500/40 transition-all shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            Resumes Analyzed
          </span>
          <div className="text-3xl font-black text-white font-mono">{totalAnalyzed}</div>
          <p className="text-[11px] text-slate-500 font-medium">Persisted in database history</p>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel p-6 rounded-2xl space-y-2 border hover:border-indigo-500/40 transition-all shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
            <Award className="w-4 h-4 text-indigo-400" />
            Top Career Trajectory
          </span>
          <div className="text-xl font-extrabold text-white truncate">{mostFrequentRole}</div>
          <p className="text-[11px] text-cyan-400 font-medium">Primary recommended role</p>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel p-6 rounded-2xl space-y-2 border hover:border-indigo-500/40 transition-all shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Avg Readiness Score
          </span>
          <div className="text-3xl font-black text-white font-mono">{avgReadiness} / 100</div>
          <p className="text-[11px] text-emerald-400 font-medium">Competitive interview standing</p>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel p-6 rounded-2xl space-y-2 border hover:border-indigo-500/40 transition-all shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
            <Layers className="w-4 h-4 text-violet-400" />
            Total Skills Verified
          </span>
          <div className="text-3xl font-black text-white font-mono">{totalSkillsAcross}</div>
          <p className="text-[11px] text-slate-500 font-medium">Extracted across sessions</p>
        </div>
      </div>

      {/* Visual SVG Chart: Top Predicted Roles Breakdown */}
      {chartPredictions.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>Role Match Distribution Benchmark</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Top predicted technology roles benchmarked against your skill portfolio.
              </p>
            </div>
            <span className="text-xs text-cyan-300 font-semibold font-mono hidden sm:inline">
              Profile: {activeRecord?.candidate?.name || "Active Candidate"}
            </span>
          </div>

          {/* Custom SVG Bar Chart */}
          <div className="space-y-3.5 pt-2">
            {chartPredictions.map((pred) => (
              <div key={pred.role} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">{pred.role}</span>
                  <span className="text-cyan-300 font-bold font-mono">{pred.match_percentage}%</span>
                </div>
                <div className="w-full h-3 bg-[#090D16] rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${pred.match_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Records Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>Persisted Resume Analyses History</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">{history.length} records in storage</span>
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#090D16] text-[10px] uppercase tracking-wider text-slate-400 border-b border-white/[0.08] font-mono">
                <tr>
                  <th className="py-3.5 px-4">Date / Time</th>
                  <th className="py-3.5 px-4">Candidate / Document</th>
                  <th className="py-3.5 px-4">Top Predicted Role</th>
                  <th className="py-3.5 px-4">Match %</th>
                  <th className="py-3.5 px-4">Skills Found</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {history.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectAnalysis(item)}
                    className="hover:bg-white/[0.03] cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono">
                      {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {item.candidate?.name || item.filename || "Resume"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-500/15 text-cyan-200 border border-indigo-500/30">
                        {item.top_predicted_role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-400 font-mono">
                      {item.match_percentage}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {item.total_skills_found} skills
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAnalysis(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#090D16] hover:bg-indigo-500/20 text-slate-300 hover:text-cyan-200 transition-colors font-medium"
                        title="Load Analysis"
                      >
                        <FolderOpen className="w-3.5 h-3.5 inline mr-1" />
                        Load
                      </button>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">
            No history records found. Upload or paste a resume to generate your first analysis record.
          </div>
        )}
      </div>
    </div>
  );
};
