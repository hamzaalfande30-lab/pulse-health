import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, useTheme, useLang } from '../../src/context/AppContext';
import { PText } from '../../src/components/common/Text';
import { Card } from '../../src/components/cards/Card';
import { BarChart, BarChartDataPoint } from '../../src/components/charts/BarChart';
import { t } from '../../src/constants/translations';
import { SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';
import { getLast7Days, getDayLabel, getTodayISO, formatShortDate } from '../../src/utils/date';
import { formatSteps } from '../../src/utils/health';

type Period = 'day' | 'week' | 'month';

const ACTIVITY_TYPES = [
  'Walking', 'Running', 'Cycling', 'Swimming', 'Gym', 'Yoga', 'Football', 'Basketball', 'Other'
];
const ACTIVITY_TYPES_AR = [
  'مشي', 'ركض', 'دراجة', 'سباحة', 'جيم', 'يوغا', 'كرة قدم', 'كرة سلة', 'أخرى'
];

export default function ActivityScreen() {
  const { state, addWorkout, updateProfile } = useApp();
  const theme = useTheme();
  const lang = useLang();
  const insets = useSafeAreaInsets();
  const c = theme.colors;
  const isRTL = lang === 'ar';

  const [period, setPeriod] = useState<Period>('week');
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState(state.profile.stepGoal.toString());

  // Form state
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [workoutCalories, setWorkoutCalories] = useState('');

  const today = getTodayISO();
  const todayActivity = state.activityDays.find((d) => d.date === today);
  const profile = state.profile;

  const last7 = getLast7Days();
  const chartData: BarChartDataPoint[] = last7.map((date) => {
    const day = state.activityDays.find((d) => d.date === date);
    return {
      label: getDayLabel(date, lang),
      value: day?.steps ?? 0,
      isToday: date === today,
    };
  });

  const weeklySteps = state.activityDays
    .filter((d) => last7.includes(d.date))
    .reduce((s, d) => s + d.steps, 0);
  const weeklyCalories = state.activityDays
    .filter((d) => last7.includes(d.date))
    .reduce((s, d) => s + d.caloriesBurned, 0);

  const handleSaveWorkout = async () => {
    if (!activityType.trim() || !duration.trim()) {
      Alert.alert(lang === 'ar' ? 'خطأ' : 'Error', lang === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields');
      return;
    }
    const dur = parseInt(duration, 10);
    if (isNaN(dur) || dur <= 0) {
      Alert.alert(lang === 'ar' ? 'خطأ' : 'Error', lang === 'ar' ? 'مدة غير صالحة' : 'Invalid duration');
      return;
    }
    await addWorkout({
      date: today,
      activityType: activityType.trim(),
      durationMinutes: dur,
      distanceKm: distance ? parseFloat(distance) : undefined,
      caloriesBurned: workoutCalories ? parseInt(workoutCalories, 10) : undefined,
    });
    setActivityType('');
    setDuration('');
    setDistance('');
    setWorkoutCalories('');
    setShowWorkoutModal(false);
  };

  const handleSaveGoal = async () => {
    const g = parseInt(goalInput, 10);
    if (isNaN(g) || g < 1000) {
      Alert.alert('', lang === 'ar' ? 'الهدف الأدنى 1000 خطوة' : 'Minimum goal is 1,000 steps');
      return;
    }
    await updateProfile({ stepGoal: g });
    setShowGoalModal(false);
  };

  const activityTypesList = lang === 'ar' ? ACTIVITY_TYPES_AR : ACTIVITY_TYPES;

  return (
    <View style={[styles.root, { backgroundColor: c.bgMain }]}>
      {/* Header */}
      <LinearGradient
        colors={[c.bgSecondary, c.bgMain]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={[styles.headerRow, isRTL && styles.rtlRow]}>
          <PText variant="xxl" weight="bold">
            {t('activity_title', lang)}
          </PText>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: c.primary, borderRadius: RADIUS.md }]}
            onPress={() => setShowWorkoutModal(true)}
            accessibilityLabel={t('activity_log_workout', lang)}
          >
            <Ionicons name="add" size={20} color={c.bgMain} />
            <PText variant="sm" weight="bold" color={c.bgMain} style={{ marginLeft: 4 }}>
              {t('activity_log_workout', lang)}
            </PText>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingTop: SPACING.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <View style={[styles.periodRow, { backgroundColor: c.bgCard }]}>
          {(['day', 'week', 'month'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.periodBtn,
                period === p && { backgroundColor: c.primary + '20' },
              ]}
              onPress={() => setPeriod(p)}
            >
              <PText
                variant="sm"
                weight={period === p ? 'semibold' : 'regular'}
                color={period === p ? c.primary : c.textMuted}
              >
                {t(`activity_${p === 'day' ? 'daily' : p === 'week' ? 'weekly' : 'monthly'}` as any, lang)}
              </PText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="footsteps-outline"
            value={formatSteps(todayActivity?.steps ?? 0)}
            label={t('home_steps', lang)}
            color={c.primary}
          />
          <StatCard
            icon="location-outline"
            value={(todayActivity?.distanceKm ?? 0).toFixed(2)}
            label={t('home_distance', lang)}
            color={c.accent}
          />
          <StatCard
            icon="flame-outline"
            value={(todayActivity?.caloriesBurned ?? 0).toString()}
            label={t('home_calories', lang)}
            color={c.warning}
          />
          <StatCard
            icon="timer-outline"
            value={(todayActivity?.activeMinutes ?? 0).toString()}
            label={t('home_active_min', lang)}
            color={c.secondary}
          />
        </View>

        {/* Goal Card */}
        <Card style={styles.sectionCard}>
          <View style={[styles.goalRow, isRTL && styles.rtlRow]}>
            <View>
              <PText variant="sm" secondary>
                {t('activity_goal', lang)}
              </PText>
              <PText variant="xl" weight="bold" color={c.primary}>
                {profile.stepGoal.toLocaleString()} {t('common_steps', lang)}
              </PText>
            </View>
            <TouchableOpacity
              style={[styles.editBtn, { borderColor: c.primary, backgroundColor: c.primary + '15' }]}
              onPress={() => {
                setGoalInput(profile.stepGoal.toString());
                setShowGoalModal(true);
              }}
            >
              <Ionicons name="pencil-outline" size={14} color={c.primary} />
              <PText variant="xs" color={c.primary} style={{ marginLeft: 4 }}>
                {t('activity_edit_goal', lang)}
              </PText>
            </TouchableOpacity>
          </View>
          {/* Progress bar */}
          <View style={[styles.goalTrack, { backgroundColor: c.border, marginTop: SPACING.md }]}>
            <View style={[styles.goalFillWrapper, { width: `${Math.min(((todayActivity?.steps ?? 0) / profile.stepGoal) * 100, 100)}%` }]}>
              <LinearGradient
                colors={[c.gradientStart, c.gradientEnd]}
                style={styles.goalFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>
          <View style={[styles.goalFooter, isRTL && styles.rtlRow]}>
            <PText variant="xs" muted>
              {t('common_today', lang)}: {(todayActivity?.steps ?? 0).toLocaleString()}
            </PText>
            <PText variant="xs" muted>
              {Math.round(((todayActivity?.steps ?? 0) / profile.stepGoal) * 100)}%
            </PText>
          </View>
        </Card>

        {/* Weekly Chart */}
        <Card style={styles.sectionCard}>
          <PText variant="lg" weight="semibold" style={{ marginBottom: SPACING.md }}>
            {t('home_weekly_activity', lang)}
          </PText>
          <BarChart data={chartData} maxValue={profile.stepGoal * 1.2} goalLine={profile.stepGoal} height={150} />
          <View style={[styles.weeklyTotals, { borderTopColor: c.border }]}>
            <View style={{ alignItems: 'center' }}>
              <PText variant="lg" weight="bold" color={c.primary}>
                {formatSteps(weeklySteps)}
              </PText>
              <PText variant="xs" muted>
                {lang === 'ar' ? 'خطوات أسبوعية' : 'Weekly steps'}
              </PText>
            </View>
            <View style={{ alignItems: 'center' }}>
              <PText variant="lg" weight="bold" color={c.warning}>
                {weeklyCalories}
              </PText>
              <PText variant="xs" muted>
                {t('common_kcal', lang)}
              </PText>
            </View>
          </View>
        </Card>

        {/* Workout History */}
        <Card style={styles.sectionCard}>
          <PText variant="lg" weight="semibold" style={{ marginBottom: SPACING.md }}>
            {t('activity_history', lang)}
          </PText>
          {state.workouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="barbell-outline" size={36} color={c.textMuted} />
              <PText variant="sm" muted style={{ marginTop: SPACING.sm, textAlign: 'center' }}>
                {t('common_empty', lang)}
              </PText>
            </View>
          ) : (
            state.workouts.slice(0, 10).map((w) => (
              <View key={w.id} style={[styles.workoutItem, { borderBottomColor: c.border }]}>
                <View style={[styles.workoutIcon, { backgroundColor: c.primary + '20' }]}>
                  <Ionicons name="barbell-outline" size={18} color={c.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <PText variant="md" weight="semibold">
                    {w.activityType}
                  </PText>
                  <PText variant="sm" secondary>
                    {formatShortDate(w.date, lang)} · {w.durationMinutes} {t('common_min', lang)}
                    {w.caloriesBurned ? ` · ${w.caloriesBurned} ${t('common_kcal', lang)}` : ''}
                  </PText>
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>

      {/* Add Workout Modal */}
      <Modal visible={showWorkoutModal} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowWorkoutModal(false)} />
          <View style={[styles.modalSheet, { backgroundColor: c.bgCard, borderColor: c.border }]}>
            <PText variant="lg" weight="bold" style={{ marginBottom: SPACING.lg }}>
              {t('activity_log_workout', lang)}
            </PText>

            <PText variant="sm" secondary style={{ marginBottom: 4 }}>
              {t('activity_type', lang)} *
            </PText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
              {activityTypesList.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: activityType === type ? c.primary : c.bgCardElevated,
                      borderColor: activityType === type ? c.primary : c.border,
                    },
                  ]}
                  onPress={() => setActivityType(type)}
                >
                  <PText
                    variant="sm"
                    color={activityType === type ? c.bgMain : c.textPrimary}
                    weight={activityType === type ? 'bold' : 'regular'}
                  >
                    {type}
                  </PText>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <FormInput label={t('activity_duration', lang) + ' *'} value={duration} onChange={setDuration} keyboardType="numeric" placeholder="30" />
            <FormInput label={t('activity_distance_opt', lang)} value={distance} onChange={setDistance} keyboardType="decimal-pad" placeholder="5.0" />
            <FormInput label={t('activity_calories_opt', lang)} value={workoutCalories} onChange={setWorkoutCalories} keyboardType="numeric" placeholder="200" />

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: c.primary }]}
              onPress={handleSaveWorkout}
            >
              <PText variant="md" weight="bold" color={c.bgMain}>
                {t('activity_save', lang)}
              </PText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Goal Modal */}
      <Modal visible={showGoalModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowGoalModal(false)} />
          <View style={[styles.alertBox, { backgroundColor: c.bgCard, borderColor: c.border }]}>
            <PText variant="lg" weight="bold" style={{ marginBottom: SPACING.lg }}>
              {t('activity_edit_goal', lang)}
            </PText>
            <TextInput
              style={[styles.goalInput, { backgroundColor: c.bgCardElevated, color: c.textPrimary, borderColor: c.border }]}
              value={goalInput}
              onChangeText={setGoalInput}
              keyboardType="numeric"
            />
            <View style={styles.alertBtns}>
              <TouchableOpacity onPress={() => setShowGoalModal(false)} style={[styles.alertBtn, { borderColor: c.border }]}>
                <PText variant="sm">{t('common_cancel', lang)}</PText>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveGoal} style={[styles.alertBtn, { backgroundColor: c.primary }]}>
                <PText variant="sm" weight="bold" color={c.bgMain}>{t('common_save', lang)}</PText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function StatCard({ icon, value, label, color }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string; color: string }) {
  const theme = useTheme();
  const c = theme.colors;
  return (
    <Card style={statStyles.card}>
      <View style={[statStyles.iconWrap, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <PText variant="xl" weight="bold" color={color} style={{ marginTop: 8 }}>
        {value}
      </PText>
      <PText variant="xs" secondary>
        {label}
      </PText>
    </Card>
  );
}

const statStyles = StyleSheet.create({
  card: { flex: 1, margin: 4, alignItems: 'center', padding: SPACING.md },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});

function FormInput({ label, value, onChange, keyboardType, placeholder }: any) {
  const theme = useTheme();
  const c = theme.colors;
  return (
    <View style={{ marginBottom: SPACING.md }}>
      <PText variant="sm" secondary style={{ marginBottom: 4 }}>
        {label}
      </PText>
      <TextInput
        style={[styles.input, { backgroundColor: c.bgCardElevated, color: c.textPrimary, borderColor: c.border }]}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={c.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rtlRow: { flexDirection: 'row-reverse' },
  addBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  periodRow: { flexDirection: 'row', marginHorizontal: SPACING.lg, borderRadius: RADIUS.md, padding: 4, marginBottom: SPACING.md },
  periodBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: RADIUS.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: SPACING.md, marginBottom: SPACING.sm },
  sectionCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 6 },
  goalTrack: { height: 8, borderRadius: RADIUS.full, overflow: 'hidden' },
  goalFillWrapper: { height: '100%', overflow: 'hidden', borderRadius: RADIUS.full },
  goalFill: { height: '100%', width: '100%', borderRadius: RADIUS.full },
  goalFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  weeklyTotals: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, paddingTop: SPACING.md, marginTop: SPACING.md },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xl },
  workoutItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1 },
  workoutIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: { borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, borderWidth: 1, padding: SPACING.xl },
  typeChip: { borderRadius: RADIUS.full, borderWidth: 1, paddingHorizontal: SPACING.md, paddingVertical: 8, marginRight: 8 },
  input: { borderRadius: RADIUS.md, borderWidth: 1, paddingHorizontal: SPACING.md, paddingVertical: 10, fontSize: FONT_SIZE.md },
  saveBtn: { borderRadius: RADIUS.md, paddingVertical: 14, alignItems: 'center', marginTop: SPACING.sm },
  alertBox: { borderRadius: RADIUS.lg, borderWidth: 1, margin: SPACING.xl, padding: SPACING.xl },
  goalInput: { borderRadius: RADIUS.md, borderWidth: 1, paddingHorizontal: SPACING.md, paddingVertical: 10, fontSize: FONT_SIZE.xl, textAlign: 'center', marginBottom: SPACING.lg },
  alertBtns: { flexDirection: 'row', gap: SPACING.md },
  alertBtn: { flex: 1, borderWidth: 1, borderRadius: RADIUS.md, paddingVertical: 12, alignItems: 'center' },
});
