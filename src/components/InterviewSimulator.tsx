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

  // Candidate practice answer state
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 glass-panel-gold rounded-2xl p-6 sm:p-8">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-300 border border-gold-500/30">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Interactive Multi-Round Technical & STAR Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Interview Simulator & <span className="gold-text-gradient">Rubric Evaluator</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Practice realistic Technical, System Design, Coding, and STAR-based behavioral interview questions
            with real-time AI scoring and improvement tips.
          </p>
        </div>

        {/* Role Selector */}
        <div className="bg-[#0E1117] p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block mb-1">
              Interview Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-[#141822] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-gold-500/50"
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
            className="self-end sm:self-auto mt-auto px-4 py-2 rounded-lg text-xs font-bold bg-gold-gradient text-black hover:opacity-95 transition-all shadow-[0_0_12px_rgba(212,175,55,0.2)] flex items-center justify-center gap-1.5"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-black" />}
            <span>Refresh Questions</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Questions List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Question Bank
              </span>
              <span className="text-xs text-gold-400 font-bold">
                {questions.length} Generated
              </span>
            </div>

            {/* Type filters */}
            <div className="flex items-center gap-1 flex-wrap">
              {["All", "Technical", "Behavioral", "System"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTypeFilter(t)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                    selectedTypeFilter === t
                      ? "bg-gold-500 text-black font-bold"
                      : "bg-white/[0.03] text-zinc-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Questions mini cards */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
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
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-gold-500/15 border-gold-500/50 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                        : "bg-[#0E1117] border-white/5 hover:border-gold-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-zinc-500">Q{idx + 1}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-gold-300 font-medium">
                        {q.type.split("(")[0].trim()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-200 line-clamp-2 font-medium">
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
            <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
              {/* Question Header */}
              <div className="space-y-3 pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-500/15 text-gold-300 border border-gold-500/30">
                    {currentQuestion.type}
                  </span>
                  <span className="text-xs text-zinc-400">
                    Question #{selectedQuestionIndex + 1} of {questions.length}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  {currentQuestion.question}
                </h2>

                {/* Why interviewers ask this */}
                <div className="p-3 rounded-xl bg-[#0E1117] border border-white/5 text-xs text-zinc-400 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-300">Interviewer Intent: </span>
                    {currentQuestion.why_asked}
                  </div>
                </div>

                {/* Key Points / Answer Outline Toggle */}
                <div>
                  <button
                    onClick={() => setShowAnswerOutline(!showAnswerOutline)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showAnswerOutline ? "Hide Sample Rubric Outline" : "View Sample Rubric Outline"}</span>
                    {showAnswerOutline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showAnswerOutline && (
                    <div className="mt-3 p-4 rounded-xl bg-[#141822] border border-gold-500/20 text-xs text-zinc-300 space-y-3 animate-in fade-in duration-200">
                      <div>
                        <span className="font-bold text-gold-300 block mb-1">Key Points to Hit:</span>
                        <ul className="list-disc list-inside space-y-1 text-zinc-300">
                          {currentQuestion.key_points_to_cover.map((point, pIdx) => (
                            <li key={pIdx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-t border-white/5 pt-2">
                        <span className="font-bold text-gold-300 block mb-1">Sample Answer Outline:</span>
                        <p className="text-zinc-400 italic leading-relaxed">
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
                    <Mic className="w-4 h-4 text-gold-400" />
                    Your Answer (Simulate Mock Response)
                  </span>
                  <span className="text-xs text-zinc-500">
                    {candidateAnswer.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Type your interview response here. Mention specific metrics, STAR situation/task/actions, and architectural reasoning to achieve a 9+ score..."
                  className="w-full rounded-xl bg-[#0E1117] border border-white/10 p-4 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-gold-500/50 resize-y"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={!candidateAnswer.trim() || evaluating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gold-gradient text-black hover:opacity-95 disabled:opacity-40 transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                  >
                    {evaluating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating Response...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 fill-black" />
                        <span>Submit for AI Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time AI Evaluation Output */}
              {evaluation && (
                <div className="p-6 rounded-2xl glass-panel-gold space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gold-400" />
                      <h3 className="text-base font-bold text-white">AI Evaluation Report</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Score:</span>
                      <span className="text-xl font-black text-white px-3 py-0.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300">
                        {evaluation.score} / 10
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="bg-[#0E1117] p-4 rounded-xl border border-emerald-500/20 space-y-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Identified Strengths
                      </span>
                      <ul className="text-xs text-zinc-300 space-y-1">
                        {evaluation.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="bg-[#0E1117] p-4 rounded-xl border border-amber-500/20 space-y-2">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Areas for Optimization
                      </span>
                      <ul className="text-xs text-zinc-300 space-y-1">
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
                  <div className="p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-xs text-zinc-300">
                    <span className="font-bold text-gold-300">Expert Interviewer Tip: </span>
                    {evaluation.model_answer_tip}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center text-xs text-zinc-400">
              No questions found. Click &ldquo;Refresh Questions&rdquo; to generate interview items.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

