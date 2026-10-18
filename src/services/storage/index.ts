import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, UserProfile, ActivityDay, WorkoutLog, SleepLog, HydrationLog, CoachMessage } from '../../types';
import { generateDemoActivityDays, generateDemoSleepLogs } from '../../utils/health';
import { getTodayISO } from '../../utils/date';

const KEYS = {
  profile: '@pulse:profile',
  activityDays: '@pulse:activityDays',
  workouts: '@pulse:workouts',
  sleepLogs: '@pulse:sleepLogs',
  hydrationLogs: '@pulse:hydrationLogs',
  coachHistory: '@pulse:coachHistory',
};

export const DEFAULT_PROFILE: UserProfile = {
  displayName: 'User',
  weightUnit: 'kg',
  distanceUnit: 'km',
  language: 'en',
  theme: 'midnight-lime',
  stepGoal: 10000,
  sleepGoal: 8,
  hydrationGoal: 2500,
  notificationsEnabled: true,
};

async function safeGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function safeSet(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail – non-critical
  }
}

export const StorageService = {
  async loadAll(): Promise<AppState> {
    const [profile, activityDays, workouts, sleepLogs, hydrationLogs, coachHistory] =
      await Promise.all([
        safeGet<UserProfile>(KEYS.profile, DEFAULT_PROFILE),
        safeGet<ActivityDay[]>(KEYS.activityDays, []),
        safeGet<WorkoutLog[]>(KEYS.workouts, []),
        safeGet<SleepLog[]>(KEYS.sleepLogs, []),
        safeGet<HydrationLog[]>(KEYS.hydrationLogs, []),
        safeGet<CoachMessage[]>(KEYS.coachHistory, []),
      ]);

    // Inject demo data if no activity data exists
    const finalActivity = activityDays.length > 0 ? activityDays : generateDemoActivityDays();
    const finalSleep = sleepLogs.length > 0 ? sleepLogs : generateDemoSleepLogs();

    // Ensure today has hydration entry
    const today = getTodayISO();
    const hasToday = hydrationLogs.some((h) => h.date === today);
    const finalHydration = hasToday
      ? hydrationLogs
      : [{ date: today, entries: [], totalMl: 0 }, ...hydrationLogs];

    return {
      profile: { ...DEFAULT_PROFILE, ...profile },
      activityDays: finalActivity,
      workouts,
      sleepLogs: finalSleep,
      hydrationLogs: finalHydration,
      coachHistory,
    };
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    await safeSet(KEYS.profile, profile);
  },

  async saveActivityDays(days: ActivityDay[]): Promise<void> {
    await safeSet(KEYS.activityDays, days);
  },

  async saveWorkouts(workouts: WorkoutLog[]): Promise<void> {
    await safeSet(KEYS.workouts, workouts);
  },

  async saveSleepLogs(logs: SleepLog[]): Promise<void> {
    await safeSet(KEYS.sleepLogs, logs);
  },

  async saveHydrationLogs(logs: HydrationLog[]): Promise<void> {
    await safeSet(KEYS.hydrationLogs, logs);
  },

  async saveCoachHistory(history: CoachMessage[]): Promise<void> {
    await safeSet(KEYS.coachHistory, history);
  },

  async resetAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  },
};
