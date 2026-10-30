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
  Link,
  ArrowRight,
  Loader2,
  Check,
  Terminal,
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

  // Fetch sample resumes on mount if not loaded
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

  // Categories extraction for skills filter
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
    <div className="space-y-8">
      {/* Hero Title Section */}
      <div className="relative overflow-hidden rounded-2xl glass-panel-gold p-8 sm:p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-300 border border-gold-500/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>AI-Driven Resume Intelligence & 150+ Technical Skills Detector</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Transform Your Resume Into a{" "}
            <span className="gold-text-gradient">Predictive Tech Career Roadmap</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
            Upload your PDF/TXT resume or paste content to instantly benchmark your skills against
            12 authoritative tech roles, pinpoint missing competencies, and generate customized
            interview prep.
          </p>
        </div>
      </div>

      {/* Input Options Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        {/* Tab switchers */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveInputTab("upload")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeInputTab === "upload"
                  ? "bg-gold-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  : "text-zinc-400 hover:text-white bg-white/[0.03]"
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document (PDF / TXT)</span>
            </button>
            <button
              onClick={() => setActiveInputTab("paste")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeInputTab === "paste"
                  ? "bg-gold-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  : "text-zinc-400 hover:text-white bg-white/[0.03]"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Resume Content</span>
            </button>
          </div>

          {/* Quick Preloaded Profiles */}
          {sampleResumes && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-400 flex items-center gap-1 font-medium">
                <Terminal className="w-3.5 h-3.5 text-gold-400" />
                Quick Test Samples:
              </span>
              {Object.entries(sampleResumes).map(([key, sample]) => (
                <button
                  key={key}
                  onClick={() => handleSelectSample(key, sample)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                    selectedSampleKey === key
                      ? "bg-gold-500/20 text-gold-300 border-gold-500/50"
                      : "bg-white/[0.02] text-zinc-300 border-white/10 hover:border-gold-500/30"
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
              className={`relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
                dragActive
                  ? "border-gold-400 bg-gold-500/10 scale-[1.01]"
                  : "border-white/10 hover:border-gold-500/30 bg-[#0E1117]"
              }`}
            >
              <input
                type="file"
                id="resume-file-input"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-4 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-white">
                {file ? file.name : "Drag & drop your resume PDF or TXT here"}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB selected - Click button below to analyze`
                  : "Supports PDF & TXT up to 10MB"}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAnalyzeFile}
                disabled={!file || loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gold-gradient text-black disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 shadow-[0_4px_20px_rgba(212,175,55,0.25)] transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Skills & Predicting Roles...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-black" />
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
              placeholder="Paste raw resume text, summary, work history, and technical skills list..."
              className="w-full rounded-xl bg-[#0E1117] border border-white/10 p-4 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-gold-500/50 font-mono resize-y"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                {pastedText.length} characters | ~{pastedText.split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                onClick={handleAnalyzeText}
                disabled={!pastedText.trim() || loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gold-gradient text-black disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 shadow-[0_4px_20px_rgba(212,175,55,0.25)] transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running TF-IDF + Logistic Classifier...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>Analyze Pasted Content</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results View */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Candidate Overview Card */}
          <div className="glass-panel-gold rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">
                    {analysis.candidate?.name || "Candidate Profile"}
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Verified Analysis
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Source: {analysis.filename || "Resume Content"} | Processed at{" "}
                  {new Date(analysis.created_at).toLocaleTimeString()}
                </p>

                {/* Contact info badges */}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-300">
                  {analysis.candidate?.email && (
                    <span className="flex items-center gap-1.5 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5">
                      <Mail className="w-3.5 h-3.5 text-gold-400" />
                      {analysis.candidate.email}
                    </span>
                  )}
                  {analysis.candidate?.phone && (
                    <span className="flex items-center gap-1.5 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5">
                      <Phone className="w-3.5 h-3.5 text-gold-400" />
                      {analysis.candidate.phone}
                    </span>
                  )}
                  {analysis.candidate?.linkedin && (
                    <a
                      href={`https://${analysis.candidate.linkedin.replace(/^https?:\/\//, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5 hover:text-gold-300 transition-colors"
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
                      className="flex items-center gap-1.5 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5 hover:text-gold-300 transition-colors"
                    >
                      <Link className="w-3.5 h-3.5 text-zinc-200" />
                      GitHub Profile
                    </a>
                  )}
                </div>
              </div>

              {/* Quick top role teaser button */}
              <div className="bg-[#0E1117] p-4 rounded-xl border border-gold-500/30 flex items-center gap-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                    Top Career Match
                  </span>
                  <span className="text-lg font-bold text-white block">
                    {analysis.top_predicted_role}
                  </span>
                  <span className="text-xs text-gold-400 font-semibold">
                    {analysis.match_percentage}% Confidence Score
                  </span>
                </div>
                <button
                  onClick={onNavigateToPrediction}
                  className="px-3.5 py-2 rounded-lg bg-gold-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-gold-400 transition-all shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                >
                  <span>Explore Predictions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Career Summary snippet */}
            <div className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
              <span className="font-semibold text-gold-300">Executive Summary: </span>
              {analysis.career_summary}
            </div>
          </div>

          {/* 150+ Skills Extracted Wall */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Verified Technical Competencies</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                    {analysis.total_skills_found} Detected
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Extracted from 180+ authoritative technology taxonomy skills and alias mappings.
                </p>
              </div>

              {/* Search bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter identified skills..."
                  className="w-full bg-[#0E1117] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-500/40"
                />
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-gold-500 text-black font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                      : "bg-white/[0.03] text-zinc-400 hover:text-white border border-white/5"
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#141822] border border-white/10 hover:border-gold-500/40 transition-colors group"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-zinc-200 group-hover:text-gold-200 transition-colors font-semibold">
                      {skill.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 px-1.5 py-0.5 rounded bg-white/[0.04]">
                      {skill.category}
                    </span>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-xs text-zinc-500">
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
