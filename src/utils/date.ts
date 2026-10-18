import { Language } from '../types';

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(isoDate: string, lang: Language): string {
  const date = new Date(isoDate + 'T00:00:00');
  if (lang === 'ar') {
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(isoDate: string, lang: Language): string {
  const date = new Date(isoDate + 'T00:00:00');
  if (lang === 'ar') {
    return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getGreeting(lang: Language): string {
  const hour = new Date().getHours();
  if (lang === 'ar') {
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'مساء النور';
  }
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

export function getDayLabel(isoDate: string, lang: Language): string {
  const date = new Date(isoDate + 'T00:00:00');
  if (lang === 'ar') {
    return date.toLocaleDateString('ar-SA', { weekday: 'short' });
  }
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function calcSleepDuration(bedtime: string, wakeTime: string): number {
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let bedMinutes = bh * 60 + bm;
  let wakeMinutes = wh * 60 + wm;
  if (wakeMinutes <= bedMinutes) wakeMinutes += 24 * 60;
  return (wakeMinutes - bedMinutes) / 60;
}
