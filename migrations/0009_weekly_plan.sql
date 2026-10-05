-- ============================================================================
-- Migration: 0009_weekly_plan.sql
-- Weekly planner: which saved routines are scheduled on each weekday
-- plan_json shape: { "0": ["routine_id", ...], ..., "6": [...] } (0 = Saturday)
-- ============================================================================

CREATE TABLE IF NOT EXISTS weekly_plans (
    user_id TEXT PRIMARY KEY,
    plan_json TEXT NOT NULL DEFAULT '{}',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
