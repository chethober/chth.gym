// ============================================================================
// Types and Interfaces for جسم و اندیشه (Jesm O Andishe)
// ============================================================================

export interface Env {
  DB: D1Database;
  KV_SESSIONS: KVNamespace;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  REDIRECT_URI?: string;
  APP_NAME?: string;
  APP_ENV?: string;
  ASSETS?: Fetcher;
}

export interface User {
  id: string;
  google_id?: string | null;
  email: string;
  name: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  user_id: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  height_cm: number;
  current_weight_kg: number;
  target_weight_kg: number;
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  fitness_goal: 'hypertrophy' | 'fat_loss' | 'strength' | 'endurance' | 'general_health';
  target_weekly_workouts: number;
  daily_water_target_liters: number;
  daily_reminder_enabled: number; // 1 or 0
  daily_reminder_time: string;
  updated_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  log_date: string;
  weight_kg?: number | null;
  water_liters?: number | null;
  notes?: string | null;
  created_at: string;
}

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  expiresAt: number;
}

export interface Exercise {
  id: string;
  name_fa: string;
  name_en: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
  category_fa: string;
  equipment: 'barbell' | 'dumbbell' | 'cable' | 'bodyweight' | 'machine';
  equipment_fa: string;
  target_muscles: string;
  secondary_muscles?: string | null;
  instructions_fa: string;
  gif_url: string;
  created_at: string;
}

export interface Routine {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  exercises?: RoutineExerciseDetail[];
}

export interface RoutineExercise {
  id: string;
  routine_id: string;
  exercise_id: string;
  order_index: number;
  target_sets: number;
  target_reps: number;
  rest_seconds: number;
}

export interface RoutineExerciseDetail extends RoutineExercise {
  name_fa: string;
  name_en: string;
  category: string;
  category_fa: string;
  equipment: string;
  equipment_fa: string;
  gif_url: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  routine_id?: string | null;
  title: string;
  start_time: string;
  end_time?: string | null;
  duration_seconds: number;
  total_volume_kg: number;
  notes?: string | null;
  status: 'active' | 'completed' | 'discarded';
  routine_title?: string;
  set_logs?: WorkoutSetLogDetail[];
  planned_exercises?: RoutineExerciseDetail[];
}

export interface WorkoutSetLog {
  id: string;
  session_id: string;
  user_id: string;
  exercise_id: string;
  set_number: number;
  reps: number;
  weight_kg: number;
  is_pr: number; // 0 or 1
  rpe?: number | null;
  completed_at: string;
}

export interface WorkoutSetLogDetail extends WorkoutSetLog {
  exercise_name_fa: string;
  exercise_name_en: string;
  exercise_category: string;
  exercise_category_fa: string;
  exercise_gif_url: string;
}

export interface PersonalRecord {
  exercise_id: string;
  exercise_name_fa: string;
  exercise_name_en: string;
  max_weight_kg: number;
  reps_at_max: number;
  achieved_at: string;
  category_fa: string;
}

export interface DashboardSummary {
  user: User;
  streakDays: number;
  totalWorkouts: number;
  totalVolumeKg: number;
  topMuscles: { category_fa: string; count: number }[];
  recentWorkouts: WorkoutSession[];
  latestPRs: PersonalRecord[];
  activeSession: WorkoutSession | null;
}
