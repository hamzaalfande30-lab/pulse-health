import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PText } from '../common/Text';
import { useTheme, useLang } from '../../context/AppContext';
import { RADIUS } from '../../constants/theme';
import { t } from '../../constants/translations';

interface HydrationBarProps {
  current: number;
  goal: number;
  onAdd: () => void;
}

export function HydrationBar({ current, goal, onAdd }: HydrationBarProps) {
  const theme = useTheme();
  const lang = useLang();
  const c = theme.colors;
  const progress = Math.min(current / goal, 1);
  const pct = Math.round(progress * 100);

  return (
    <View>
      <View style={styles.row}>
        <PText variant="sm" secondary>
          {current} {t('common_ml', lang)} / {goal} {t('common_ml', lang)}
        </PText>
        <PText variant="sm" color={c.accent} weight="semibold">
          {pct}%
        </PText>
      </View>
      {/* Track with overflow hidden clips the gradient */}
      <View style={[styles.track, { backgroundColor: c.border }]}>
        <View style={[styles.fillWrapper, { width: `${pct}%` }]}>
          <LinearGradient
            colors={[c.accent, c.secondary]}
            style={styles.fill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: c.accent + '20', borderColor: c.accent }]}
        onPress={onAdd}
        accessibilityLabel={t('home_add_water', lang)}
      >
        <PText variant="sm" weight="semibold" color={c.accent}>
          {t('home_add_water', lang)}
        </PText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  track: {
    height: 10,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: 12,
  },
  fillWrapper: {
    height: '100%',
    overflow: 'hidden',
    borderRadius: RADIUS.full,
  },
  fill: {
    height: '100%',
    width: '100%',
    borderRadius: RADIUS.full,
  },
  addBtn: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    alignItems: 'center',
  },
});
