
export enum ProtocolType {
  H12 = '12h',
  H14 = '14h',
  H16 = '16h',
  H18 = '18h',
  H20 = '20h',
  H24 = '24h'
}

export interface UserProgress {
  id: string;
  date: string;
  weight: number;
  waist: number;
  hips: number;
  abdomen: number;
  thigh: number;
  arm: number;
  photoUrl?: string;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface Live {
  id: string;
  title: string;
  date: string;
  time: string;
  url: string;
}

export interface ProtocolDetail {
  id: ProtocolType;
  title: string;
  description: string;
  benefits: string[];
  indicatedFor: string;
  howToStart: string;
  allowedDuring: string[];
  commonMistakes: string[];
  menus: {
    basic: string[];
    intermediate: string[];
    advanced: string[];
  };
  pdfUrl?: string;
}

export interface AppUser {
  id: string;
  name: string;
  protocol: string;
  photoURL?: string;
  memberSince?: string;
  category?: 'Criatura Test-Drive' | 'Criatura Agora-Vai' | 'Criatura Gata-Sarada' | 'Criatura Musa-Fitness';
  totalPoints?: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  goal: string;
  duration_days: number;
  is_active: boolean;
  created_at: string;
}

export interface ChallengeLog {
  id: string;
  challenge_id: string;
  user_id: string;
  log_date: string;
  score: number; // 0 to 10
}

export interface RankingEntry {
  user_id: string;
  name: string;
  photo_url?: string;
  category: string;
  total_score: number;
  position?: number;
}
