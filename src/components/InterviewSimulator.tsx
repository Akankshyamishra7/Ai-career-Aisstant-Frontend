"use client";

import React, { useState, useEffect } from "react";
import {
  Mic,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  Zap,
} from "lucide-react";
import { InterviewQuestion, AnswerEvaluationResponse } from "@/types";
import { api } from "@/services/api";

interface InterviewSimulatorProps {
  initialRole?: string;
  skills?: string[];
}

export const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({
  initialRole = "Full Stack Developer",
  skills = ["React", "Node.js", "Python", "SQL"],
}) => {
  const [role, setRole] = useState(initialRole);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");
  const [showAnswerOutline, setShowAnswerOutline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluationResponse | null>(null);

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

  const fetchQuestions = async (targetRole: string) => {
    setLoading(true);
    setError(null);
    setEvaluation(null);
    setCandidateAnswer("");
    try {
      const data = await api.generateInterviewQuestions({
        job_role: targetRole,
        skills: skills.length > 0 ? skills : ["System Architecture", "Performance"],
        count: 6,
      });
      setQuestions(data.questions || []);
      setSelectedQuestionIndex(0);
    } catch (err: any) {
      setError(err.message || "Failed to load interview questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(role);
  }, [role]);

  const handleEvaluateAnswer = async () => {
    const currentQ = questions[selectedQuestionIndex];
    if (!currentQ || !candidateAnswer.trim()) return;

    setEvaluating(true);
    try {
      const result = await api.evaluateInterviewAnswer({
        question: currentQ.question,
        answer: candidateAnswer,
        job_role: role,
        question_type: currentQ.type,
      });
      setEvaluation(result);
    } catch (err: any) {
      setError(err.message || "Failed to evaluate answer.");
    } finally {
      setEvaluating(false);
    }
  };

  const currentQuestion = questions[selectedQuestionIndex];

  const filteredQuestions = React.useMemo(() => {
    if (selectedTypeFilter === "All") return questions;
    return questions.filter((q) =>
      q.type.toLowerCase().includes(selectedTypeFilter.toLowerCase())
    );
  }, [questions, selectedTypeFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 glass-panel-brand rounded-3xl p-6 sm:p-10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Multi-Round Technical & STAR Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Interview Simulator & <span className="brand-text-gradient">Rubric Evaluator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Practice realistic Technical, System Design, Coding, and STAR-based behavioral interview questions
            with real-time AI scoring, identified strengths, and targeted improvement feedback.
          </p>
        </div>

        {/* Role Selector */}
        <div className="bg-[#090D16] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1 font-mono">
              Interview Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
            onClick={() => fetchQuestions(role)}
            disabled={loading}
            className="self-end sm:self-auto mt-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:opacity-95 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            <span>Refresh Bank</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Questions List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Question Bank
              </span>
              <span className="text-xs text-cyan-300 font-bold font-mono">
                {questions.length} Items
              </span>
            </div>

            {/* Type filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["All", "Technical", "Behavioral", "System"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedTypeFilter === t
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-[#090D16] text-slate-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Questions mini cards */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredQuestions.map((q, idx) => {
                const isSelected = questions[selectedQuestionIndex]?.id === q.id;
                return (
                  <div
                    key={q.id || idx}
                    onClick={() => {
                      const foundIdx = questions.findIndex((item) => item.id === q.id);
                      if (foundIdx !== -1) {
                        setSelectedQuestionIndex(foundIdx);
                        setEvaluation(null);
                        setCandidateAnswer("");
                      }
                    }}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-indigo-500/15 border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                        : "bg-[#090D16] border-white/5 hover:border-indigo-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">Q{idx + 1}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-cyan-200 font-semibold font-mono">
                        {q.type.split("(")[0].trim()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2 font-medium">
                      {q.question}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Question + Answer Area + AI Feedback (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {currentQuestion ? (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
              {/* Question Header */}
              <div className="space-y-3 pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-cyan-300 border border-indigo-500/30 font-mono">
                    {currentQuestion.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Question #{selectedQuestionIndex + 1} of {questions.length}
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
                  {currentQuestion.question}
                </h2>

                {/* Intent */}
                <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/5 text-xs text-slate-300 flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Interviewer Intent: </span>
                    {currentQuestion.why_asked}
                  </div>
                </div>

                {/* Outline Toggle */}
                <div>
                  <button
                    onClick={() => setShowAnswerOutline(!showAnswerOutline)}
                    className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showAnswerOutline ? "Hide Sample Rubric Outline" : "View Sample Rubric Outline"}</span>
                    {showAnswerOutline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showAnswerOutline && (
                    <div className="mt-3 p-4 rounded-2xl bg-[#090D16] border border-indigo-500/20 text-xs text-slate-300 space-y-3 animate-in fade-in duration-200">
                      <div>
                        <span className="font-bold text-cyan-200 block mb-1">Key Points to Cover:</span>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                          {currentQuestion.key_points_to_cover.map((point, pIdx) => (
                            <li key={pIdx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-t border-white/5 pt-2">
                        <span className="font-bold text-cyan-200 block mb-1">Sample Answer Outline:</span>
                        <p className="text-slate-400 italic leading-relaxed">
                          &ldquo;{currentQuestion.sample_answer_outline}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Answer Input Simulator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-cyan-400" />
                    Your Answer (Simulate Mock Response)
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {candidateAnswer.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Type your response here. Include specific metrics, architectural choices, and the STAR methodology to score 9+..."
                  className="w-full rounded-2xl bg-[#090D16] border border-white/10 p-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 resize-y"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={!candidateAnswer.trim() || evaluating}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:opacity-95 disabled:opacity-40 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                  >
                    {evaluating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating Response...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit for AI Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time AI Evaluation Output */}
              {evaluation && (
                <div className="p-6 rounded-2xl glass-panel-brand space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-base font-bold text-white">AI Evaluation Report</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">Score:</span>
                      <span className="text-xl font-black text-white px-3.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-cyan-300 font-mono">
                        {evaluation.score} / 10
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="bg-[#090D16] p-4 rounded-xl border border-emerald-500/20 space-y-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Identified Strengths
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1">
                        {evaluation.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="bg-[#090D16] p-4 rounded-xl border border-amber-500/20 space-y-2">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Areas for Improvement
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1">
                        {evaluation.improvements.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-400 mt-0.5">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Model Answer Tip */}
                  <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300">
                    <span className="font-bold text-cyan-300">Expert Interviewer Tip: </span>
                    {evaluation.model_answer_tip}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center text-xs text-slate-400">
              No questions found. Click &ldquo;Refresh Bank&rdquo; to generate interview items.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
