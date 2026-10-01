-- ============================================================================
-- Migration: 0003_user_profile_and_daily_logs.sql
-- User Profile, Fitness Goals, Daily Check-ins & Reminders
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id TEXT PRIMARY KEY,
    gender TEXT DEFAULT 'male',                     -- 'male', 'female', 'other'
    age INTEGER DEFAULT 25,
    height_cm REAL DEFAULT 175,
    current_weight_kg REAL DEFAULT 75,
    target_weight_kg REAL DEFAULT 80,
    fitness_level TEXT DEFAULT 'intermediate',      -- 'beginner', 'intermediate', 'advanced'
    fitness_goal TEXT DEFAULT 'hypertrophy',        -- 'hypertrophy', 'fat_loss', 'strength', 'endurance', 'general_health'
    target_weekly_workouts INTEGER DEFAULT 4,
    daily_water_target_liters REAL DEFAULT 2.5,
    daily_reminder_enabled INTEGER DEFAULT 1,       -- 1 = enabled, 0 = disabled
    daily_reminder_time TEXT DEFAULT '20:00',       -- 24h format e.g. 20:00
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    log_date TEXT NOT NULL,                         -- YYYY-MM-DD
    weight_kg REAL,
    water_liters REAL DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, log_date);
