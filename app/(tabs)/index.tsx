import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, useTheme, useLang } from '../../src/context/AppContext';
import { PText } from '../../src/components/common/Text';
import { Card } from '../../src/components/cards/Card';
import { ProgressRing } from '../../src/components/charts/ProgressRing';
import { BarChart, BarChartDataPoint } from '../../src/components/charts/BarChart';
import { t } from '../../src/constants/translations';
import { SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';
import { formatDate, getGreeting, getLast7Days, getDayLabel, getTodayISO } from '../../src/utils/date';
import { calcWellnessScore, getWellnessLabel, formatSteps } from '../../src/utils/health';

const WATER_OPTIONS = [150, 250, 350, 500];

export default function HomeScreen() {
  const { state, addWater } = useApp();
  const theme = useTheme();
  const lang = useLang();
  const insets = useSafeAreaInsets();
  const c = theme.colors;

  const [waterModal, setWaterModal] = useState(false);
  const [customWater, setCustomWater] = useState('');

  const today = getTodayISO();
  const todayActivity = state.activityDays.find((d) => d.date === today);
  const lastSleep = [...state.sleepLogs].sort((a, b) => b.date.localeCompare(a.date))[0];
  const todayHydration = state.hydrationLogs.find((h) => h.date === today) ?? {
    date: today,
    entries: [],
    totalMl: 0,
  };

  const profile = state.profile;
  const steps = todayActivity?.steps ?? 0;
  const stepProgress = Math.min(steps / profile.stepGoal, 1);
  const distance = todayActivity?.distanceKm ?? 0;
  const calories = todayActivity?.caloriesBurned ?? 0;
  const activeMin = todayActivity?.activeMinutes ?? 0;
  const sleepHours = lastSleep?.durationHours ?? 0;
  const wellnessScore = calcWellnessScore(todayActivity, lastSleep, todayHydration, profile);

  // Weekly chart data
  const last7 = getLast7Days();
  const chartData: BarChartDataPoint[] = last7.map((date) => {
    const day = state.activityDays.find((d) => d.date === date);
    return {
      label: getDayLabel(date, lang),
      value: day?.steps ?? 0,
      isToday: date === today,
    };
  });

  const isRTL = lang === 'ar';

  const handleAddWater = async (ml: number) => {
    await addWater(ml);
    setWaterModal(false);
    setCustomWater('');
  };

  const insights_en = [
    "You're making great progress toward your daily step goal. Every step counts!",
    'Staying hydrated improves focus, energy, and overall mood throughout the day.',
    'A consistent sleep schedule is one of the most impactful wellness habits you can build.',
    'Short movement breaks every hour help offset the effects of prolonged sitting.',
  ];
  const insights_ar = [
    'أنت تحرز تقدمًا رائعًا نحو هدفك اليومي للخطوات. كل خطوة تهم!',
    'البقاء رطبًا يحسّن التركيز والطاقة والمزاج طوال اليوم.',
    'جدول نوم منتظم هو أحد أكثر عادات الصحة تأثيرًا.',
    'فترات حركة قصيرة كل ساعة تساعد على تخفيف آثار الجلوس لفترات طويلة.',
  ];
  const insights = lang === 'ar' ? insights_ar : insights_en;
  const insight = insights[new Date().getDay() % insights.length];

  return (
    <View style={[styles.root, { backgroundColor: c.bgMain }]}>
      {/* Header */}
      <LinearGradient
        colors={[c.bgSecondary, c.bgMain]}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={[styles.headerContent, isRTL && styles.rtlRow]}>
          <View style={{ flex: 1 }}>
            <PText variant="sm" secondary>
              {formatDate(today, lang)}
            </PText>
            <PText variant="xl" weight="bold">
              {getGreeting(lang)},{' '}
              <PText variant="xl" weight="bold" color={c.primary}>
                {profile.displayName}
              </PText>
            </PText>
          </View>
          <View style={styles.headerActions}>
            <View style={[styles.avatar, { backgroundColor: c.primary + '30', borderColor: c.primary }]}>
              <PText variant="lg" weight="bold" color={c.primary}>
                {profile.displayName.charAt(0).toUpperCase()}
              </PText>
            </View>
          </View>
        </View>

        {todayActivity?.isDemo && (
          <View style={[styles.demoBadge, { backgroundColor: c.warning + '20', borderColor: c.warning }]}>
            <Ionicons name="information-circle-outline" size={14} color={c.warning} />
            <PText variant="xs" color={c.warning} style={{ marginLeft: 4 }}>
              {t('common_demo_data', lang)}
            </PText>
          </View>
        )}
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section: Progress Ring + Wellness Score */}
        <View style={styles.heroSection}>
          <Card style={styles.heroCard} elevated>
            <View style={styles.heroInner}>
              <ProgressRing
                size={180}
                strokeWidth={14}
                progress={stepProgress}
                colorStart={c.gradientStart}
                colorEnd={c.gradientEnd}
                trackColor={c.border}
              >
                <View style={styles.ringContent}>
                  <PText variant="xxxl" weight="extrabold" color={c.primary}>
                    {formatSteps(steps)}
                  </PText>
                  <PText variant="sm" secondary>
                    {t('home_steps', lang)}
                  </PText>
                  <PText variant="xs" muted>
                    {t('common_of', lang)} {formatSteps(profile.stepGoal)}
                  </PText>
                </View>
              </ProgressRing>

              <View style={styles.heroStats}>
                <HeroStat
                  icon="location-outline"
                  value={distance.toFixed(2)}
                  unit={t('common_km', lang)}
                  label={t('home_distance', lang)}
                  color={c.accent}
                />
                <HeroStat
                  icon="flame-outline"
                  value={calories.toString()}
                  unit={t('common_kcal', lang)}
                  label={t('home_calories', lang)}
                  color={c.warning}
                />
                <HeroStat
                  icon="timer-outline"
                  value={activeMin.toString()}
                  unit={t('common_min', lang)}
                  label={t('home_active_min', lang)}
                  color={c.secondary}
                />
              </View>
            </View>

            {/* Wellness score */}
            <View style={[styles.scoreRow, { borderTopColor: c.border }]}>
              <View>
                <PText variant="sm" secondary>
                  {t('home_wellness_score', lang)}
                </PText>
                <PText variant="sm" weight="semibold" color={c.primary}>
                  {getWellnessLabel(wellnessScore, lang)}
                </PText>
              </View>
              <View style={styles.scoreBarContainer}>
                <View style={[styles.scoreTrack, { backgroundColor: c.border }]}>
                  <View style={[styles.scoreFillTrack, { width: `${wellnessScore}%` }]}>
                    <LinearGradient
                      colors={[c.gradientStart, c.gradientEnd]}
                      style={styles.scoreFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                </View>
                <PText variant="md" weight="bold" color={c.primary}>
                  {wellnessScore}
                </PText>
              </View>
            </View>
          </Card>
        </View>

        {/* Sleep & Hydration Row */}
        <View style={styles.row2}>
          <Card style={styles.halfCard}>
            <View style={[styles.cardHeader, isRTL && styles.rtlRow]}>
              <Ionicons name="moon-outline" size={18} color={c.accentAlt} />
              <PText variant="sm" secondary style={{ marginLeft: 6 }}>
                {t('home_sleep', lang)}
              </PText>
            </View>
            <PText variant="xxl" weight="bold" color={c.accentAlt}>
              {sleepHours.toFixed(1)}
            </PText>
            <PText variant="sm" muted>
              {t('common_hours', lang)} / {profile.sleepGoal} {t('common_goal', lang)}
            </PText>
            <View style={[styles.miniTrack, { backgroundColor: c.border, marginTop: 8 }]}>
              <View style={[styles.miniFillWrapper, { width: `${Math.min((sleepHours / profile.sleepGoal) * 100, 100)}%` }]}>
                <LinearGradient
                  colors={[c.accentAlt, c.accent]}
                  style={styles.miniFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          </Card>

          <Card style={styles.halfCard}>
            <View style={[styles.cardHeader, isRTL && styles.rtlRow]}>
              <Ionicons name="water-outline" size={18} color={c.accent} />
              <PText variant="sm" secondary style={{ marginLeft: 6 }}>
                {t('home_hydration', lang)}
              </PText>
            </View>
            <PText variant="xxl" weight="bold" color={c.accent}>
              {todayHydration.totalMl}
            </PText>
            <PText variant="sm" muted>
              {t('common_ml', lang)} / {profile.hydrationGoal}
            </PText>
            <TouchableOpacity
              style={[styles.addWaterBtn, { backgroundColor: c.accent + '20', borderColor: c.accent }]}
              onPress={() => setWaterModal(true)}
              accessibilityLabel={t('home_add_water', lang)}
            >
              <PText variant="xs" weight="semibold" color={c.accent}>
                {t('home_add_water', lang)}
              </PText>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Weekly Activity Chart */}
        <Card style={styles.sectionCard}>
          <PText variant="lg" weight="semibold" style={{ marginBottom: SPACING.md }}>
            {t('home_weekly_activity', lang)}
          </PText>
          <BarChart
            data={chartData}
            maxValue={profile.stepGoal * 1.2}
            goalLine={profile.stepGoal}
            height={140}
          />
        </Card>

        {/* Daily Insight */}
        <Card style={styles.sectionCard}>
          <View style={[styles.insightHeader, isRTL && styles.rtlRow]}>
            <Ionicons name="bulb-outline" size={20} color={c.warning} />
            <PText variant="lg" weight="semibold" style={{ marginLeft: 8 }}>
              {t('home_insight', lang)}
            </PText>
          </View>
          <PText variant="md" secondary style={{ lineHeight: 22, marginTop: SPACING.sm }}>
            {insight}
          </PText>
        </Card>
      </ScrollView>

      {/* Water Modal */}
      <Modal visible={waterModal} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setWaterModal(false)} />
          <View style={[styles.modalSheet, { backgroundColor: c.bgCard, borderColor: c.border }]}>
            <PText variant="lg" weight="bold" style={{ marginBottom: SPACING.lg }}>
              {t('home_add_water', lang)}
            </PText>
            <View style={styles.waterGrid}>
              {WATER_OPTIONS.map((ml) => (
                <TouchableOpacity
                  key={ml}
                  style={[styles.waterOption, { backgroundColor: c.bgCardElevated, borderColor: c.border }]}
                  onPress={() => handleAddWater(ml)}
                >
                  <PText variant="lg" weight="bold" color={c.accent}>
                    {ml}
                  </PText>
                  <PText variant="xs" muted>
                    ml
                  </PText>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[styles.customRow, { borderTopColor: c.border }]}>
              <TextInput
                style={[styles.customInput, { backgroundColor: c.bgCardElevated, color: c.textPrimary, borderColor: c.border }]}
                placeholder={lang === 'ar' ? 'كمية مخصصة (مل)' : 'Custom amount (ml)'}
                placeholderTextColor={c.textMuted}
                keyboardType="numeric"
                value={customWater}
                onChangeText={setCustomWater}
              />
              <TouchableOpacity
                style={[styles.customAddBtn, { backgroundColor: c.primary }]}
                onPress={() => {
                  const ml = parseInt(customWater, 10);
                  if (ml > 0) handleAddWater(ml);
                }}
              >
                <PText variant="md" weight="bold" color={c.bgMain}>
                  {t('common_ok', lang)}
                </PText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function HeroStat({
  icon,
  value,
  unit,
  label,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  unit: string;
  label: string;
  color: string;
}) {
  return (
    <View style={heroStatStyles.container}>
      <Ionicons name={icon} size={16} color={color} />
      <PText variant="lg" weight="bold" color={color} style={{ marginTop: 4 }}>
        {value}
      </PText>
      <PText variant="xs" muted>
        {unit}
      </PText>
      <PText variant="xs" secondary>
        {label}
      </PText>
    </View>
  );
}

const heroStatStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rtlRow: { flexDirection: 'row-reverse' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  scroll: { flex: 1 },
  heroSection: { padding: SPACING.lg },
  heroCard: { padding: SPACING.lg },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ringContent: { alignItems: 'center' },
  heroStats: {
    flex: 1,
    paddingLeft: SPACING.lg,
    gap: SPACING.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
  },
  scoreBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },
  scoreTrack: {
    height: 8,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    flex: 1,
    maxWidth: 100,
  },
  scoreFillTrack: { height: '100%', borderRadius: RADIUS.full, overflow: 'hidden' },
  scoreFill: { height: '100%', width: '100%', borderRadius: RADIUS.full },
  row2: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  halfCard: { flex: 1, padding: SPACING.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  miniTrack: { height: 6, borderRadius: RADIUS.full, overflow: 'hidden' },
  miniFillWrapper: { height: '100%', overflow: 'hidden', borderRadius: RADIUS.full },
  miniFill: { height: '100%', width: '100%', borderRadius: RADIUS.full },
  addWaterBtn: {
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  sectionCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
  insightHeader: { flexDirection: 'row', alignItems: 'center' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.xl,
  },
  waterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  waterOption: {
    flex: 1,
    minWidth: '40%',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  customRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    borderTopWidth: 1,
    paddingTop: SPACING.lg,
  },
  customInput: {
    flex: 1,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  customAddBtn: {
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
