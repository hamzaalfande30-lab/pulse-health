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
import { getLast7Days, getDayLabel, getTodayISO, calcSleepDuration, formatShortDate } from '../../src/utils/date';

type Quality = 'poor' | 'fair' | 'good' | 'excellent';

const QUALITY_OPTIONS: Quality[] = ['poor', 'fair', 'good', 'excellent'];

export default function SleepScreen() {
  const { state, addSleepLog, updateProfile } = useApp();
  const theme = useTheme();
  const lang = useLang();
  const insets = useSafeAreaInsets();
  const c = theme.colors;
  const isRTL = lang === 'ar';

  const [showLogModal, setShowLogModal] = useState(false);
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState<Quality>('good');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState(state.profile.sleepGoal.toString());

  const sortedLogs = [...state.sleepLogs].sort((a, b) => b.date.localeCompare(a.date));
  const lastSleep = sortedLogs[0];
  const profile = state.profile;

  const last7 = getLast7Days();
  const chartData: BarChartDataPoint[] = last7.map((date) => {
    const log = state.sleepLogs.find((s) => s.date === date);
    return {
      label: getDayLabel(date, lang),
      value: log?.durationHours ?? 0,
      isToday: date === getTodayISO(),
    };
  });

  const avgSleep = sortedLogs.slice(0, 7).length > 0
    ? sortedLogs.slice(0, 7).reduce((s, l) => s + l.durationHours, 0) / sortedLogs.slice(0, 7).length
    : 0;

  const sleepColorByQuality: Record<Quality, string> = {
    poor: c.error,
    fair: c.warning,
    good: c.secondary,
    excellent: c.primary,
  };

  const handleSaveLog = async () => {
    const dur = calcSleepDuration(bedtime, wakeTime);
    if (dur <= 0 || dur > 24) {
      Alert.alert('', lang === 'ar' ? 'وقت غير صالح' : 'Invalid time range');
      return;
    }
    await addSleepLog({
      date: getTodayISO(),
      bedtime,
      wakeTime,
      durationHours: Math.round(dur * 10) / 10,
      quality,
      isDemo: false,
    });
    setShowLogModal(false);
  };

  const handleSaveGoal = async () => {
    const g = parseFloat(goalInput);
    if (isNaN(g) || g < 4 || g > 12) {
      Alert.alert('', lang === 'ar' ? 'الهدف بين 4 و12 ساعة' : 'Goal must be between 4 and 12 hours');
      return;
    }
    await updateProfile({ sleepGoal: g });
    setShowGoalModal(false);
  };

  return (
    <View style={[styles.root, { backgroundColor: c.bgMain }]}>
      <LinearGradient
        colors={[c.bgSecondary, c.bgMain]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={[styles.headerRow, isRTL && styles.rtlRow]}>
          <PText variant="xxl" weight="bold">
            {t('sleep_title', lang)}
          </PText>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: c.accentAlt, borderRadius: RADIUS.md }]}
            onPress={() => setShowLogModal(true)}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <PText variant="sm" weight="bold" color="#fff" style={{ marginLeft: 4 }}>
              {t('sleep_add', lang)}
            </PText>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingTop: SPACING.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Last Sleep Hero */}
        <Card style={styles.heroCard} elevated>
          <View style={[styles.heroRow, isRTL && styles.rtlRow]}>
            <View style={{ flex: 1 }}>
              <PText variant="sm" secondary>
                {lang === 'ar' ? 'آخر نوم' : 'Last Night'}
              </PText>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                <PText variant="huge" weight="extrabold" color={c.accentAlt}>
                  {lastSleep?.durationHours.toFixed(1) ?? '—'}
                </PText>
                <PText variant="lg" secondary>
                  {t('common_hours', lang)}
                </PText>
              </View>
              {lastSleep && (
                <PText variant="sm" secondary>
                  {lastSleep.bedtime} → {lastSleep.wakeTime}
                </PText>
              )}
            </View>
            <View style={[styles.sleepCircle, { backgroundColor: c.accentAlt + '20', borderColor: c.accentAlt + '50' }]}>
              <Ionicons name="moon" size={32} color={c.accentAlt} />
            </View>
          </View>

          {lastSleep && (
            <View style={[styles.qualityBadge, { backgroundColor: sleepColorByQuality[lastSleep.quality ?? 'good'] + '20', borderColor: sleepColorByQuality[lastSleep.quality ?? 'good'] }]}>
              <PText variant="sm" color={sleepColorByQuality[lastSleep.quality ?? 'good']} weight="semibold">
                {t(`sleep_${lastSleep.quality ?? 'good'}` as any, lang)}
              </PText>
            </View>
          )}

          {/* Goal */}
          <View style={[styles.goalRow, { borderTopColor: c.border, marginTop: SPACING.md }]}>
            <View>
              <PText variant="xs" muted>
                {t('sleep_goal', lang)}
              </PText>
              <PText variant="md" weight="semibold">
                {profile.sleepGoal} {t('common_hours', lang)}
              </PText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <PText variant="xs" muted>
                {t('sleep_avg', lang)}
              </PText>
              <PText variant="md" weight="semibold" color={c.secondary}>
                {avgSleep.toFixed(1)} {t('common_hours', lang)}
              </PText>
            </View>
            <TouchableOpacity
              style={[styles.editBtn, { borderColor: c.accentAlt }]}
              onPress={() => { setGoalInput(profile.sleepGoal.toString()); setShowGoalModal(true); }}
            >
              <Ionicons name="pencil-outline" size={14} color={c.accentAlt} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Weekly Chart */}
        <Card style={styles.sectionCard}>
          <PText variant="lg" weight="semibold" style={{ marginBottom: SPACING.md }}>
            {t('sleep_weekly_trend', lang)}
          </PText>
          <BarChart
            data={chartData}
            maxValue={12}
            goalLine={profile.sleepGoal}
            height={140}
          />
        </Card>

        {/* Sleep Log */}
        <Card style={styles.sectionCard}>
          <PText variant="lg" weight="semibold" style={{ marginBottom: SPACING.md }}>
            {t('sleep_log', lang)}
          </PText>
          {sortedLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="moon-outline" size={36} color={c.textMuted} />
              <PText variant="sm" muted style={{ marginTop: SPACING.sm, textAlign: 'center' }}>
                {t('common_empty', lang)}
              </PText>
            </View>
          ) : (
            sortedLogs.slice(0, 7).map((log) => (
              <View key={log.id} style={[styles.logItem, { borderBottomColor: c.border }]}>
                <View style={[styles.logIcon, { backgroundColor: sleepColorByQuality[log.quality ?? 'good'] + '20' }]}>
                  <Ionicons name="moon-outline" size={16} color={sleepColorByQuality[log.quality ?? 'good']} />
                </View>
                <View style={{ flex: 1 }}>
                  <PText variant="md" weight="semibold">
                    {formatShortDate(log.date, lang)}
                    {log.isDemo ? (
                      <PText variant="xs" muted> ({t('home_demo_label', lang)})</PText>
                    ) : null}
                  </PText>
                  <PText variant="sm" secondary>
                    {log.bedtime} → {log.wakeTime} · {log.durationHours.toFixed(1)} {t('common_hours', lang)}
                  </PText>
                </View>
                <View style={[styles.qualityDot, { backgroundColor: sleepColorByQuality[log.quality ?? 'good'] }]} />
              </View>
            ))
          )}
        </Card>
      </ScrollView>

      {/* Log Sleep Modal */}
      <Modal visible={showLogModal} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowLogModal(false)} />
          <View style={[styles.modalSheet, { backgroundColor: c.bgCard, borderColor: c.border }]}>
            <PText variant="lg" weight="bold" style={{ marginBottom: SPACING.lg }}>
              {t('sleep_add', lang)}
            </PText>

            <View style={{ flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md }}>
              <View style={{ flex: 1 }}>
                <PText variant="sm" secondary style={{ marginBottom: 4 }}>
                  {t('sleep_bedtime', lang)} (HH:MM)
                </PText>
                <TextInput
                  style={[styles.input, { backgroundColor: c.bgCardElevated, color: c.textPrimary, borderColor: c.border }]}
                  value={bedtime}
                  onChangeText={setBedtime}
                  placeholder="23:00"
                  placeholderTextColor={c.textMuted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <PText variant="sm" secondary style={{ marginBottom: 4 }}>
                  {t('sleep_wake', lang)} (HH:MM)
                </PText>
                <TextInput
                  style={[styles.input, { backgroundColor: c.bgCardElevated, color: c.textPrimary, borderColor: c.border }]}
                  value={wakeTime}
                  onChangeText={setWakeTime}
                  placeholder="07:00"
                  placeholderTextColor={c.textMuted}
                />
              </View>
            </View>

            <PText variant="sm" secondary style={{ marginBottom: 8 }}>
              {t('sleep_quality', lang)}
            </PText>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: SPACING.lg }}>
              {QUALITY_OPTIONS.map((q) => (
                <TouchableOpacity
                  key={q}
                  style={[
                    styles.qualityChip,
                    {
                      backgroundColor: quality === q ? sleepColorByQuality[q] : c.bgCardElevated,
                      borderColor: quality === q ? sleepColorByQuality[q] : c.border,
                    },
                  ]}
                  onPress={() => setQuality(q)}
                >
                  <PText
                    variant="xs"
                    color={quality === q ? '#fff' : c.textSecondary}
                    weight={quality === q ? 'bold' : 'regular'}
                  >
                    {t(`sleep_${q}` as any, lang)}
                  </PText>
                </TouchableOpacity>
              ))}
            </View>

            {/* Duration preview */}
            <View style={[styles.durationPreview, { backgroundColor: c.bgCardElevated, borderColor: c.border }]}>
              <Ionicons name="time-outline" size={16} color={c.accentAlt} />
              <PText variant="md" color={c.accentAlt} style={{ marginLeft: 8 }}>
                {calcSleepDuration(bedtime, wakeTime).toFixed(1)} {t('common_hours', lang)}
              </PText>
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: c.accentAlt }]}
              onPress={handleSaveLog}
            >
              <PText variant="md" weight="bold" color="#fff">
                {t('common_save', lang)}
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
              {t('sleep_goal', lang)}
            </PText>
            <TextInput
              style={[styles.input, { backgroundColor: c.bgCardElevated, color: c.textPrimary, borderColor: c.border, textAlign: 'center' }]}
              value={goalInput}
              onChangeText={setGoalInput}
              keyboardType="decimal-pad"
            />
            <View style={{ flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg }}>
              <TouchableOpacity onPress={() => setShowGoalModal(false)} style={[styles.alertBtn, { borderColor: c.border }]}>
                <PText variant="sm">{t('common_cancel', lang)}</PText>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveGoal} style={[styles.alertBtn, { backgroundColor: c.accentAlt }]}>
                <PText variant="sm" weight="bold" color="#fff">{t('common_save', lang)}</PText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rtlRow: { flexDirection: 'row-reverse' },
  addBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  heroCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md, padding: SPACING.lg },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  sleepCircle: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  qualityBadge: { borderWidth: 1, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start', marginTop: SPACING.md },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: SPACING.md },
  editBtn: { borderWidth: 1, borderRadius: RADIUS.sm, padding: 6 },
  sectionCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xl },
  logItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1 },
  logIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  qualityDot: { width: 10, height: 10, borderRadius: 5 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: { borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, borderWidth: 1, padding: SPACING.xl },
  input: { borderRadius: RADIUS.md, borderWidth: 1, paddingHorizontal: SPACING.md, paddingVertical: 10, fontSize: FONT_SIZE.md },
  qualityChip: { flex: 1, borderWidth: 1, borderRadius: RADIUS.sm, paddingVertical: 8, alignItems: 'center' },
  durationPreview: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  saveBtn: { borderRadius: RADIUS.md, paddingVertical: 14, alignItems: 'center' },
  alertBox: { borderRadius: RADIUS.lg, borderWidth: 1, margin: SPACING.xl, padding: SPACING.xl },
  alertBtn: { flex: 1, borderWidth: 1, borderRadius: RADIUS.md, paddingVertical: 12, alignItems: 'center' },
});
