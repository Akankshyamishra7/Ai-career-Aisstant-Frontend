export interface SkillItem {
  name: string;
  category: string;
}

export interface CandidateDetails {
  name: string;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  github?: string | null;
  word_count: number;
}

export interface RolePrediction {
  role: string;
  confidence: number;
  match_percentage: number;
  description: string;
  missing_skills: string[];
  matched_skills: string[];
  market_demand: string;
  avg_salary_range: string;
}

export interface ResumeAnalysisResponse {
  id: string;
  filename?: string;
  candidate?: CandidateDetails;
  extracted_text_preview: string;
  total_skills_found: number;
  extracted_skills: SkillItem[];
  top_predicted_role: string;
  match_percentage: number;
  readiness_score: number;
  predictions: RolePrediction[];
  missing_skills: string[];
  recommended_skills: string[];
  career_summary: string;
  created_at: string;
}

export interface RoadmapMilestone {
  week_or_month: string;
  title: string;
  description: string;
  skills_to_learn: string[];
  recommended_resources: {
    title: string;
    url: string;
    type: string;
  }[];
  practice_project: string;
}

export interface CareerRoadmapResponse {
  target_role: string;
  estimated_timeline: string;
  overview: string;
  milestones: RoadmapMilestone[];
  key_certifications: string[];
  interview_readiness_tips: string[];
}

export interface InterviewQuestion {
  id: number;
  type: string;
  question: string;
  why_asked: string;
  key_points_to_cover: string[];
  sample_answer_outline: string;
}

export interface InterviewQuestionsResponse {
  job_role: string;
  difficulty: string;
  questions: InterviewQuestion[];
}

export interface AnswerEvaluationResponse {
  score: number;
  strengths: string[];
  improvements: string[];
  model_answer_tip: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
  suggestions: string[];
}

export interface SampleResume {
  title: string;
  description: string;
  text: string;
}

