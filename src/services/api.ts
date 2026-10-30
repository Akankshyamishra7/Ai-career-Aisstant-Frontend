import {
  ResumeAnalysisResponse,
  CareerRoadmapResponse,
  InterviewQuestionsResponse,
  AnswerEvaluationResponse,
  ChatResponse,
  ChatMessage,
  SampleResume,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = {
  async checkHealth(): Promise<{ status: string; database?: any }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      if (!res.ok) throw new Error("Backend unavailable");
      return await res.json();
    } catch (e) {
      return { status: "disconnected", database: "offline" };
    }
  },

  async getSampleResumes(): Promise<Record<string, SampleResume>> {
    const res = await fetch(`${API_BASE_URL}/api/sample-resumes`);
    if (!res.ok) throw new Error("Failed to load sample resumes");
    return await res.json();
  },

  async analyzeResumePdf(file: File): Promise<ResumeAnalysisResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to analyze resume file");
    }

    return await res.json();
  },

  async analyzeResumeText(text: string): Promise<ResumeAnalysisResponse> {
    const res = await fetch(`${API_BASE_URL}/api/analyze-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to analyze resume text");
    }

    return await res.json();
  },

  async generateRoadmap(payload: {
    target_role: string;
    current_skills: string[];
    missing_skills: string[];
    experience_level?: string;
    timeline_weeks?: number;
  }): Promise<CareerRoadmapResponse> {
    const res = await fetch(`${API_BASE_URL}/api/roadmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to generate career roadmap");
    }

    return await res.json();
  },

  async generateInterviewQuestions(payload: {
    job_role: string;
    skills: string[];
    count?: number;
  }): Promise<InterviewQuestionsResponse> {
    const res = await fetch(`${API_BASE_URL}/api/interview-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to generate interview questions");
    }

    return await res.json();
  },

  async evaluateInterviewAnswer(payload: {
    question: string;
    answer: string;
    job_role: string;
    question_type?: string;
  }): Promise<AnswerEvaluationResponse> {
    const res = await fetch(`${API_BASE_URL}/api/interview/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to evaluate interview answer");
    }

    return await res.json();
  },

  async sendChatMessage(payload: {
    message: string;
    context?: any;
    chat_history?: ChatMessage[];
  }): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to send chat message");
    }

    return await res.json();
  },

  async getHistory(): Promise<ResumeAnalysisResponse[]> {
    const res = await fetch(`${API_BASE_URL}/api/history`);
    if (!res.ok) return [];
    return await res.json();
  },

  async getHistoryItem(id: string): Promise<ResumeAnalysisResponse> {
    const res = await fetch(`${API_BASE_URL}/api/history/${id}`);
    if (!res.ok) throw new Error("History record not found");
    return await res.json();
  },

  async deleteHistoryItem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/history/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete record");
  },
};

