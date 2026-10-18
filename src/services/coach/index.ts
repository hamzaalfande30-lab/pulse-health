import { AppState, CoachMessage } from '../../types';
import { getTodayISO } from '../../utils/date';

function id(): string {
  return Math.random().toString(36).slice(2) + Date.now();
}

function makeCoachMsg(content: string): CoachMessage {
  return {
    id: id(),
    role: 'coach',
    content,
    timestamp: new Date().toISOString(),
  };
}

export function getCoachResponse(input: string, state: AppState, lang: 'en' | 'ar'): CoachMessage {
  const lower = input.toLowerCase().trim();
  const today = getTodayISO();
  const todayActivity = state.activityDays.find((d) => d.date === today);
  const lastSleep = [...state.sleepLogs].sort((a, b) => b.date.localeCompare(a.date))[0];
  const todayHydration = state.hydrationLogs.find((h) => h.date === today);
  const { profile } = state;

  const isAr = lang === 'ar';

  // Steps queries
  if (lower.includes('step') || lower.includes('خطو') || lower.includes('walk') || lower.includes('مش')) {
    if (todayActivity) {
      const pct = Math.round((todayActivity.steps / profile.stepGoal) * 100);
      if (isAr)
        return makeCoachMsg(`اليوم لديك ${todayActivity.steps.toLocaleString()} خطوة، وهي ${pct}٪ من هدفك اليومي البالغ ${profile.stepGoal.toLocaleString()} خطوة. ${pct >= 100 ? '🎉 أحسنت، لقد حققت هدفك!' : 'استمر، أنت تسير في الاتجاه الصحيح!'}`);
      return makeCoachMsg(`You've taken ${todayActivity.steps.toLocaleString()} steps today — that's ${pct}% of your ${profile.stepGoal.toLocaleString()}-step daily goal. ${pct >= 100 ? '🎉 Goal achieved!' : 'Keep it up!'}`);
    }
  }

  // Sleep queries
  if (lower.includes('sleep') || lower.includes('نوم') || lower.includes('rest') || lower.includes('راح')) {
    if (lastSleep) {
      const diff = lastSleep.durationHours - profile.sleepGoal;
      if (isAr) {
        const msg = diff >= 0
          ? `نمت ${lastSleep.durationHours} ساعة الليلة الماضية، وهو أعلى من هدفك البالغ ${profile.sleepGoal} ساعة. رائع!`
          : `نمت ${lastSleep.durationHours} ساعة فقط، وهدفك ${profile.sleepGoal} ساعة. حاول النوم مبكرًا الليلة.`;
        return makeCoachMsg(msg + '\n\n💡 نصيحة: تجنب الشاشات قبل النوم بساعة واحدة لتحسين جودة نومك.');
      }
      const msg = diff >= 0
        ? `You slept ${lastSleep.durationHours} hours last night, exceeding your ${profile.sleepGoal}-hour goal. Great job!`
        : `You slept ${lastSleep.durationHours} hours last night, ${Math.abs(diff).toFixed(1)} hours short of your ${profile.sleepGoal}-hour goal. Try going to bed a bit earlier tonight.`;
      return makeCoachMsg(msg + '\n\n💡 Tip: Avoid screens 1 hour before bed to improve sleep quality.');
    }
  }

  // Hydration queries
  if (lower.includes('water') || lower.includes('hydrat') || lower.includes('ماء') || lower.includes('ترطيب') || lower.includes('شرب')) {
    if (todayHydration) {
      const pct = Math.round((todayHydration.totalMl / profile.hydrationGoal) * 100);
      if (isAr)
        return makeCoachMsg(`شربت ${todayHydration.totalMl} مل من الماء اليوم، وهي ${pct}٪ من هدفك البالغ ${profile.hydrationGoal} مل. ${pct >= 100 ? 'ممتاز، أنت رطّبت جسمك بشكل جيد!' : 'حاول شرب كوب ماء الآن!'}`);
      return makeCoachMsg(`You've had ${todayHydration.totalMl} ml of water today — ${pct}% of your ${profile.hydrationGoal} ml goal. ${pct >= 100 ? 'Excellent hydration!' : 'Try drinking a glass of water right now!'}`);
    }
  }

  // Calories
  if (lower.includes('calori') || lower.includes('سعر') || lower.includes('burn') || lower.includes('حر')) {
    if (todayActivity) {
      if (isAr)
        return makeCoachMsg(`أحرقت ${todayActivity.caloriesBurned} سعرة حرارية من النشاط البدني اليوم. لتحريق المزيد، جرّب المشي السريع لمدة 30 دقيقة إضافية.`);
      return makeCoachMsg(`You've burned approximately ${todayActivity.caloriesBurned} kcal from activity today. For more burn, try 30 extra minutes of brisk walking.`);
    }
  }

  // Wellness score
  if (lower.includes('score') || lower.includes('نقط') || lower.includes('wellness') || lower.includes('صح')) {
    if (isAr)
      return makeCoachMsg('نقاط الصحة اليومية تعتمد على خطواتك ونومك وترطيبك. ارفع النقاط بتحقيق أهدافك الثلاثة اليومية!');
    return makeCoachMsg('Your wellness score is based on your steps, sleep, and hydration goals. Hit all three daily goals to maximize it!');
  }

  // Tips
  if (lower.includes('tip') || lower.includes('نصيح') || lower.includes('advice') || lower.includes('suggest')) {
    const tips_en = [
      'Take a 5-minute walk every hour if you work at a desk.',
      'Drinking a glass of water first thing in the morning kick-starts your metabolism.',
      'A consistent sleep schedule — even on weekends — dramatically improves sleep quality.',
      'Try deep breathing for 2 minutes when you feel stressed.',
      'Stretching for 10 minutes before bed can reduce muscle tension and improve sleep.',
    ];
    const tips_ar = [
      'خذ استراحة مشي خمس دقائق كل ساعة إن كنت تعمل جالسًا.',
      'شرب كوب ماء فور الاستيقاظ يحفّز عملية الأيض.',
      'النوم في نفس الوقت يومياً، حتى في العطل، يحسّن جودة نومك بشكل كبير.',
      'جرّب التنفس العميق دقيقتين حين تشعر بالتوتر.',
      'التمدد عشر دقائق قبل النوم يقلّل توتر العضلات ويحسّن النوم.',
    ];
    const list = isAr ? tips_ar : tips_en;
    return makeCoachMsg(list[Math.floor(Math.random() * list.length)]);
  }

  // Workout
  if (lower.includes('workout') || lower.includes('exercise') || lower.includes('تمرين') || lower.includes('رياض')) {
    if (isAr)
      return makeCoachMsg(`لديك ${state.workouts.length} تمرين مسجل. التمارين المنتظمة تحسّن صحة القلب وتقلّل التوتر. هل تريد تسجيل تمرين جديد؟`);
    return makeCoachMsg(`You have ${state.workouts.length} workout${state.workouts.length !== 1 ? 's' : ''} logged. Regular exercise improves heart health and reduces stress. Want to log a new workout?`);
  }

  // Fallback
  if (isAr)
    return makeCoachMsg('يمكنني مساعدتك في تتبع خطواتك، نومك، ترطيبك، وتقديم نصائح صحية عامة. ماذا تريد معرفته؟');
  return makeCoachMsg("I can help you with your steps, sleep, hydration, and general wellness tips. What would you like to know about your health today?");
}
