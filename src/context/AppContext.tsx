import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { AppState, UserProfile, WorkoutLog, SleepLog, CoachMessage, Language } from '../types';
import { StorageService, DEFAULT_PROFILE } from '../services/storage';
import { Theme, THEMES } from '../constants/theme';
import { getTodayISO } from '../utils/date';

interface AppContextValue {
  state: AppState;
  theme: Theme;
  isLoading: boolean;
  // Profile
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  // Hydration
  addWater: (amountMl: number) => Promise<void>;
  // Activity
  addWorkout: (workout: Omit<WorkoutLog, 'id'>) => Promise<void>;
  // Sleep
  addSleepLog: (log: Omit<SleepLog, 'id'>) => Promise<void>;
  // Coach
  addCoachMessage: (msg: CoachMessage) => Promise<void>;
  // Reset
  resetAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    profile: DEFAULT_PROFILE,
    activityDays: [],
    workouts: [],
    sleepLogs: [],
    hydrationLogs: [],
    coachHistory: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const theme: Theme = THEMES[state.profile.theme] ?? THEMES['midnight-lime'];

  useEffect(() => {
    StorageService.loadAll()
      .then((loaded) => {
        setState(loaded);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const updateProfile = useCallback(async (partial: Partial<UserProfile>) => {
    setState((prev) => {
      const next: AppState = { ...prev, profile: { ...prev.profile, ...partial } };
      StorageService.saveProfile(next.profile);
      return next;
    });
  }, []);

  const addWater = useCallback(async (amountMl: number) => {
    const today = getTodayISO();
    setState((prev) => {
      const logs = [...prev.hydrationLogs];
      const idx = logs.findIndex((h) => h.date === today);
      const entry = {
        id: Math.random().toString(36).slice(2),
        time: new Date().toTimeString().slice(0, 5),
        amountMl,
      };
      if (idx >= 0) {
        logs[idx] = {
          ...logs[idx],
          entries: [...logs[idx].entries, entry],
          totalMl: logs[idx].totalMl + amountMl,
        };
      } else {
        logs.unshift({ date: today, entries: [entry], totalMl: amountMl });
      }
      StorageService.saveHydrationLogs(logs);
      return { ...prev, hydrationLogs: logs };
    });
  }, []);

  const addWorkout = useCallback(async (workout: Omit<WorkoutLog, 'id'>) => {
    setState((prev) => {
      const next: WorkoutLog = { ...workout, id: Math.random().toString(36).slice(2) + Date.now() };
      const workouts = [next, ...prev.workouts];
      StorageService.saveWorkouts(workouts);
      return { ...prev, workouts };
    });
  }, []);

  const addSleepLog = useCallback(async (log: Omit<SleepLog, 'id'>) => {
    setState((prev) => {
      const next: SleepLog = { ...log, id: Math.random().toString(36).slice(2) + Date.now() };
      // Remove demo logs when user adds real data
      const existing = prev.sleepLogs.filter((s) => !s.isDemo || s.date !== log.date);
      const logs = [next, ...existing].sort((a, b) => b.date.localeCompare(a.date));
      StorageService.saveSleepLogs(logs);
      return { ...prev, sleepLogs: logs };
    });
  }, []);

  const addCoachMessage = useCallback(async (msg: CoachMessage) => {
    setState((prev) => {
      const history = [...prev.coachHistory, msg];
      StorageService.saveCoachHistory(history);
      return { ...prev, coachHistory: history };
    });
  }, []);

  const resetAllData = useCallback(async () => {
    await StorageService.resetAll();
    const fresh = await StorageService.loadAll();
    setState(fresh);
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        theme,
        isLoading,
        updateProfile,
        addWater,
        addWorkout,
        addSleepLog,
        addCoachMessage,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useTheme(): Theme {
  return useApp().theme;
}

export function useLang(): Language {
  return useApp().state.profile.language;
}
