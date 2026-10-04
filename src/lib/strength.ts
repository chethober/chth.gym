// ============================================================================
// Strength estimates for جسم و اندیشه
// ============================================================================

// Above this many reps the 1RM formulas diverge too far to be meaningful.
export const E1RM_MAX_REPS = 12;

// Estimated one-rep max using Epley: w * (1 + r / 30).
// A single rep is the measurement itself; returns null when no honest estimate exists.
export function estimate1RM(weightKg: number, reps: number): number | null {
  if (!Number.isFinite(weightKg) || !Number.isFinite(reps)) return null;
  if (weightKg <= 0 || reps < 1 || reps > E1RM_MAX_REPS) return null;
  if (reps === 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

// Same formula as estimate1RM, as a SQL expression over workout_set_logs columns.
export const E1RM_SQL = `CASE WHEN reps BETWEEN 1 AND ${E1RM_MAX_REPS} AND weight_kg > 0
  THEN CASE WHEN reps = 1 THEN weight_kg ELSE weight_kg * (1 + reps / 30.0) END END`;
