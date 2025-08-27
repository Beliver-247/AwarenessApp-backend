export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants?: number;
  currentParticipants?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  points: number;
  deadline: string;
  participants?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VolunteerOpportunity {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  duration: string;
  requiredSkills?: string[];
  volunteers?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Achievement {
  _id: string;
  title: string;
  description: string;
  points: number;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

