import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, useTheme, useLang } from '../../src/context/AppContext';
import { PText } from '../../src/components/common/Text';
import { Card } from '../../src/components/cards/Card';
import { THEMES, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';
import { t } from '../../src/constants/translations';
import { ThemeName, Language } from '../../src/types';

const APP_VERSION = '1.0.0';

export default function ProfileScreen() {
  const { state, updateProfile, resetAllData } = useApp();
  const theme = useTheme();
  const lang = useLang();
  const insets = useSafeAreaInsets();
  const c = theme.colors;
  const profile = state.profile;
  const isRTL = lang === 'ar';

  const [name, setName] = useState(profile.displayName);
  const [stepGoal, setStepGoal] = useState(profile.stepGoal.toString());
  const [sleepGoal, setSleepGoal] = useState(profile.sleepGoal.toString());
  const [hydGoal, setHydGoal] = useState(profile.hydrationGoal.toString());
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSave = async () => {
    const sg = parseInt(stepGoal, 10);
    const slg = parseFloat(sleepGoal);
    const hg = parseInt(hydGoal, 10);

    if (!name.trim()) {
      Alert.alert('', lang === 'ar' ? 'الاسم مطلوب' : 'Name is required');
      return;
    }
    if (isNaN(sg) || sg < 1000) {
      Alert.alert('', lang === 'ar' ? 'هدف الخطوات على الأقل 1000' : 'Step goal must be at least 1,000');
      return;
    }
    await updateProfile({
      displayName: name.trim(),
      stepGoal: sg,
      sleepGoal: isNaN(slg) ? profile.sleepGoal : slg,
      hydrationGoal: isNaN(hg) ? profile.hydrationGoal : hg,
    });
    Alert.alert('', lang === 'ar' ? 'تم الحفظ' : 'Saved!');
  };

  const handleReset = async () => {
    setShowResetModal(false);
    await resetAllData();
    Alert.alert('', lang === 'ar' ? 'تم إعادة تعيين البيانات' : 'All data has been reset');
  };

  return (
    <View style={[styles.root, { backgroundColor: c.bgMain }]}>
      <LinearGradient
        colors={[c.bgSecondary, c.bgMain]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={[styles.headerRow, isRTL && styles.rtlRow]}>
          <PText variant="xxl" weight="bold">
            {t('profile_title', lang)}
          </PText>
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: c.primary }]}
            onPress={handleSave}
          >
            <PText variant="sm" weight="bold" color={c.bgMain}>
              {t('profile_save', lang)}
            </PText>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingTop: SPACING.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <LinearGradient colors={[c.gradientStart, c.gradientEnd]} style={styles.avatarCircle}>
            <PText variant="xxxl" weight="extrabold" color={c.bgMain}>
              {name.charAt(0).toUpperCase() || '?'}
            </PText>
          </LinearGradient>
        </View>

        {/* Personal Info */}
        <SectionHeader title={lang === 'ar' ? 'المعلومات الشخصية' : 'Personal Info'} />
        <Card style={styles.sectionCard}>
          <FormField label={t('profile_name', lang)}>
            <TextInput
              style={[styles.input, { backgroundColor: c.bgCardElevated, color: c.textPrimary, borderColor: c.border, textAlign: isRTL ? 'right' : 'left' }]}
              value={name}
              onChangeText={setName}
              placeholderTextColor={c.textMuted}
            />
          </FormField>
        </Card>

        {/* Goals */}
        <SectionHeader title={lang === 'ar' ? 'الأهداف اليومية' : 'Daily Goals'} />
        <Card style={styles.sectionCard}>
          <FormField label={t('profile_step_goal', lang)}>
            <TextInput
              style={[styles.input, { backgroundColor: c.bgCardElevated, color: c.textPrimary, borderColor: c.border, textAlign: isRTL ? 'right' : 'left' }]}
              value={stepGoal}
              onChangeText={setStepGoal}
              keyboardType="numeric"
              placeholderTextColor={c.textMuted}
            />
          </FormField>
          <FormField label={t('profile_sleep_goal', lang)} divider>
            <TextInput
              style={[styles.input, { backgroundColor: c.bgCardElevated, color: c.textPrimary, borderColor: c.border, textAlign: isRTL ? 'right' : 'left' }]}
              value={sleepGoal}
              onChangeText={setSleepGoal}
              keyboardType="decimal-pad"
              placeholderTextColor={c.textMuted}
            />
          </FormField>
          <FormField label={t('profile_hydration_goal', lang)} divider>
            <TextInput
              style={[styles.input, { backgroundColor: c.bgCardElevated, color: c.textPrimary, borderColor: c.border, textAlign: isRTL ? 'right' : 'left' }]}
              value={hydGoal}
              onChangeText={setHydGoal}
              keyboardType="numeric"
              placeholderTextColor={c.textMuted}
            />
          </FormField>
        </Card>

        {/* Language */}
        <SectionHeader title={t('profile_language', lang)} />
        <Card style={styles.sectionCard}>
          <View style={{ flexDirection: 'row', gap: SPACING.md }}>
            {(['en', 'ar'] as Language[]).map((l) => (
              <TouchableOpacity
                key={l}
                style={[
                  styles.langOption,
                  {
                    backgroundColor: profile.language === l ? c.primary + '20' : c.bgCardElevated,
                    borderColor: profile.language === l ? c.primary : c.border,
                    flex: 1,
                  },
                ]}
                onPress={() => updateProfile({ language: l })}
              >
                <PText variant="md" weight={profile.language === l ? 'bold' : 'regular'} color={profile.language === l ? c.primary : c.textPrimary}>
                  {l === 'en' ? '🇺🇸 English' : '🇸🇦 العربية'}
                </PText>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Theme */}
        <SectionHeader title={t('profile_theme', lang)} />
        <Card style={styles.sectionCard}>
          {(Object.keys(THEMES) as ThemeName[]).map((tn) => {
            const th = THEMES[tn];
            const isSelected = profile.theme === tn;
            return (
              <TouchableOpacity
                key={tn}
                style={[
                  styles.themeRow,
                  { borderBottomColor: c.border },
                ]}
                onPress={() => updateProfile({ theme: tn })}
              >
                <View style={[styles.themePreview, { backgroundColor: th.colors.bgCard, borderColor: th.colors.border }]}>
                  <View style={[styles.themeAccent, { backgroundColor: th.colors.primary }]} />
                  <View style={[styles.themeAccent2, { backgroundColor: th.colors.secondary }]} />
                </View>
                <PText variant="md" style={{ flex: 1, marginLeft: SPACING.md }} weight={isSelected ? 'semibold' : 'regular'}>
                  {th.label}
                </PText>
                {isSelected && (
                  <View style={[styles.checkIcon, { backgroundColor: c.primary }]}>
                    <Ionicons name="checkmark" size={14} color={c.bgMain} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </Card>

        {/* Notifications */}
        <SectionHeader title={lang === 'ar' ? 'الإعدادات' : 'Settings'} />
        <Card style={styles.sectionCard}>
          <View style={[styles.switchRow, isRTL && styles.rtlRow]}>
            <PText variant="md">{t('profile_notifications', lang)}</PText>
            <Switch
              value={profile.notificationsEnabled}
              onValueChange={(v) => updateProfile({ notificationsEnabled: v })}
              trackColor={{ false: c.border, true: c.primary + '60' }}
              thumbColor={profile.notificationsEnabled ? c.primary : c.textMuted}
            />
          </View>
        </Card>

        {/* Danger Zone */}
        <SectionHeader title={lang === 'ar' ? 'منطقة الخطر' : 'Danger Zone'} />
        <Card style={[styles.sectionCard, { borderColor: c.error + '40' }]}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => setShowResetModal(true)}
          >
            <Ionicons name="trash-outline" size={18} color={c.error} />
            <PText variant="md" color={c.error} style={{ marginLeft: SPACING.sm }}>
              {t('profile_reset_data', lang)}
            </PText>
          </TouchableOpacity>
        </Card>

        {/* Version */}
        <View style={styles.versionRow}>
          <PText variant="xs" muted style={{ textAlign: 'center' }}>
            Pulse Health v{APP_VERSION} · Expo SDK 54
          </PText>
        </View>
      </ScrollView>

      {/* Reset Confirm Modal */}
      <Modal visible={showResetModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.alertBox, { backgroundColor: c.bgCard, borderColor: c.error + '40' }]}>
            <Ionicons name="warning-outline" size={36} color={c.error} style={{ alignSelf: 'center', marginBottom: SPACING.md }} />
            <PText variant="lg" weight="bold" style={{ textAlign: 'center', marginBottom: SPACING.md }}>
              {t('profile_reset_data', lang)}
            </PText>
            <PText variant="sm" secondary style={{ textAlign: 'center', marginBottom: SPACING.xl }}>
              {t('profile_reset_confirm', lang)}
            </PText>
            <View style={{ flexDirection: 'row', gap: SPACING.md }}>
              <TouchableOpacity
                style={[styles.alertBtn, { borderColor: c.border }]}
                onPress={() => setShowResetModal(false)}
              >
                <PText variant="sm">{t('common_cancel', lang)}</PText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alertBtn, { backgroundColor: c.error, borderColor: c.error }]}
                onPress={handleReset}
              >
                <PText variant="sm" weight="bold" color="#fff">
                  {t('profile_reset_data', lang)}
                </PText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  const theme = useTheme();
  return (
    <PText variant="sm" muted style={{ marginHorizontal: SPACING.lg + 4, marginBottom: 6, marginTop: SPACING.md }}>
      {title.toUpperCase()}
    </PText>
  );
}

function FormField({ label, children, divider }: { label: string; children: React.ReactNode; divider?: boolean }) {
  const theme = useTheme();
  const c = theme.colors;
  return (
    <View style={[styles.fieldRow, divider && { borderTopWidth: 1, borderTopColor: c.border, paddingTop: SPACING.md }]}>
      <PText variant="sm" secondary style={{ marginBottom: 6 }}>
        {label}
      </PText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rtlRow: { flexDirection: 'row-reverse' },
  saveBtn: { borderRadius: RADIUS.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  avatarSection: { alignItems: 'center', marginVertical: SPACING.lg },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  sectionCard: { marginHorizontal: SPACING.lg, marginBottom: 4 },
  input: { borderRadius: RADIUS.md, borderWidth: 1, paddingHorizontal: SPACING.md, paddingVertical: 10, fontSize: FONT_SIZE.md },
  fieldRow: { marginBottom: SPACING.md },
  langOption: { borderWidth: 1, borderRadius: RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center' },
  themeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1 },
  themePreview: { width: 44, height: 28, borderRadius: 8, borderWidth: 1, overflow: 'hidden', flexDirection: 'row' },
  themeAccent: { flex: 1 },
  themeAccent2: { flex: 1 },
  checkIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.sm },
  versionRow: { marginTop: SPACING.xl, marginBottom: SPACING.md },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: SPACING.xl },
  alertBox: { borderRadius: RADIUS.xl, borderWidth: 1, padding: SPACING.xl },
  alertBtn: { flex: 1, borderWidth: 1, borderRadius: RADIUS.md, paddingVertical: 12, alignItems: 'center' },
});
