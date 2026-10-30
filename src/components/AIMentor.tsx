"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  Lightbulb,
} from "lucide-react";
import { ChatMessage, ResumeAnalysisResponse } from "@/types";
import { api } from "@/services/api";

interface AIMentorProps {
  analysis: ResumeAnalysisResponse | null;
}

export const AIMentor: React.FC<AIMentorProps> = ({ analysis }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Welcome to the **AI Career Mentor**! I am calibrated with your profile${
        analysis?.top_predicted_role
          ? ` as an aspiring **${analysis.top_predicted_role}**`
          : ""
      }. Ask me anything about resume phrasing, interview strategy, technical roadblocks, or compensation negotiation.`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickPrompts = [
    "How can I optimize my resume bullet points for ATS?",
    `What 3 capstone projects will prove my ${analysis?.top_predicted_role || "engineering"} depth?`,
    "Explain the STAR technique with a concrete example.",
    "How do I negotiate a higher tech salary offer effectively?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInputMessage("");
    setLoading(true);
    setError(null);

    try {
      const response = await api.sendChatMessage({
        message: text,
        context: analysis
          ? {
              top_predicted_role: analysis.top_predicted_role,
              extracted_skills: analysis.extracted_skills,
              missing_skills: analysis.missing_skills,
            }
          : undefined,
        chat_history: newMessages.slice(-6),
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply },
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to reach AI Career Mentor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Mentor Header */}
      <div className="glass-panel-brand rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-LLM Contextual Career Advisor (Gemini & OpenAI)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Career <span className="brand-text-gradient">Mentor & Coach</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Ask targeted questions regarding career trajectories, technical roadblocks, and hiring dynamics.
          </p>
        </div>

        {/* Profile Context Active Tag */}
        {analysis && (
          <div className="bg-[#090D16] px-5 py-3 rounded-2xl border border-indigo-500/30 text-xs shadow-md">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Active Candidate Context
            </span>
            <span className="font-bold text-cyan-300 text-sm">{analysis.top_predicted_role}</span>
            <span className="text-slate-400 block text-[11px] font-mono">
              {analysis.total_skills_found} verified skills loaded
            </span>
          </div>
        )}
      </div>

      {/* Chat Thread Container */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col h-[580px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-cyan-300 shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl max-w-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-tr-none shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                      : "bg-[#090D16] text-slate-200 border border-white/10 rounded-tl-none space-y-2"
                  }`}
                >
                  <div
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/### (.*?)\n/g, '<h4 class="text-cyan-300 font-bold text-sm my-1.5">$1</h4>')
                        .replace(/- (.*?)\n/g, '<li class="ml-4 list-disc text-slate-300">$1</li>'),
                    }}
                  />
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-200 shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3.5 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/10 text-xs text-slate-400 flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Mentor is synthesizing personalized career guidance...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        <div className="pt-3 pb-2 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-white/[0.06]">
          <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
            Quick Prompts:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={loading}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-[#090D16] hover:bg-indigo-500/15 text-slate-300 hover:text-cyan-200 border border-white/5 hover:border-indigo-500/30 whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-2 flex items-center gap-2.5">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask your Career Mentor (e.g. 'How to structure system design questions?')..."
            className="flex-1 bg-[#090D16] border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || loading}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:opacity-95 disabled:opacity-40 transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
