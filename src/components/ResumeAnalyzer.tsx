"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  Sparkles,
  Search,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  Link as LinkIcon,
  ArrowRight,
  Loader2,
  Check,
  Terminal,
  Cpu,
  Layers,
  Zap,
} from "lucide-react";
import { ResumeAnalysisResponse, SampleResume } from "@/types";
import { api } from "@/services/api";

interface ResumeAnalyzerProps {
  analysis: ResumeAnalysisResponse | null;
  setAnalysis: (data: ResumeAnalysisResponse) => void;
  onNavigateToPrediction: () => void;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  analysis,
  setAnalysis,
  onNavigateToPrediction,
}) => {
  const [activeInputTab, setActiveInputTab] = useState<"upload" | "paste">("upload");
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sampleResumes, setSampleResumes] = useState<Record<string, SampleResume> | null>(null);
  const [selectedSampleKey, setSelectedSampleKey] = useState<string | null>(null);

  // Skill search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  React.useEffect(() => {
    api.getSampleResumes()
      .then((data) => setSampleResumes(data))
      .catch((err) => console.log("Sample resumes note:", err));
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    const ext = selectedFile.name.toLowerCase();
    if (!ext.endsWith(".pdf") && !ext.endsWith(".txt")) {
      setError("Please select a valid PDF (.pdf) or Text (.txt) file.");
      return;
    }
    setError(null);
    setFile(selectedFile);
  };

  const handleAnalyzeFile = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.analyzeResumePdf(file);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze resume file. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeText = async () => {
    if (!pastedText.trim() || pastedText.trim().length < 15) {
      setError("Please paste or write at least 15 characters of resume content.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await api.analyzeResumeText(pastedText);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze text. Please verify backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (key: string, sample: SampleResume) => {
    setSelectedSampleKey(key);
    setPastedText(sample.text);
    setActiveInputTab("paste");
    setError(null);
  };

  const categories = React.useMemo(() => {
    if (!analysis?.extracted_skills) return [];
    const set = new Set<string>();
    analysis.extracted_skills.forEach((s) => set.add(s.category));
    return ["All", ...Array.from(set).sort()];
  }, [analysis]);

  const filteredSkills = React.useMemo(() => {
    if (!analysis?.extracted_skills) return [];
    return analysis.extracted_skills.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [analysis, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Showcase */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-brand p-8 sm:p-12">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/20 via-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Resume Intelligence & 180+ Technical Skills Extractor</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Accelerate Your Tech Career With{" "}
            <span className="brand-text-gradient">Predictive Intelligence</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Upload your resume or paste content to instantly benchmark against 12 authoritative technology roles,
            pinpoint high-impact missing skills, and build your personalized 12-week interview trajectory.
          </p>

          {/* Quick stats strip */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <span>12 Technology Roles</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
              <span>180+ Canonical Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span>99.15% Model Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Options Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#090D16] rounded-xl border border-white/5">
            <button
              onClick={() => setActiveInputTab("upload")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeInputTab === "upload"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_16px_rgba(99,102,241,0.35)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document (PDF / TXT)</span>
            </button>
            <button
              onClick={() => setActiveInputTab("paste")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeInputTab === "paste"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_16px_rgba(99,102,241,0.35)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Resume Text</span>
            </button>
          </div>

          {/* Quick Preloaded Profiles */}
          {sampleResumes && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Quick Test Profiles:
              </span>
              {Object.entries(sampleResumes).map(([key, sample]) => (
                <button
                  key={key}
                  onClick={() => handleSelectSample(key, sample)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    selectedSampleKey === key
                      ? "bg-indigo-500/20 text-cyan-200 border-indigo-400/50 shadow-[0_0_10px_rgba(99,102,241,0.25)]"
                      : "bg-[#090D16] text-slate-300 border-white/10 hover:border-indigo-500/30 hover:text-white"
                  }`}
                >
                  {key === "data_analyst"
                    ? "Data Analyst"
                    : key === "frontend_developer"
                    ? "Frontend Dev"
                    : key === "ml_engineer"
                    ? "ML Engineer"
                    : "Cloud DevOps"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab 1: Upload Dropzone */}
        {activeInputTab === "upload" && (
          <div className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center p-10 sm:p-14 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                dragActive
                  ? "border-cyan-400 bg-indigo-500/10 scale-[1.01]"
                  : "border-white/10 hover:border-indigo-500/40 bg-[#090D16]/60"
              }`}
            >
              <input
                type="file"
                id="resume-file-input"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-300 mb-4 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">
                {file ? file.name : "Drag and drop your PDF or TXT resume here"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB selected • Click below to analyze`
                  : "Supports PDF & TXT documents up to 10MB"}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAnalyzeFile}
                disabled={!file || loading}
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-500 via-violet-600 to-cyan-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Skills & Predicting Roles...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Document Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Paste Content */}
        {activeInputTab === "paste" && (
          <div className="space-y-4">
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste raw resume text, summary, work history, and technical competencies..."
              className="w-full rounded-2xl bg-[#090D16] border border-white/10 p-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 font-mono resize-y"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {pastedText.length} characters | ~{pastedText.split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                onClick={handleAnalyzeText}
                disabled={!pastedText.trim() || loading}
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-500 via-violet-600 to-cyan-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running TF-IDF + Logistic Classifier...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Pasted Content</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results View */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Candidate Overview Card */}
          <div className="glass-panel-brand rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {analysis.candidate?.name || "Candidate Profile"}
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    Verified Analysis
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Document: {analysis.filename || "Resume"} • Analyzed at{" "}
                  {new Date(analysis.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>

                {/* Contact info badges */}
                <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-300">
                  {analysis.candidate?.email && (
                    <span className="flex items-center gap-1.5 bg-[#090D16] px-3 py-1 rounded-lg border border-white/5 font-mono">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      {analysis.candidate.email}
                    </span>
                  )}
                  {analysis.candidate?.phone && (
                    <span className="flex items-center gap-1.5 bg-[#090D16] px-3 py-1 rounded-lg border border-white/5 font-mono">
                      <Phone className="w-3.5 h-3.5 text-indigo-400" />
                      {analysis.candidate.phone}
                    </span>
                  )}
                  {analysis.candidate?.linkedin && (
                    <a
                      href={`https://${analysis.candidate.linkedin.replace(/^https?:\/\//, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 bg-[#090D16] px-3 py-1 rounded-lg border border-white/5 hover:text-cyan-300 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      LinkedIn Profile
                    </a>
                  )}
                  {analysis.candidate?.github && (
                    <a
                      href={`https://${analysis.candidate.github.replace(/^https?:\/\//, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 bg-[#090D16] px-3 py-1 rounded-lg border border-white/5 hover:text-cyan-300 transition-colors"
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-slate-200" />
                      GitHub Profile
                    </a>
                  )}
                </div>
              </div>

              {/* Quick top role teaser card */}
              <div className="bg-[#090D16] p-5 rounded-2xl border border-indigo-500/30 flex items-center gap-5 shadow-lg">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Top Career Match
                  </span>
                  <span className="text-xl font-extrabold text-white block">
                    {analysis.top_predicted_role}
                  </span>
                  <span className="text-xs text-cyan-400 font-bold font-mono">
                    {analysis.match_percentage}% Confidence Score
                  </span>
                </div>
                <button
                  onClick={onNavigateToPrediction}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-xs flex items-center gap-1.5 hover:opacity-95 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                >
                  <span>Explore Predictions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Career Summary snippet */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#090D16]/60 p-4 rounded-2xl border border-white/5">
              <span className="font-bold text-indigo-300">Executive Summary: </span>
              {analysis.career_summary}
            </div>
          </div>

          {/* 180+ Skills Extracted Wall */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>Verified Technical Competencies</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-cyan-300 border border-indigo-500/30 font-mono">
                    {analysis.total_skills_found} Detected
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracted from 180+ authoritative technology taxonomy skills and alias mappings.
                </p>
              </div>

              {/* Search bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter identified skills..."
                  className="w-full bg-[#090D16] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 flex-wrap overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                      : "bg-[#090D16] text-slate-400 hover:text-white border border-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skill tags container */}
            <div className="flex flex-wrap gap-2 pt-2">
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill, index) => (
                  <div
                    key={`${skill.name}-${index}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0D121F] border border-white/5 hover:border-indigo-500/40 hover:bg-[#121A2C] transition-all group shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="text-slate-200 group-hover:text-cyan-200 transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-white/[0.04] font-medium font-mono">
                      {skill.category}
                    </span>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-xs text-slate-500">
                  No skills matched &ldquo;{searchQuery}&rdquo; in category &ldquo;{selectedCategory}&rdquo;.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
