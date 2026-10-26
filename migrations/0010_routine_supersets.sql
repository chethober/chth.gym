-- ============================================================================
-- Migration: 0010_routine_supersets.sql
-- Supersets: a routine exercise can be linked to the one after it.
-- Consecutive linked rows form one superset; rest is taken after the last.
-- ============================================================================

ALTER TABLE routine_exercises ADD COLUMN superset_next INTEGER NOT NULL DEFAULT 0;
