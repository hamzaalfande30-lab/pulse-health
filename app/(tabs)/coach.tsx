import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, useTheme, useLang } from '../../src/context/AppContext';
import { PText } from '../../src/components/common/Text';
import { t } from '../../src/constants/translations';
import { SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';
import { getCoachResponse } from '../../src/services/coach';
import { CoachMessage } from '../../src/types';

export default function CoachScreen() {
  const { state, addCoachMessage } = useApp();
  const theme = useTheme();
  const lang = useLang();
  const insets = useSafeAreaInsets();
  const c = theme.colors;
  const isRTL = lang === 'ar';

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  const messages = state.coachHistory;

  const suggestions = [
    t('coach_suggestion_1', lang),
    t('coach_suggestion_2', lang),
    t('coach_suggestion_3', lang),
  ];

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput('');

    const userMsg: CoachMessage = {
      id: Math.random().toString(36).slice(2) + Date.now(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    await addCoachMessage(userMsg);

    setIsTyping(true);
    // Simulate typing delay for a natural feel
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));

    const coachMsg = getCoachResponse(trimmed, state, lang);
    await addCoachMessage(coachMsg);
    setIsTyping(false);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, isTyping]);

  const renderMessage = ({ item }: { item: CoachMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={[
          styles.msgRow,
          isUser ? styles.userMsgRow : styles.coachMsgRow,
          isRTL && isUser ? styles.rtlUserRow : null,
        ]}
      >
        {!isUser && (
          <LinearGradient
            colors={[c.gradientStart, c.gradientEnd]}
            style={styles.coachAvatar}
          >
            <PText variant="sm" weight="bold" color={c.bgMain}>P</PText>
          </LinearGradient>
        )}
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.userBubble, { backgroundColor: c.primary }]
              : [styles.coachBubble, { backgroundColor: c.bgCardElevated, borderColor: c.border }],
          ]}
        >
          <PText
            variant="md"
            color={isUser ? c.bgMain : c.textPrimary}
            style={{ lineHeight: 22, textAlign: isRTL ? 'right' : 'left' }}
          >
            {item.content}
          </PText>
        </View>
      </View>
    );
  };

  const isEmpty = messages.length === 0;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: c.bgMain }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <LinearGradient
        colors={[c.bgSecondary, c.bgMain]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={[styles.headerRow, isRTL && styles.rtlRow]}>
          <View>
            <PText variant="xxl" weight="bold">
              {t('coach_title', lang)}
            </PText>
            <PText variant="sm" secondary>
              {lang === 'ar' ? 'مدعوم بالذكاء المحلي' : 'Local AI · No internet needed'}
            </PText>
          </View>
          <LinearGradient
            colors={[c.gradientStart, c.gradientEnd]}
            style={styles.coachBadge}
          >
            <Ionicons name="sparkles" size={20} color={c.bgMain} />
          </LinearGradient>
        </View>
      </LinearGradient>

      {/* Messages */}
      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <LinearGradient colors={[c.primary + '20', c.secondary + '10']} style={styles.emptyGradient}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color={c.primary} />
            <PText variant="lg" weight="semibold" style={{ marginTop: SPACING.md, textAlign: 'center' }}>
              {t('coach_greeting', lang)}
            </PText>
            <PText variant="sm" muted style={{ marginTop: SPACING.sm, textAlign: 'center', lineHeight: 20 }}>
              {t('coach_disclaimer', lang)}
            </PText>
          </LinearGradient>

          {/* Suggestions */}
          <View style={styles.suggestions}>
            {suggestions.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.suggestionChip, { backgroundColor: c.bgCard, borderColor: c.border }]}
                onPress={() => sendMessage(s)}
              >
                <Ionicons name="bulb-outline" size={14} color={c.primary} style={{ marginRight: 6 }} />
                <PText variant="sm" secondary>
                  {s}
                </PText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={[
            styles.messagesList,
            { paddingBottom: SPACING.lg },
          ]}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isTyping ? (
              <View style={[styles.msgRow, styles.coachMsgRow]}>
                <LinearGradient colors={[c.gradientStart, c.gradientEnd]} style={styles.coachAvatar}>
                  <PText variant="sm" weight="bold" color={c.bgMain}>P</PText>
                </LinearGradient>
                <View style={[styles.bubble, styles.coachBubble, { backgroundColor: c.bgCardElevated, borderColor: c.border }]}>
                  <ActivityIndicator size="small" color={c.primary} />
                </View>
              </View>
            ) : null
          }
        />
      )}

      {/* Input Bar */}
      <View
        style={[
          styles.inputBar,
          {
            backgroundColor: c.bgCard,
            borderTopColor: c.border,
            paddingBottom: insets.bottom + 8,
          },
        ]}
      >
        {!isEmpty && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.inlineSuggestions}
            contentContainerStyle={{ paddingHorizontal: SPACING.md }}
          >
            {suggestions.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.inlineChip, { backgroundColor: c.bgCardElevated, borderColor: c.border }]}
                onPress={() => sendMessage(s)}
              >
                <PText variant="xs" color={c.primary}>{s}</PText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        <View style={[styles.inputRow, isRTL && styles.rtlRow]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: c.bgCardElevated,
                color: c.textPrimary,
                borderColor: c.border,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
            placeholder={t('coach_input_placeholder', lang)}
            placeholderTextColor={c.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(input)}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { opacity: input.trim() ? 1 : 0.5 }]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            accessibilityLabel={t('coach_send', lang)}
          >
            <LinearGradient
              colors={[c.gradientStart, c.gradientEnd]}
              style={styles.sendBtnInner}
            >
              <Ionicons name="send" size={18} color={c.bgMain} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rtlRow: { flexDirection: 'row-reverse' },
  coachBadge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, padding: SPACING.lg },
  emptyGradient: { borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.lg },
  suggestions: { gap: SPACING.sm },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  messagesList: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md },
  msgRow: { flexDirection: 'row', marginBottom: SPACING.md, alignItems: 'flex-end' },
  userMsgRow: { justifyContent: 'flex-end' },
  coachMsgRow: { justifyContent: 'flex-start' },
  rtlUserRow: { flexDirection: 'row-reverse' },
  coachAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  userBubble: { borderBottomRightRadius: 4 },
  coachBubble: { borderWidth: 1, borderBottomLeftRadius: 4 },
  inputBar: { borderTopWidth: 1 },
  inlineSuggestions: { paddingVertical: SPACING.sm },
  inlineChip: { borderWidth: 1, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: FONT_SIZE.md,
    maxHeight: 100,
  },
  sendBtn: { flexShrink: 0 },
  sendBtnInner: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
