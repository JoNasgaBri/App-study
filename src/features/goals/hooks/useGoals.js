import { useCallback, useState } from 'react';
import { storage } from '../../../shared/lib/storage';

const GOALS_LOG_KEY = 'goals:log';

/** "YYYY-MM-DD" in local time */
export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const loadLog = () =>
  storage.get(GOALS_LOG_KEY, {}, (v, fb) => (v && typeof v === 'object' && !Array.isArray(v) ? v : fb));

const saveLog = (log) => storage.set(GOALS_LOG_KEY, log);

/** Count consecutive completed days ending on or before yesterday. */
const computeStreak = (log) => {
  let streak = 0;
  const today = todayKey();
  let cursor = new Date();
  cursor.setDate(cursor.getDate() - 1); // start from yesterday

  // If today is already done, count it too
  const todayGoals = log[today] ?? [];
  if (todayGoals.length > 0 && todayGoals.every((g) => g.done)) {
    streak += 1;
    cursor = new Date(); // reset to today, then loop from yesterday again
    cursor.setDate(cursor.getDate() - 1);
  }

  let iterations = 0;
  while (iterations < 365) {
    iterations += 1;
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
    const dayGoals = log[key] ?? [];
    if (dayGoals.length > 0 && dayGoals.every((g) => g.done)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export function useGoals() {
  const [log, setLog] = useState(loadLog);
  const today = todayKey();
  const goals = log[today] ?? [];

  const mutate = useCallback((updater) => {
    setLog((prev) => {
      const current = prev[today] ?? [];
      const next = typeof updater === 'function' ? updater(current) : updater;
      const newLog = { ...prev, [today]: next };
      saveLog(newLog);
      return newLog;
    });
  }, [today]);

  const addGoal = useCallback(
    (text, category = 'geral') => {
      if (!text.trim()) return;
      const goal = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text: text.trim().slice(0, 120),
        category,
        done: false,
        createdAt: new Date().toISOString(),
      };
      mutate((prev) => [goal, ...prev]);
    },
    [mutate],
  );

  const toggleGoal = useCallback(
    (id) => mutate((prev) => prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))),
    [mutate],
  );

  const removeGoal = useCallback(
    (id) => mutate((prev) => prev.filter((g) => g.id !== id)),
    [mutate],
  );

  const streak = computeStreak(log);
  const doneCount = goals.filter((g) => g.done).length;
  const allDone = goals.length > 0 && doneCount === goals.length;

  /** Last 7 days completion summary for the mini-history grid */
  const weekHistory = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayGoals = log[key] ?? [];
    const isToday = key === today;
    const completed = dayGoals.length > 0 && dayGoals.every((g) => g.done);
    const partial = !completed && dayGoals.some((g) => g.done);
    const label = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    return { key, label, completed, partial, empty: dayGoals.length === 0, isToday };
  });

  return {
    goals,
    addGoal,
    toggleGoal,
    removeGoal,
    streak,
    doneCount,
    allDone,
    weekHistory,
    log,
  };
}
