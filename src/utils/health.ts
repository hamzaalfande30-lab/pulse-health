import { ActivityDay, SleepLog, HydrationLog, UserProfile } from '../types';

export function calcWellnessScore(
  today: ActivityDay | undefined,
  sleepLast: SleepLog | undefined,
  hydration: HydrationLog | undefined,
  profile: UserProfile
): number {
  let score = 0;
  // Steps: 40 pts max
  if (today) {
    const stepRatio = Math.min(today.steps / profile.stepGoal, 1);
    score += Math.round(stepRatio * 40);
  }
  // Sleep: 30 pts max
  if (sleepLast) {
    const sleepRatio = Math.min(sleepLast.durationHours / profile.sleepGoal, 1);
    score += Math.round(sleepRatio * 30);
  }
  // Hydration: 30 pts max
  if (hydration) {
    const hydRatio = Math.min(hydration.totalMl / profile.hydrationGoal, 1);
    score += Math.round(hydRatio * 30);
  }
  return score;
}

export function getWellnessLabel(score: number, lang: 'en' | 'ar'): string {
  if (lang === 'ar') {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    if (score >= 40) return 'مقبول';
    return 'يحتاج تحسين';
  }
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
}

export function stepsToKm(steps: number): number {
  return Math.round((steps * 0.000762) * 100) / 100;
}

export function stepsToCalories(steps: number, weightKg = 70): number {
  return Math.round(steps * 0.04 * (weightKg / 70));
}

export function formatSteps(steps: number): string {
  if (steps >= 1000) {
    return (steps / 1000).toFixed(1) + 'k';
  }
  return steps.toString();
}

export function generateDemoActivityDays(): ActivityDay[] {
  const base = [7200, 8400, 5100, 9800, 11200, 6700, 8900];
  const days: ActivityDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().split('T')[0];
    const steps = base[6 - i];
    days.push({
      date,
      steps,
      distanceKm: stepsToKm(steps),
      caloriesBurned: stepsToCalories(steps),
      activeMinutes: Math.round(steps / 100),
      isDemo: true,
    });
  }
  return days;
}

export function generateDemoSleepLogs(): SleepLog[] {
  const data = [
    { bed: '23:30', wake: '07:00', q: 'good' as const },
    { bed: '00:00', wake: '07:30', q: 'fair' as const },
    { bed: '22:45', wake: '06:45', q: 'excellent' as const },
    { bed: '23:00', wake: '06:00', q: 'good' as const },
    { bed: '01:00', wake: '07:00', q: 'poor' as const },
    { bed: '23:15', wake: '07:15', q: 'good' as const },
    { bed: '22:30', wake: '06:30', q: 'excellent' as const },
  ];
  return data.map((d, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const isoDate = date.toISOString().split('T')[0];
    const [bh, bm] = d.bed.split(':').map(Number);
    const [wh, wm] = d.wake.split(':').map(Number);
    let wakeMin = wh * 60 + wm;
    let bedMin = bh * 60 + bm;
    if (wakeMin <= bedMin) wakeMin += 24 * 60;
    const dur = (wakeMin - bedMin) / 60;
    return {
      id: `demo-sleep-${i}`,
      date: isoDate,
      bedtime: d.bed,
      wakeTime: d.wake,
      durationHours: Math.round(dur * 10) / 10,
      quality: d.q,
      isDemo: true,
    };
  });
}
