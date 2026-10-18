import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PText } from '../common/Text';
import { useTheme } from '../../context/AppContext';
import { SPACING, RADIUS } from '../../constants/theme';

export interface BarChartDataPoint {
  label: string;
  value: number;
  isToday?: boolean;
}

interface BarChartProps {
  data: BarChartDataPoint[];
  maxValue?: number;
  height?: number;
  goalLine?: number; // value at which to show a goal line
}

export function BarChart({ data, maxValue, height = 120, goalLine }: BarChartProps) {
  const theme = useTheme();
  const c = theme.colors;

  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.container, { height }]}>
      {goalLine !== undefined && (
        <View
          style={[
            styles.goalLine,
            {
              bottom: (goalLine / max) * height,
              borderColor: c.warning + '60',
            },
          ]}
        />
      )}
      <View style={styles.bars}>
        {data.map((item, i) => {
          const barHeight = Math.max((item.value / max) * (height - 24), 2);
          return (
            <View key={i} style={styles.barWrapper}>
              <View style={[styles.barContainer, { height: height - 24 }]}>
                {item.isToday ? (
                  <LinearGradient
                    colors={[c.gradientStart, c.gradientEnd]}
                    style={[styles.bar, { height: barHeight, borderRadius: RADIUS.sm }]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                  />
                ) : (
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: c.primary + '40',
                        borderRadius: RADIUS.sm,
                      },
                    ]}
                  />
                )}
              </View>
              <PText variant="xs" muted style={styles.label}>
                {item.label}
              </PText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flex: 1,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '70%',
  },
  label: {
    marginTop: 4,
    textAlign: 'center',
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
});
