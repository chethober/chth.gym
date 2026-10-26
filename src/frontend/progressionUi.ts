// Progression suggestions for the active workout: what to lift today, from the last session.
// Double progression: hit the target reps on every top set, then add weight; otherwise
// keep the weight and add a rep. Bodyweight moves just aim for one more rep.
export function renderProgressionScript(): string {
  return String.raw`
    let lastSessionSets = {};
    const progressionRequested = new Set();
    // Exercises whose weight/reps were filled automatically, so a suggestion may replace them
    const autoSeededInputs = new Set();

    function suggestNextSet(lastSets, targetReps) {
      const working = (lastSets || []).filter(s => Number(s.reps) > 0);
      if (!working.length) return null;
      const target = Number(targetReps) || 10;
      const topWeight = Math.max(...working.map(s => Number(s.weight_kg) || 0));
      const topSets = working.filter(s => (Number(s.weight_kg) || 0) === topWeight);
      const minReps = Math.min(...topSets.map(s => Number(s.reps)));

      if (topWeight <= 0) {
        const bestReps = Math.max(...working.map(s => Number(s.reps)));
        return { weight_kg: 0, reps: Math.min(100, bestReps + 1), reason: 'reps' };
      }
      if (minReps >= target) {
        const step = topWeight >= 20 ? 2.5 : 1;
        return { weight_kg: Math.round((topWeight + step) * 10) / 10, reps: target, reason: 'increase' };
      }
      return { weight_kg: topWeight, reps: Math.min(target, minReps + 1), reason: 'repeat' };
    }

    function progressionSuggestion(item) {
      if (!item || item.logs.length > 0) return null;
      return suggestNextSet(lastSessionSets[item.id], item.target_reps);
    }

    function formatSuggestion(s) {
      const arrow = s.reason === 'increase' ? ' ↑' : '';
      return s.weight_kg > 0
        ? 'پیشنهاد امروز: ' + toPersianDigits(s.weight_kg) + ' کیلو × ' + toPersianDigits(s.reps) + arrow
        : 'پیشنهاد امروز: ' + toPersianDigits(s.reps) + ' تکرار';
    }

    // Fetch last-session sets once per exercise; re-render if anything new arrived.
    async function loadProgressionFor(items) {
      if (!currentUser) return;
      const ids = items.map(i => i.id).filter(id => !progressionRequested.has(id));
      if (!ids.length) return;
      ids.forEach(id => progressionRequested.add(id));
      try {
        const res = await fetch('/api/workouts/last-sets?ids=' + encodeURIComponent(ids.join(',')));
        if (!res.ok) throw new Error();
        const data = await res.json();
        let changed = false;
        Object.entries(data.sets || {}).forEach(([id, sets]) => {
          lastSessionSets[id] = sets;
          // Drop auto-filled values so the next render seeds from the suggestion
          if (autoSeededInputs.has(id)) {
            delete currentExerciseWeights[id];
            delete currentExerciseReps[id];
            autoSeededInputs.delete(id);
          }
          changed = true;
        });
        if (changed && activeSession) renderActiveWorkoutTodoList();
      } catch (e) {
        ids.forEach(id => progressionRequested.delete(id));
      }
    }
  `;
}
