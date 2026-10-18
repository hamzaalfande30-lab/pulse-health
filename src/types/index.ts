// ─── Core Domain Types ────────────────────────────────────────────────────────

export type Language = 'en' | 'ar';
export type ThemeName = 'midnight-lime' | 'deep-ocean' | 'violet-night';
export type WeightUnit = 'kg' | 'lbs';
export type DistanceUnit = 'km' | 'miles';

export interface UserProfile {
  displayName: string;
  age?: number;
  weight?: number;
  height?: number;
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  language: Language;
  theme: ThemeName;
  stepGoal: number;
  sleepGoal: number; // hours
  hydrationGoal: number; // ml
  notificationsEnabled: boolean;
  bedtimeReminder?: string; // HH:MM
}

export interface ActivityDay {
  date: string; // ISO date string YYYY-MM-DD
  steps: number;
  distanceKm: number;
  caloriesBurned: number;
  activeMinutes: number;
  isDemo: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string;
  activityType: string;
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned?: number;
  notes?: string;
}

export interface SleepLog {
  id: string;
  date: string; // date of sleep (night)
  bedtime: string; // HH:MM
  wakeTime: string; // HH:MM
  durationHours: number;
  quality?: 'poor' | 'fair' | 'good' | 'excellent';
  isDemo: boolean;
}

export interface HydrationLog {
  date: string; // YYYY-MM-DD
  entries: HydrationEntry[];
  totalMl: number;
}

export interface HydrationEntry {
  id: string;
  time: string; // HH:MM
  amountMl: number;
}

export interface CoachMessage {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: string;
}

export interface AppState {
  profile: UserProfile;
  activityDays: ActivityDay[];
  workouts: WorkoutLog[];
  sleepLogs: SleepLog[];
  hydrationLogs: HydrationLog[];
  coachHistory: CoachMessage[];
}
