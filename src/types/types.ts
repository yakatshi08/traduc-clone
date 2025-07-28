export interface Project {
  id: string;
  name: string;
  type: 'document' | 'video' | 'audio';
  status: 'completed' | 'processing' | 'ready' | 'error';
  language: string;
  targetLanguages?: string[];
  createdAt: Date;
  updatedAt: Date;
  fileSize: number;
  duration?: number; // en secondes pour audio/video
  accuracy?: number;
  progress?: number; // pourcentage de progression
  sector?: 'business' | 'medical' | 'legal' | 'education' | 'technical';
  owner?: string;
  tags?: string[];
  errorMessage?: string;
}