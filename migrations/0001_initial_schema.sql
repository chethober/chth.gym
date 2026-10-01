-- ============================================================================
-- Migration: 0001_initial_schema.sql
-- Database schema for 'جسم و اندیشه' Gym & Workout Tracker
-- Target: Cloudflare D1 (SQLite)
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    google_id TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Exercises library table
CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY,
    name_fa TEXT NOT NULL,
    name_en TEXT NOT NULL,
    category TEXT NOT NULL,         -- chest, back, legs, shoulders, arms, core
    category_fa TEXT NOT NULL,      -- سینه, پشت و زیربغل, پا, سرشانه, بازو, شکم و میان‌تنه
    equipment TEXT NOT NULL,        -- barbell, dumbbell, cable, bodyweight, machine
    equipment_fa TEXT NOT NULL,     -- هالتر, دمبل, سیم‌کش, وزن بدن, دستگاه
    target_muscles TEXT NOT NULL,   -- e.g. "عضله سینه‌ای بزرگ، دلتوئید قدامی"
    secondary_muscles TEXT,         -- e.g. "پشت بازو (سه‌سر بازویی)"
    instructions_fa TEXT NOT NULL,  -- Step-by-step guidance in Persian
    gif_url TEXT NOT NULL,          -- URL to high quality movement GIF / video
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Workout routines (templates)
CREATE TABLE IF NOT EXISTS routines (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Routine exercise items with set/rep/rest configurations
CREATE TABLE IF NOT EXISTS routine_exercises (
    id TEXT PRIMARY KEY,
    routine_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    target_sets INTEGER NOT NULL DEFAULT 3,
    target_reps INTEGER NOT NULL DEFAULT 10,
    rest_seconds INTEGER NOT NULL DEFAULT 60,
    FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- Workout live & logged sessions
CREATE TABLE IF NOT EXISTS workout_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    routine_id TEXT,
    title TEXT NOT NULL,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    duration_seconds INTEGER DEFAULT 0,
    total_volume_kg REAL DEFAULT 0,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'discarded'
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE SET NULL
);

-- Workout individual set logs
CREATE TABLE IF NOT EXISTS workout_set_logs (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL DEFAULT 0,
    weight_kg REAL NOT NULL DEFAULT 0,
    is_pr INTEGER NOT NULL DEFAULT 0, -- 1 if personal record, 0 otherwise
    rpe REAL,                        -- Rate of Perceived Exertion (optional 1-10)
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- Indexes for optimal querying and analytics
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON exercises(equipment);
CREATE INDEX IF NOT EXISTS idx_routines_user_id ON routines(user_id);
CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine_id ON routine_exercises(routine_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_status ON workout_sessions(status);
CREATE INDEX IF NOT EXISTS idx_workout_set_logs_session_id ON workout_set_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_workout_set_logs_user_exercise ON workout_set_logs(user_id, exercise_id);
