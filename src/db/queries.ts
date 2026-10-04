// ============================================================================
// D1 SQLite Query Helpers for جسم و اندیشه
// ============================================================================

import {
  User,
  UserProfile,
  DailyLog,
  Exercise,
  Routine,
  RoutineExerciseDetail,
  WorkoutSession,
  WorkoutSetLogDetail,
  PersonalRecord,
  DashboardSummary
} from '../types';

export class Database {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  // --- Users ---
  async getUserById(id: string): Promise<User | null> {
    const res = await this.db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(id)
      .first<User>();
    return res || null;
  }

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    const res = await this.db
      .prepare('SELECT * FROM users WHERE google_id = ?')
      .bind(googleId)
      .first<User>();
    return res || null;
  }

  async upsertGoogleUser(googleId: string, email: string, name: string, avatarUrl?: string): Promise<User> {
    const existing = await this.getUserByGoogleId(googleId);
    const now = new Date().toISOString();

    if (existing) {
      await this.db
        .prepare('UPDATE users SET name = ?, avatar_url = ?, updated_at = ? WHERE id = ?')
        .bind(name, avatarUrl || existing.avatar_url, now, existing.id)
        .run();
      return {
        ...existing,
        name,
        avatar_url: avatarUrl || existing.avatar_url,
        updated_at: now
      };
    }

    const newId = `usr_${crypto.randomUUID()}`;
    await this.db
      .prepare('INSERT INTO users (id, google_id, email, name, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(newId, googleId, email, name, avatarUrl || null, now, now)
      .run();

    return {
      id: newId,
      google_id: googleId,
      email,
      name,
      avatar_url: avatarUrl || null,
      created_at: now,
      updated_at: now
    };
  }

  // --- User Profiles & Goals ---
  async getUserProfile(userId: string): Promise<UserProfile> {
    const profile = await this.db
      .prepare('SELECT * FROM user_profiles WHERE user_id = ?')
      .bind(userId)
      .first<UserProfile>();

    if (profile) return profile;

    // Create default profile if not exists
    const now = new Date().toISOString();
    await this.db
      .prepare(`
        INSERT INTO user_profiles (
          user_id, gender, age, height_cm, current_weight_kg, target_weight_kg,
          fitness_level, fitness_goal, target_weekly_workouts, daily_water_target_liters,
          daily_reminder_enabled, daily_reminder_time, updated_at
        ) VALUES (?, 'male', 25, 175, 75, 80, 'intermediate', 'hypertrophy', 4, 2.5, 1, '20:00', ?)
      `)
      .bind(userId, now)
      .run();

    return {
      user_id: userId,
      gender: 'male',
      age: 25,
      height_cm: 175,
      current_weight_kg: 75,
      target_weight_kg: 80,
      fitness_level: 'intermediate',
      fitness_goal: 'hypertrophy',
      target_weekly_workouts: 4,
      daily_water_target_liters: 2.5,
      daily_reminder_enabled: 1,
      daily_reminder_time: '20:00',
      updated_at: now
    };
  }

  async upsertUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getUserProfile(userId);
    const now = new Date().toISOString();

    const updated: UserProfile = {
      ...current,
      ...data,
      user_id: userId,
      updated_at: now
    };

    await this.db
      .prepare(`
        INSERT INTO user_profiles (
          user_id, gender, age, height_cm, current_weight_kg, target_weight_kg,
          fitness_level, fitness_goal, target_weekly_workouts, daily_water_target_liters,
          daily_reminder_enabled, daily_reminder_time, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          gender = excluded.gender,
          age = excluded.age,
          height_cm = excluded.height_cm,
          current_weight_kg = excluded.current_weight_kg,
          target_weight_kg = excluded.target_weight_kg,
          fitness_level = excluded.fitness_level,
          fitness_goal = excluded.fitness_goal,
          target_weekly_workouts = excluded.target_weekly_workouts,
          daily_water_target_liters = excluded.daily_water_target_liters,
          daily_reminder_enabled = excluded.daily_reminder_enabled,
          daily_reminder_time = excluded.daily_reminder_time,
          updated_at = excluded.updated_at
      `)
      .bind(
        userId,
        updated.gender || 'male',
        Number(updated.age) || 25,
        Number(updated.height_cm) || 175,
        Number(updated.current_weight_kg) || 75,
        Number(updated.target_weight_kg) || 80,
        updated.fitness_level || 'intermediate',
        updated.fitness_goal || 'hypertrophy',
        Number(updated.target_weekly_workouts) || 4,
        Number(updated.daily_water_target_liters) || 2.5,
        updated.daily_reminder_enabled !== undefined ? (updated.daily_reminder_enabled ? 1 : 0) : 1,
        updated.daily_reminder_time || '20:00',
        now
      )
      .run();

    return updated;
  }

  // --- Daily Check-in Logs ---
  async logDailyMetric(
    userId: string,
    weightKg?: number,
    waterLiters?: number,
    notes?: string,
    logDate?: string
  ): Promise<DailyLog> {
    const today = logDate || new Date().toISOString().split('T')[0];
    const logId = `dlog_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    await this.db
      .prepare(`
        INSERT INTO daily_logs (id, user_id, log_date, weight_kg, water_liters, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, log_date) DO UPDATE SET
          weight_kg = COALESCE(excluded.weight_kg, daily_logs.weight_kg),
          water_liters = COALESCE(excluded.water_liters, daily_logs.water_liters),
          notes = COALESCE(excluded.notes, daily_logs.notes),
          created_at = excluded.created_at
      `)
      .bind(
        logId,
        userId,
        today,
        weightKg !== undefined ? Number(weightKg) : null,
        waterLiters !== undefined ? Number(waterLiters) : null,
        notes || null,
        now
      )
      .run();

    // If weight was provided, also update current_weight_kg in user_profiles
    if (weightKg && weightKg > 0) {
      await this.db
        .prepare('UPDATE user_profiles SET current_weight_kg = ?, updated_at = ? WHERE user_id = ?')
        .bind(Number(weightKg), now, userId)
        .run();
    }

    return (await this.db
      .prepare('SELECT * FROM daily_logs WHERE user_id = ? AND log_date = ?')
      .bind(userId, today)
      .first<DailyLog>())!;
  }

  async getDailyLogs(userId: string, limit: number = 30): Promise<DailyLog[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM daily_logs WHERE user_id = ? ORDER BY log_date DESC LIMIT ?')
      .bind(userId, limit)
      .all<DailyLog>();
    return results || [];
  }

  // --- Exercises ---
  async getAllExercises(query?: string, category?: string, equipment?: string): Promise<Exercise[]> {
    let sql = 'SELECT * FROM exercises WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (equipment && equipment !== 'all') {
      sql += ' AND equipment = ?';
      params.push(equipment);
    }

    if (query && query.trim() !== '') {
      sql += ' AND (name_fa LIKE ? OR name_en LIKE ? OR target_muscles LIKE ? OR secondary_muscles LIKE ?)';
      const term = `%${query.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY category, name_fa ASC';

    const { results } = await this.db.prepare(sql).bind(...params).all<Exercise>();
    return results || [];
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    const res = await this.db
      .prepare('SELECT * FROM exercises WHERE id = ?')
      .bind(id)
      .first<Exercise>();
    return res || null;
  }

  // --- Routines ---
  async getRoutinesByUser(userId: string): Promise<Routine[]> {
    const { results: routines } = await this.db
      .prepare('SELECT * FROM routines WHERE user_id = ? ORDER BY created_at DESC')
      .bind(userId)
      .all<Routine>();

    if (!routines || routines.length === 0) return [];

    // Fetch routine exercises for each routine
    const fullRoutines: Routine[] = [];
    for (const routine of routines) {
      const { results: exercises } = await this.db
        .prepare(`
          SELECT re.*, e.name_fa, e.name_en, e.category, e.category_fa, e.equipment, e.equipment_fa, e.gif_url
          FROM routine_exercises re
          JOIN exercises e ON re.exercise_id = e.id
          WHERE re.routine_id = ?
          ORDER BY re.order_index ASC
        `)
        .bind(routine.id)
        .all<RoutineExerciseDetail>();

      fullRoutines.push({
        ...routine,
        exercises: exercises || []
      });
    }

    return fullRoutines;
  }

  async getRoutineById(routineId: string, userId: string): Promise<Routine | null> {
    const routine = await this.db
      .prepare('SELECT * FROM routines WHERE id = ? AND user_id = ?')
      .bind(routineId, userId)
      .first<Routine>();

    if (!routine) return null;

    const { results: exercises } = await this.db
      .prepare(`
        SELECT re.*, e.name_fa, e.name_en, e.category, e.category_fa, e.equipment, e.equipment_fa, e.gif_url
        FROM routine_exercises re
        JOIN exercises e ON re.exercise_id = e.id
        WHERE re.routine_id = ?
        ORDER BY re.order_index ASC
      `)
      .bind(routine.id)
      .all<RoutineExerciseDetail>();

    return {
      ...routine,
      exercises: exercises || []
    };
  }

  async getPublicRoutineById(routineId: string): Promise<Routine | null> {
    const routine = await this.db
      .prepare('SELECT * FROM routines WHERE id = ?')
      .bind(routineId)
      .first<Routine>();

    if (!routine) return null;

    const { results: exercises } = await this.db
      .prepare(`
        SELECT re.*, e.name_fa, e.name_en, e.category, e.category_fa, e.equipment, e.equipment_fa, e.gif_url
        FROM routine_exercises re
        JOIN exercises e ON re.exercise_id = e.id
        WHERE re.routine_id = ?
        ORDER BY re.order_index ASC
      `)
      .bind(routine.id)
      .all<RoutineExerciseDetail>();

    return {
      ...routine,
      exercises: exercises || []
    };
  }

  async cloneRoutineForUser(targetUserId: string, sourceRoutineId: string): Promise<Routine | null> {
    const source = await this.getPublicRoutineById(sourceRoutineId);
    if (!source) return null;

    const exercises = (source.exercises || []).map(ex => ({
      exercise_id: ex.exercise_id,
      target_sets: ex.target_sets,
      target_reps: ex.target_reps,
      rest_seconds: ex.rest_seconds
    }));

    return await this.createRoutine(
      targetUserId,
      source.title,
      source.description || '',
      exercises
    );
  }

  async createRoutine(
    userId: string,
    title: string,
    description: string,
    exercises: { exercise_id: string; target_sets: number; target_reps: number; rest_seconds: number }[]
  ): Promise<Routine> {
    const routineId = `rtn_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    // Ensure the user exists in users table to satisfy foreign key constraint
    const existingUser = await this.getUserById(userId);
    if (!existingUser) {
      const email = userId.startsWith('guest') ? `${userId}@guest.local` : `user_${userId}@local.app`;
      const name = userId.startsWith('guest') ? 'کاربر مهمان' : 'کاربر';
      await this.db
        .prepare("INSERT OR IGNORE INTO users (id, name, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
        .bind(userId, name, email, now, now)
        .run();
    }

    await this.db
      .prepare('INSERT INTO routines (id, user_id, title, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(routineId, userId, title, description || null, now, now)
      .run();

    let orderIndex = 0;
    for (const item of exercises) {
      const exId = item.exercise_id;
      if (!exId) continue;
      // Ensure exercise exists in exercises table to avoid foreign key failure
      const exExists = await this.db.prepare('SELECT id FROM exercises WHERE id = ?').bind(exId).first();
      if (!exExists) continue;

      const itemKey = `re_${crypto.randomUUID()}`;
      await this.db
        .prepare('INSERT INTO routine_exercises (id, routine_id, exercise_id, order_index, target_sets, target_reps, rest_seconds) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(itemKey, routineId, exId, orderIndex++, item.target_sets || 3, item.target_reps || 10, item.rest_seconds || 60)
        .run();
    }

    return (await this.getRoutineById(routineId, userId)) || (await this.getPublicRoutineById(routineId))!;
  }

  async deleteRoutine(routineId: string, userId: string): Promise<boolean> {
    const res = await this.db
      .prepare('DELETE FROM routines WHERE id = ? AND user_id = ?')
      .bind(routineId, userId)
      .run();
    return (res.meta?.changes ?? 0) > 0;
  }

  // --- Active Workout & Tracking ---
  async getActiveWorkoutSession(userId: string): Promise<WorkoutSession | null> {
    const session = await this.db
      .prepare(`
        SELECT ws.*, r.title as routine_title
        FROM workout_sessions ws
        LEFT JOIN routines r ON ws.routine_id = r.id
        WHERE ws.user_id = ? AND ws.status = 'active'
        ORDER BY ws.start_time DESC
        LIMIT 1
      `)
      .bind(userId)
      .first<WorkoutSession>();

    if (!session) return null;

    const { results: logs } = await this.db
      .prepare(`
        SELECT wsl.*, e.name_fa as exercise_name_fa, e.name_en as exercise_name_en,
               e.category as exercise_category, e.category_fa as exercise_category_fa,
               e.gif_url as exercise_gif_url
        FROM workout_set_logs wsl
        JOIN exercises e ON wsl.exercise_id = e.id
        WHERE wsl.session_id = ?
        ORDER BY wsl.completed_at ASC
      `)
      .bind(session.id)
      .all<WorkoutSetLogDetail>();

    let plannedExercises: RoutineExerciseDetail[] = [];
    if (session.routine_id) {
      const { results } = await this.db
        .prepare(`
          SELECT re.*, e.name_fa, e.name_en, e.category, e.category_fa, e.equipment, e.equipment_fa, e.gif_url
          FROM routine_exercises re
          JOIN exercises e ON re.exercise_id = e.id
          WHERE re.routine_id = ?
          ORDER BY re.order_index ASC
        `)
        .bind(session.routine_id)
        .all<RoutineExerciseDetail>();
      plannedExercises = results || [];
    }

    return {
      ...session,
      set_logs: logs || [],
      planned_exercises: plannedExercises
    };
  }

  async startWorkoutSession(userId: string, title?: string, routineId?: string): Promise<WorkoutSession> {
    // If there is an active session, return it or discard older active ones
    const active = await this.getActiveWorkoutSession(userId);
    if (active) return active;

    const now = new Date().toISOString();

    // Ensure the user exists in users table
    const existingUser = await this.getUserById(userId);
    if (!existingUser) {
      const email = userId.startsWith('guest') ? `${userId}@guest.local` : `user_${userId}@local.app`;
      const name = userId.startsWith('guest') ? 'کاربر مهمان' : 'کاربر';
      await this.db
        .prepare("INSERT OR IGNORE INTO users (id, name, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
        .bind(userId, name, email, now, now)
        .run();
    }

    let sessionTitle = title || 'تمرین آزاد و اختصاصی';
    let validRoutineId: string | null = null;
    if (routineId) {
      const routineExists = await this.db.prepare('SELECT id, title FROM routines WHERE id = ?').bind(routineId).first<{ id: string; title: string }>();
      if (routineExists) {
        validRoutineId = routineExists.id;
        if (!title) sessionTitle = routineExists.title;
      }
    }

    const sessionId = `ses_${crypto.randomUUID()}`;

    await this.db
      .prepare('INSERT INTO workout_sessions (id, user_id, routine_id, title, start_time, total_volume_kg, status) VALUES (?, ?, ?, ?, ?, 0, "active")')
      .bind(sessionId, userId, validRoutineId, sessionTitle, now)
      .run();

    return (await this.getActiveWorkoutSession(userId))!;
  }

  async logWorkoutSet(
    userId: string,
    sessionId: string,
    exerciseId: string,
    setNumber: number,
    reps: number,
    weightKg: number,
    rpe?: number
  ): Promise<{ log: WorkoutSetLogDetail; isPr: boolean }> {
    const logId = `set_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    // Check if this is a PR (Personal Record for this exercise and user)
    const currentMax = await this.db
      .prepare(`
        SELECT MAX(weight_kg) as max_w
        FROM workout_set_logs
        WHERE user_id = ? AND exercise_id = ?
      `)
      .bind(userId, exerciseId)
      .first<{ max_w: number | null }>();

    const previousMax = currentMax?.max_w || 0;
    const isPr = weightKg > previousMax && reps >= 1;

    await this.db
      .prepare(`
        INSERT INTO workout_set_logs (id, session_id, user_id, exercise_id, set_number, reps, weight_kg, is_pr, rpe, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(logId, sessionId, userId, exerciseId, setNumber, reps, weightKg, isPr ? 1 : 0, rpe || null, now)
      .run();

    // Update session total volume
    await this.recalculateSessionVolume(sessionId);

    // Fetch the inserted record detail
    const log = await this.db
      .prepare(`
        SELECT wsl.*, e.name_fa as exercise_name_fa, e.name_en as exercise_name_en,
               e.category as exercise_category, e.category_fa as exercise_category_fa,
               e.gif_url as exercise_gif_url
        FROM workout_set_logs wsl
        JOIN exercises e ON wsl.exercise_id = e.id
        WHERE wsl.id = ?
      `)
      .bind(logId)
      .first<WorkoutSetLogDetail>();

    return {
      log: log!,
      isPr
    };
  }

  async deleteWorkoutSet(setId: string, userId: string): Promise<boolean> {
    const setLog = await this.db
      .prepare('SELECT session_id FROM workout_set_logs WHERE id = ? AND user_id = ?')
      .bind(setId, userId)
      .first<{ session_id: string }>();

    if (!setLog) return false;

    await this.db
      .prepare('DELETE FROM workout_set_logs WHERE id = ? AND user_id = ?')
      .bind(setId, userId)
      .run();

    await this.recalculateSessionVolume(setLog.session_id);
    return true;
  }

  private async recalculateSessionVolume(sessionId: string): Promise<number> {
    const res = await this.db
      .prepare(`
        SELECT SUM(weight_kg * reps) as total_vol
        FROM workout_set_logs
        WHERE session_id = ?
      `)
      .bind(sessionId)
      .first<{ total_vol: number | null }>();

    const totalVolume = res?.total_vol || 0;
    await this.db
      .prepare('UPDATE workout_sessions SET total_volume_kg = ? WHERE id = ?')
      .bind(totalVolume, sessionId)
      .run();

    return totalVolume;
  }

  async finishWorkoutSession(sessionId: string, userId: string, notes?: string): Promise<WorkoutSession | null> {
    const session = await this.db
      .prepare('SELECT * FROM workout_sessions WHERE id = ? AND user_id = ?')
      .bind(sessionId, userId)
      .first<WorkoutSession>();

    if (!session) return null;

    const endTime = new Date();
    const startTime = new Date(session.start_time);
    const durationSeconds = Math.max(0, Math.floor((endTime.getTime() - startTime.getTime()) / 1000));

    await this.recalculateSessionVolume(sessionId);

    await this.db
      .prepare(`
        UPDATE workout_sessions
        SET status = 'completed', end_time = ?, duration_seconds = ?, notes = ?
        WHERE id = ?
      `)
      .bind(endTime.toISOString(), durationSeconds, notes || null, sessionId)
      .run();

    return this.getWorkoutSessionById(sessionId, userId);
  }

  async discardWorkoutSession(sessionId: string, userId: string): Promise<boolean> {
    await this.db
      .prepare('DELETE FROM workout_set_logs WHERE session_id = ?')
      .bind(sessionId)
      .run();

    const res = await this.db
      .prepare('DELETE FROM workout_sessions WHERE id = ? AND user_id = ?')
      .bind(sessionId, userId)
      .run();

    return (res.meta?.changes ?? 0) > 0;
  }

  async getWorkoutSessionById(sessionId: string, userId: string): Promise<WorkoutSession | null> {
    const session = await this.db
      .prepare(`
        SELECT ws.*, r.title as routine_title
        FROM workout_sessions ws
        LEFT JOIN routines r ON ws.routine_id = r.id
        WHERE ws.id = ? AND ws.user_id = ?
      `)
      .bind(sessionId, userId)
      .first<WorkoutSession>();

    if (!session) return null;

    const { results: logs } = await this.db
      .prepare(`
        SELECT wsl.*, e.name_fa as exercise_name_fa, e.name_en as exercise_name_en,
               e.category as exercise_category, e.category_fa as exercise_category_fa,
               e.gif_url as exercise_gif_url
        FROM workout_set_logs wsl
        JOIN exercises e ON wsl.exercise_id = e.id
        WHERE wsl.session_id = ?
        ORDER BY wsl.completed_at ASC
      `)
      .bind(sessionId)
      .all<WorkoutSetLogDetail>();

    return {
      ...session,
      set_logs: logs || []
    };
  }

  async getWorkoutHistory(userId: string, limit: number = 20): Promise<WorkoutSession[]> {
    const { results: sessions } = await this.db
      .prepare(`
        SELECT ws.*, r.title as routine_title
        FROM workout_sessions ws
        LEFT JOIN routines r ON ws.routine_id = r.id
        WHERE ws.user_id = ? AND ws.status = 'completed'
        ORDER BY ws.start_time DESC
        LIMIT ?
      `)
      .bind(userId, limit)
      .all<WorkoutSession>();

    if (!sessions || sessions.length === 0) return [];

    // One query for every session's set logs instead of one query per session
    const { results: logs } = await this.db
      .prepare(`
        SELECT wsl.*, e.name_fa as exercise_name_fa, e.name_en as exercise_name_en,
               e.category as exercise_category, e.category_fa as exercise_category_fa,
               e.gif_url as exercise_gif_url
        FROM workout_set_logs wsl
        JOIN exercises e ON wsl.exercise_id = e.id
        WHERE wsl.session_id IN (
          SELECT id FROM workout_sessions
          WHERE user_id = ? AND status = 'completed'
          ORDER BY start_time DESC
          LIMIT ?
        )
        ORDER BY wsl.completed_at ASC
      `)
      .bind(userId, limit)
      .all<WorkoutSetLogDetail>();

    const logsBySession = new Map<string, WorkoutSetLogDetail[]>();
    for (const log of logs || []) {
      const list = logsBySession.get(log.session_id);
      if (list) list.push(log);
      else logsBySession.set(log.session_id, [log]);
    }

    const detailedSessions: WorkoutSession[] = sessions.map((session) => ({
      ...session,
      set_logs: logsBySession.get(session.id) || []
    }));

    return detailedSessions;
  }

  // --- Analytics & Dashboard ---
  async getDashboardSummary(user: User): Promise<DashboardSummary> {
    const userId = user.id;

    // Total workouts
    const totalWorkoutsRes = await this.db
      .prepare('SELECT COUNT(*) as cnt, SUM(total_volume_kg) as total_vol FROM workout_sessions WHERE user_id = ? AND status = "completed"')
      .bind(userId)
      .first<{ cnt: number; total_vol: number | null }>();

    const totalWorkouts = totalWorkoutsRes?.cnt || 0;
    const totalVolumeKg = totalWorkoutsRes?.total_vol || 0;

    // Top trained muscle categories
    const { results: topMuscles } = await this.db
      .prepare(`
        SELECT e.category_fa, COUNT(wsl.id) as count
        FROM workout_set_logs wsl
        JOIN exercises e ON wsl.exercise_id = e.id
        WHERE wsl.user_id = ?
        GROUP BY e.category_fa
        ORDER BY count DESC
        LIMIT 5
      `)
      .bind(userId)
      .all<{ category_fa: string; count: number }>();

    // Calculate Workout Streak
    const { results: workoutDates } = await this.db
      .prepare(`
        SELECT DISTINCT strftime('%Y-%m-%d', start_time) as w_date
        FROM workout_sessions
        WHERE user_id = ? AND status = 'completed'
        ORDER BY w_date DESC
      `)
      .bind(userId)
      .all<{ w_date: string }>();

    let streak = 0;
    if (workoutDates && workoutDates.length > 0) {
      const dates = workoutDates.map(d => d.w_date);
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      let currentDate = dates.includes(today) ? new Date(today) : (dates.includes(yesterday) ? new Date(yesterday) : null);

      if (currentDate) {
        let checkDate = new Date(currentDate);
        for (const dateStr of dates) {
          const expected = checkDate.toISOString().split('T')[0];
          if (dateStr === expected) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else if (new Date(dateStr) < checkDate) {
            break;
          }
        }
      }
    }

    // Latest PRs
    const latestPRs = await this.getUserPRs(userId, 5);

    // Recent Workouts
    const recentWorkouts = await this.getWorkoutHistory(userId, 5);

    // Active session
    const activeSession = await this.getActiveWorkoutSession(userId);

    return {
      user,
      streakDays: streak,
      totalWorkouts,
      totalVolumeKg,
      topMuscles: topMuscles || [],
      recentWorkouts,
      latestPRs,
      activeSession
    };
  }

  async getUserPRs(userId: string, limit: number = 20): Promise<PersonalRecord[]> {
    const { results } = await this.db
      .prepare(`
        SELECT 
          wsl.exercise_id,
          e.name_fa as exercise_name_fa,
          e.name_en as exercise_name_en,
          e.category_fa,
          MAX(wsl.weight_kg) as max_weight_kg,
          wsl.reps as reps_at_max,
          MAX(wsl.completed_at) as achieved_at
        FROM workout_set_logs wsl
        JOIN exercises e ON wsl.exercise_id = e.id
        WHERE wsl.user_id = ? AND wsl.weight_kg > 0
        GROUP BY wsl.exercise_id
        ORDER BY max_weight_kg DESC
        LIMIT ?
      `)
      .bind(userId, limit)
      .all<PersonalRecord>();

    return results || [];
  }

  async getVolumeProgression(userId: string, days: number = 30): Promise<{ date: string; volume: number }[]> {
    const { results } = await this.db
      .prepare(`
        SELECT 
          strftime('%Y-%m-%d', start_time) as date,
          SUM(total_volume_kg) as volume
        FROM workout_sessions
        WHERE user_id = ? AND status = 'completed' AND start_time >= datetime('now', '-' || ? || ' days')
        GROUP BY date
        ORDER BY date ASC
      `)
      .bind(userId, days)
      .all<{ date: string; volume: number }>();

    return results || [];
  }
}
