// ============================================================================
// Muscle recovery model for جسم و اندیشه
//
// Each logged set loads its exercise's primary muscles with weight 1 and its
// secondary muscles with weight 0.5. A muscle's most recent session decides how
// long it needs: 48h for small muscles, 72h for large ones, stretched by up to
// 1.5x when that session was heavy on sets.
// ============================================================================

export type MuscleState = 'fatigued' | 'recovering' | 'ready' | 'detrained' | 'untrained';

export interface MuscleSetRow {
  session_id: string;
  completed_at: string;
  muscles_primary: string | null;
  muscles_secondary: string | null;
}

export interface MuscleRecovery {
  slug: string;
  state: MuscleState;
  recoveryPct: number;      // 0–100, how far through its recovery window
  lastTrained: string | null;
  weeklySets: number;       // weighted sets over the last 7 days
}

const HOUR_MS = 3_600_000;
const SMALL_MUSCLES = new Set(['biceps', 'triceps', 'forearm', 'calves', 'abs', 'obliques', 'deltoids', 'serratus', 'tibialis']);
const SMALL_WINDOW_H = 48;
const LARGE_WINDOW_H = 72;
const DETRAINED_AFTER_H = 14 * 24;
const FATIGUED_BELOW_PCT = 50;

export const BODY_MAP_MUSCLES = [
  'abs', 'adductors', 'biceps', 'calves', 'chest', 'deltoids', 'forearm', 'gluteal', 'hamstring',
  'hip-flexors', 'lower-back', 'obliques', 'quadriceps', 'serratus', 'tibialis', 'trapezius',
  'triceps', 'upper-back'
];

function splitSlugs(value: string | null): string[] {
  return value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
}

// ≤6 weighted sets → ×1.0, ≥12 → ×1.5, linear in between
function loadFactor(sessionSets: number): number {
  return 1 + Math.min(Math.max((sessionSets - 6) / 6, 0), 1) * 0.5;
}

export function computeRecovery(rows: MuscleSetRow[], now: Date = new Date()): MuscleRecovery[] {
  const nowMs = now.getTime();
  const weekAgo = nowMs - 7 * 24 * HOUR_MS;

  // Per muscle: weekly load, plus the newest session and its load
  const stats = new Map<string, { weekly: number; lastMs: number; lastSession: string; lastSessionSets: number }>();

  const add = (slug: string, weight: number, row: MuscleSetRow, ms: number) => {
    let s = stats.get(slug);
    if (!s) {
      s = { weekly: 0, lastMs: 0, lastSession: '', lastSessionSets: 0 };
      stats.set(slug, s);
    }
    if (ms >= weekAgo) s.weekly += weight;
    if (row.session_id === s.lastSession) {
      s.lastSessionSets += weight;
      s.lastMs = Math.max(s.lastMs, ms);
    } else if (ms > s.lastMs) {
      s.lastSession = row.session_id;
      s.lastSessionSets = weight;
      s.lastMs = ms;
    }
  };

  // Oldest first, so a session's sets accumulate before a newer session replaces it
  const sorted = [...rows].sort((a, b) => Date.parse(a.completed_at) - Date.parse(b.completed_at));
  for (const row of sorted) {
    const ms = Date.parse(row.completed_at);
    if (!Number.isFinite(ms)) continue;
    const primary = splitSlugs(row.muscles_primary);
    primary.forEach(slug => add(slug, 1, row, ms));
    splitSlugs(row.muscles_secondary)
      .filter(slug => !primary.includes(slug))
      .forEach(slug => add(slug, 0.5, row, ms));
  }

  return BODY_MAP_MUSCLES.map((slug): MuscleRecovery => {
    const s = stats.get(slug);
    if (!s) return { slug, state: 'untrained', recoveryPct: 100, lastTrained: null, weeklySets: 0 };

    const hoursSince = (nowMs - s.lastMs) / HOUR_MS;
    const windowH = (SMALL_MUSCLES.has(slug) ? SMALL_WINDOW_H : LARGE_WINDOW_H) * loadFactor(s.lastSessionSets);
    const recoveryPct = Math.round(Math.min(Math.max(hoursSince / windowH, 0), 1) * 100);

    let state: MuscleState;
    if (hoursSince > DETRAINED_AFTER_H) state = 'detrained';
    else if (recoveryPct >= 100) state = 'ready';
    else if (recoveryPct < FATIGUED_BELOW_PCT) state = 'fatigued';
    else state = 'recovering';

    return {
      slug,
      state,
      recoveryPct,
      lastTrained: new Date(s.lastMs).toISOString(),
      weeklySets: Math.round(s.weekly * 10) / 10
    };
  });
}
