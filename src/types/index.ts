export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Session {
  _id: string;
  title: string;
  description?: string;
  tags: string[];
  jsonUrl?: string;
  content: any;
  author: {
    _id: string;
    username: string;
  };
  status: 'draft' | 'published';
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'yoga' | 'meditation' | 'breathing' | 'mindfulness' | 'other';
  lastSaved: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface SessionsResponse {
  sessions: Session[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface AutoSaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  error?: string;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
