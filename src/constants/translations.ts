import { Language } from '../types';

export type TranslationKey =
  // Navigation
  | 'nav_home' | 'nav_activity' | 'nav_sleep' | 'nav_coach' | 'nav_profile'
  // Home
  | 'home_greeting_morning' | 'home_greeting_afternoon' | 'home_greeting_evening'
  | 'home_demo_label' | 'home_daily_summary' | 'home_wellness_score'
  | 'home_steps' | 'home_distance' | 'home_calories' | 'home_active_min'
  | 'home_sleep' | 'home_hydration' | 'home_add_water' | 'home_view_stats'
  | 'home_weekly_activity' | 'home_insight'
  // Activity
  | 'activity_title' | 'activity_goal' | 'activity_daily' | 'activity_weekly'
  | 'activity_monthly' | 'activity_log_workout' | 'activity_type'
  | 'activity_duration' | 'activity_distance_opt' | 'activity_calories_opt'
  | 'activity_save' | 'activity_history' | 'activity_edit_goal'
  // Sleep
  | 'sleep_title' | 'sleep_duration' | 'sleep_goal' | 'sleep_bedtime'
  | 'sleep_wake' | 'sleep_log' | 'sleep_quality' | 'sleep_avg'
  | 'sleep_weekly_trend' | 'sleep_reminder' | 'sleep_add'
  | 'sleep_poor' | 'sleep_fair' | 'sleep_good' | 'sleep_excellent'
  // Coach
  | 'coach_title' | 'coach_greeting' | 'coach_input_placeholder'
  | 'coach_send' | 'coach_suggestion_1' | 'coach_suggestion_2'
  | 'coach_suggestion_3' | 'coach_disclaimer'
  // Profile
  | 'profile_title' | 'profile_name' | 'profile_language' | 'profile_theme'
  | 'profile_step_goal' | 'profile_sleep_goal' | 'profile_hydration_goal'
  | 'profile_notifications' | 'profile_units' | 'profile_reset_data'
  | 'profile_reset_confirm' | 'profile_reset_cancel' | 'profile_version'
  | 'profile_save' | 'profile_bedtime_reminder'
  // Common
  | 'common_cancel' | 'common_save' | 'common_ok' | 'common_error'
  | 'common_loading' | 'common_empty' | 'common_demo_data'
  | 'common_steps' | 'common_km' | 'common_kcal' | 'common_min'
  | 'common_hours' | 'common_ml' | 'common_of' | 'common_goal'
  | 'common_today' | 'common_yesterday' | 'unit_kg' | 'unit_lbs';

type Translations = Record<TranslationKey, string>;

const en: Translations = {
  // Navigation
  nav_home: 'Home',
  nav_activity: 'Activity',
  nav_sleep: 'Sleep',
  nav_coach: 'Coach',
  nav_profile: 'Profile',
  // Home
  home_greeting_morning: 'Good morning',
  home_greeting_afternoon: 'Good afternoon',
  home_greeting_evening: 'Good evening',
  home_demo_label: 'Sample Data',
  home_daily_summary: 'Daily Summary',
  home_wellness_score: 'Wellness Score',
  home_steps: 'Steps',
  home_distance: 'Distance',
  home_calories: 'Calories',
  home_active_min: 'Active Min',
  home_sleep: 'Sleep',
  home_hydration: 'Hydration',
  home_add_water: '+ Water',
  home_view_stats: 'View Full Stats',
  home_weekly_activity: 'Weekly Activity',
  home_insight: 'Daily Insight',
  // Activity
  activity_title: 'Activity',
  activity_goal: 'Goal',
  activity_daily: 'Day',
  activity_weekly: 'Week',
  activity_monthly: 'Month',
  activity_log_workout: 'Log Workout',
  activity_type: 'Activity Type',
  activity_duration: 'Duration (min)',
  activity_distance_opt: 'Distance (km) – optional',
  activity_calories_opt: 'Calories – optional',
  activity_save: 'Save Workout',
  activity_history: 'Workout History',
  activity_edit_goal: 'Edit Goal',
  // Sleep
  sleep_title: 'Sleep',
  sleep_duration: 'Duration',
  sleep_goal: 'Sleep Goal',
  sleep_bedtime: 'Bedtime',
  sleep_wake: 'Wake Up',
  sleep_log: 'Sleep Log',
  sleep_quality: 'Quality',
  sleep_avg: 'Avg Duration',
  sleep_weekly_trend: 'Weekly Trend',
  sleep_reminder: 'Bedtime Reminder',
  sleep_add: 'Log Sleep',
  sleep_poor: 'Poor',
  sleep_fair: 'Fair',
  sleep_good: 'Good',
  sleep_excellent: 'Excellent',
  // Coach
  coach_title: 'Wellness Coach',
  coach_greeting: "Hi! I'm Pulse, your personal wellness coach. How can I help you today?",
  coach_input_placeholder: 'Ask me anything about your wellness…',
  coach_send: 'Send',
  coach_suggestion_1: 'How are my steps this week?',
  coach_suggestion_2: 'Tips to sleep better',
  coach_suggestion_3: 'Improve my hydration',
  coach_disclaimer: 'Pulse Coach provides general wellness guidance only, not medical advice.',
  // Profile
  profile_title: 'Profile',
  profile_name: 'Display Name',
  profile_language: 'Language',
  profile_theme: 'Theme',
  profile_step_goal: 'Daily Step Goal',
  profile_sleep_goal: 'Sleep Goal (hours)',
  profile_hydration_goal: 'Hydration Goal (ml)',
  profile_notifications: 'Notifications',
  profile_units: 'Units',
  profile_reset_data: 'Reset All Data',
  profile_reset_confirm: 'This will permanently delete all your data. Are you sure?',
  profile_reset_cancel: 'Cancel',
  profile_version: 'Version',
  profile_save: 'Save Profile',
  profile_bedtime_reminder: 'Bedtime Reminder',
  // Common
  common_cancel: 'Cancel',
  common_save: 'Save',
  common_ok: 'OK',
  common_error: 'Something went wrong',
  common_loading: 'Loading…',
  common_empty: 'No data yet',
  common_demo_data: 'Demo data – add your own in settings',
  common_steps: 'steps',
  common_km: 'km',
  common_kcal: 'kcal',
  common_min: 'min',
  common_hours: 'hrs',
  common_ml: 'ml',
  common_of: 'of',
  common_goal: 'goal',
  common_today: 'Today',
  common_yesterday: 'Yesterday',
  unit_kg: 'kg',
  unit_lbs: 'lbs',
};

const ar: Translations = {
  // Navigation
  nav_home: 'الرئيسية',
  nav_activity: 'النشاط',
  nav_sleep: 'النوم',
  nav_coach: 'المدرب',
  nav_profile: 'الملف',
  // Home
  home_greeting_morning: 'صباح الخير',
  home_greeting_afternoon: 'مساء الخير',
  home_greeting_evening: 'مساء النور',
  home_demo_label: 'بيانات تجريبية',
  home_daily_summary: 'ملخص اليوم',
  home_wellness_score: 'نقاط الصحة',
  home_steps: 'خطوات',
  home_distance: 'المسافة',
  home_calories: 'سعرات',
  home_active_min: 'دقائق نشطة',
  home_sleep: 'النوم',
  home_hydration: 'الترطيب',
  home_add_water: '+ ماء',
  home_view_stats: 'عرض الإحصاء',
  home_weekly_activity: 'النشاط الأسبوعي',
  home_insight: 'نصيحة اليوم',
  // Activity
  activity_title: 'النشاط',
  activity_goal: 'الهدف',
  activity_daily: 'يومي',
  activity_weekly: 'أسبوعي',
  activity_monthly: 'شهري',
  activity_log_workout: 'تسجيل تمرين',
  activity_type: 'نوع النشاط',
  activity_duration: 'المدة (دقيقة)',
  activity_distance_opt: 'المسافة (كم) – اختياري',
  activity_calories_opt: 'السعرات – اختياري',
  activity_save: 'حفظ التمرين',
  activity_history: 'سجل التمارين',
  activity_edit_goal: 'تعديل الهدف',
  // Sleep
  sleep_title: 'النوم',
  sleep_duration: 'المدة',
  sleep_goal: 'هدف النوم',
  sleep_bedtime: 'وقت النوم',
  sleep_wake: 'وقت الاستيقاظ',
  sleep_log: 'سجل النوم',
  sleep_quality: 'الجودة',
  sleep_avg: 'متوسط المدة',
  sleep_weekly_trend: 'الاتجاه الأسبوعي',
  sleep_reminder: 'تذكير النوم',
  sleep_add: 'تسجيل نوم',
  sleep_poor: 'سيء',
  sleep_fair: 'مقبول',
  sleep_good: 'جيد',
  sleep_excellent: 'ممتاز',
  // Coach
  coach_title: 'مدرب الصحة',
  coach_greeting: 'مرحباً! أنا بولس، مدربك الصحي الشخصي. كيف يمكنني مساعدتك اليوم؟',
  coach_input_placeholder: 'اسألني أي شيء عن صحتك…',
  coach_send: 'إرسال',
  coach_suggestion_1: 'كيف خطواتي هذا الأسبوع؟',
  coach_suggestion_2: 'نصائح لنوم أفضل',
  coach_suggestion_3: 'تحسين الترطيب',
  coach_disclaimer: 'مدرب بولس يقدم إرشادات صحية عامة فقط، وليست نصائح طبية.',
  // Profile
  profile_title: 'الملف الشخصي',
  profile_name: 'الاسم',
  profile_language: 'اللغة',
  profile_theme: 'المظهر',
  profile_step_goal: 'هدف الخطوات اليومي',
  profile_sleep_goal: 'هدف النوم (ساعات)',
  profile_hydration_goal: 'هدف الترطيب (مل)',
  profile_notifications: 'الإشعارات',
  profile_units: 'الوحدات',
  profile_reset_data: 'إعادة تعيين البيانات',
  profile_reset_confirm: 'سيؤدي هذا إلى حذف جميع بياناتك نهائياً. هل أنت متأكد؟',
  profile_reset_cancel: 'إلغاء',
  profile_version: 'الإصدار',
  profile_save: 'حفظ الملف',
  profile_bedtime_reminder: 'تذكير النوم',
  // Common
  common_cancel: 'إلغاء',
  common_save: 'حفظ',
  common_ok: 'موافق',
  common_error: 'حدث خطأ ما',
  common_loading: 'جارٍ التحميل…',
  common_empty: 'لا توجد بيانات',
  common_demo_data: 'بيانات تجريبية – أضف بياناتك في الإعدادات',
  common_steps: 'خطوة',
  common_km: 'كم',
  common_kcal: 'سعرة',
  common_min: 'دقيقة',
  common_hours: 'ساعة',
  common_ml: 'مل',
  common_of: 'من',
  common_goal: 'الهدف',
  common_today: 'اليوم',
  common_yesterday: 'أمس',
  unit_kg: 'كجم',
  unit_lbs: 'رطل',
};

export const TRANSLATIONS: Record<Language, Translations> = { en, ar };

export function t(key: TranslationKey, lang: Language): string {
  return TRANSLATIONS[lang][key] ?? key;
}
