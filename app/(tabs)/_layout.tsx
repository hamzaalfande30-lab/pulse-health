import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useLang } from '../../src/context/AppContext';
import { PText } from '../../src/components/common/Text';
import { t } from '../../src/constants/translations';
import { SPACING, RADIUS } from '../../src/constants/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

type TabRoute = { key: string; name: string };

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const lang = useLang();
  const insets = useSafeAreaInsets();
  const c = theme.colors;

  const icons: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
    index: { active: 'home', inactive: 'home-outline' },
    activity: { active: 'flame', inactive: 'flame-outline' },
    sleep: { active: 'moon', inactive: 'moon-outline' },
    coach: { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline' },
    profile: { active: 'person-circle', inactive: 'person-circle-outline' },
  };

  const labels: Record<string, string> = {
    index: t('nav_home', lang),
    activity: t('nav_activity', lang),
    sleep: t('nav_sleep', lang),
    coach: t('nav_coach', lang),
    profile: t('nav_profile', lang),
  };

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: c.bgCard,
          borderTopColor: c.border,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      {state.routes.map((route: TabRoute, index: number) => {
        const isFocused = state.index === index;
        const icon = icons[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (navigation as any).navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            accessibilityRole="button"
            accessibilityLabel={labels[route.name]}
            accessibilityState={{ selected: isFocused }}
          >
            {isFocused && (
              <View style={[styles.activeIndicator, { backgroundColor: c.primary + '20' }]} />
            )}
            <Ionicons
              name={isFocused ? icon.active : icon.inactive}
              size={22}
              color={isFocused ? c.primary : c.textMuted}
            />
            <PText
              variant="xs"
              color={isFocused ? c.primary : c.textMuted}
              weight={isFocused ? 'semibold' : 'regular'}
              style={styles.tabLabel}
            >
              {labels[route.name]}
            </PText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="sleep" />
      <Tabs.Screen name="coach" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 40,
    height: 28,
    borderRadius: 14,
  },
  tabLabel: {
    marginTop: 2,
    textAlign: 'center',
  },
});
