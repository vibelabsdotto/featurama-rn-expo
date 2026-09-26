import type { JSX } from 'react';
import { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SendIcon } from '../icons';
import type { FeaturamaStrings } from '../strings/en';

interface AddCommentFormProps {
  strings: FeaturamaStrings;
  isSubmitting: boolean;
  safeAreaBottom: number;
  onSubmit: (content: string) => Promise<void>;
}

export function AddCommentForm({ strings, isSubmitting, safeAreaBottom, onSubmit }: AddCommentFormProps): JSX.Element {
  const theme = useTheme();
  const [content, setContent] = useState('');
  const submittingRef = useRef(false);

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed || isSubmitting || submittingRef.current) return;
    submittingRef.current = true;
    try {
      await onSubmit(trimmed);
      setContent('');
    } catch {
      // Keep the draft so the user can retry without retyping it.
      Alert.alert(strings.error);
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border, paddingBottom: Math.max(safeAreaBottom, 12) }]}>
      <TextInput
        style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
        placeholder={strings.commentPlaceholder}
        placeholderTextColor={theme.textSecondary}
        value={content}
        onChangeText={setContent}
        multiline
        maxLength={2000}
        editable={!isSubmitting}
      />
      <TouchableOpacity
        style={[styles.sendButton, { backgroundColor: content.trim() ? theme.accent : theme.accentLight }]}
        onPress={handleSubmit}
        accessibilityRole="button"
        accessibilityLabel={strings.postComment}
        disabled={!content.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color={theme.accentForeground} />
        ) : (
          <SendIcon size={18} color={content.trim() ? theme.accentForeground : theme.textSecondary} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 12,
    paddingHorizontal: 12,
    gap: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
