// Offline set logging: a set that can't reach the server is queued in localStorage, shown
// in the workout as logged, and sent when the connection returns. The server replaces a
// set with the same session/exercise/number, so a resend never duplicates it.
export function renderOfflineScript(): string {
  return String.raw`
    const PENDING_SETS_KEY = 'pending_set_logs_v1';
    let flushingPendingSets = null;

    function readPendingSets() {
      try {
        const list = JSON.parse(localStorage.getItem(PENDING_SETS_KEY) || '[]');
        return Array.isArray(list) ? list : [];
      } catch (e) { return []; }
    }

    function writePendingSets(list) {
      try {
        if (list.length) localStorage.setItem(PENDING_SETS_KEY, JSON.stringify(list));
        else localStorage.removeItem(PENDING_SETS_KEY);
      } catch (e) {}
    }

    function pendingSetsFor(sessionId) {
      return readPendingSets().filter(p => p.session_id === sessionId);
    }

    function queuePendingSet(entry) {
      const list = readPendingSets().filter(p => !(p.session_id === entry.session_id && p.exercise_id === entry.exercise_id && p.set_number === entry.set_number));
      list.push({ ...entry, id: 'pending-' + Date.now() + '-' + Math.floor(Math.random() * 1e6), pending: true });
      writePendingSets(list);
    }

    function removePendingSet(id) {
      writePendingSets(readPendingSets().filter(p => p.id !== id));
    }

    function clearPendingSetsFor(sessionId) {
      writePendingSets(readPendingSets().filter(p => p.session_id !== sessionId));
    }

    // Send queued sets in order; returns how many are still waiting. Concurrent calls share one run.
    function flushPendingSets() {
      if (!flushingPendingSets) {
        flushingPendingSets = (async () => {
          let sent = 0;
          for (const entry of readPendingSets()) {
            let res;
            try {
              res = await fetch('/api/workouts/' + encodeURIComponent(entry.session_id) + '/sets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exercise_id: entry.exercise_id, set_number: entry.set_number, reps: entry.reps, weight_kg: entry.weight_kg, rpe: entry.rpe })
              });
            } catch (e) {
              break; // Still offline; keep the rest queued in order
            }
            if (res.status >= 500) break; // Server trouble; try again later
            const data = await res.json().catch(() => ({}));
            // A rejected set (e.g. session deleted elsewhere) would block the queue forever
            removePendingSet(entry.id);
            if (!res.ok || !data.success) continue;
            sent++;
            const log = data.set_log || data.log;
            if (activeSession && activeSession.id === entry.session_id && log) {
              activeSession.set_logs = (activeSession.set_logs || []).filter(s => !(s.exercise_id === log.exercise_id && s.set_number === log.set_number));
              activeSession.set_logs.push(log);
              activeSession.total_volume_kg = activeSession.set_logs.reduce((sum, s) => sum + (s.weight_kg * s.reps), 0);
            }
          }
          if (sent) {
            showNotification(toPersianDigits(sent) + ' ست آفلاین همگام شد', 'success');
            if (activeSession) renderActiveWorkoutTodoList();
          }
          return readPendingSets().length;
        })().finally(() => { flushingPendingSets = null; });
      }
      return flushingPendingSets;
    }

    window.addEventListener('online', () => { if (currentUser) flushPendingSets(); });

    // Cached API reads belong to whoever was signed in; drop them on logout
    async function clearOfflineApiCache() {
      try {
        if (!window.caches) return;
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k.startsWith('api-')).map(k => caches.delete(k)));
      } catch (e) {}
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
    }
  `;
}
