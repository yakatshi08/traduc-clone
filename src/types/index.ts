export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  language: 'fr' | 'en' | 'it' | 'es' | 'de';
}

export interface Project {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'document';
  status: 'processing' | 'completed' | 'error' | 'ready';
  language: string;
  targetLanguages: string[];
  createdAt: Date;
  updatedAt: Date;
  duration?: number;
  fileSize: number;
  accuracy?: number;
  sector: 'medical' | 'legal' | 'business' | 'education' | 'general';
}

export interface TranscriptionResult {
  id: string;
  projectId: string;
  text: string;
  confidence: number;
  speakers: Speaker[];
  timestamps: Timestamp[];
  translations: Record<string, string>;
}

export interface Speaker {
  id: string;
  name: string;
  confidence: number;
  segments: number[];
}

export interface Timestamp {
  start: number;
  end: number;
  text: string;
  speakerId: string;
  confidence: number;
}

export interface Analytics {
  totalProjects: number;
  completedProjects: number;
  totalDuration: number;
  averageAccuracy: number;
  monthlyUsage: number;
  storageUsed: number;
}