import type { JSX } from 'react';
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { CloseIcon } from '../icons';
import type { FeaturamaStrings } from '../strings/en';

interface CreateRequestFormProps {
  strings: FeaturamaStrings;
  emailCollection: 'none' | 'optional' | 'required';
  insetTop: number;
  insetBottom: number;
  keyboardVerticalOffset: number;
  nativeHeader?: boolean;
  onSubmit: (title: string, description: string, email?: string) => Promise<void>;
  onCancel: () => void;
}

export function CreateRequestForm({
  strings,
  emailCollection,
  insetTop,
  insetBottom,
  keyboardVerticalOffset,
  nativeHeader = false,
  onSubmit,
  onCancel,
}: CreateRequestFormProps): JSX.Element {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();
  const emailError = emailCollection !== 'none' && trimmedEmail.length > 0 && !emailRegex.test(trimmedEmail)
    ? strings.emailInvalid
    : null;

  const canSubmit = Boolean(
    title.trim() &&
    !isSubmitting &&
    !emailError &&
    (emailCollection !== 'required' || trimmedEmail)
  );

  const doSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(title.trim(), description.trim(), email.trim() || undefined);
      setTitle('');
      setDescription('');
      setEmail('');
      setEmailTouched(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, email, onSubmit]);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    if (emailCollection === 'optional' && !trimmedEmail) {
      Alert.alert(
        strings.emailSkipTitle,
        strings.emailSkipMessage,
        [
          { text: strings.cancel, style: 'cancel' },
          { text: strings.emailSkipConfirm, onPress: doSubmit },
        ]
      );
      return;
    }
    doSubmit();
  }, [canSubmit, emailCollection, trimmedEmail, strings, doSubmit]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {/* Header */}
      {!nativeHeader && <View style={[styles.header, { paddingTop: insetTop + 8, borderColor: theme.border }]}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <CloseIcon size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          {strings.newRequest}
        </Text>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: canSubmit ? theme.accent : theme.accentLight }]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={theme.accentForeground} />
          ) : (
            <Text style={[styles.submitText, { color: canSubmit ? theme.accentForeground : theme.textSecondary }]}>
              {strings.submit}
            </Text>
          )}
        </TouchableOpacity>
      </View>}

      {/* Form body */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insetBottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={[styles.input, { backgroundColor: theme.secondary, color: theme.text }]}
          value={title}
          onChangeText={setTitle}
          placeholder={strings.titlePlaceholder}
          placeholderTextColor={theme.textSecondary}
          autoFocus
        />
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.secondary, color: theme.text }]}
          value={description}
          onChangeText={setDescription}
          placeholder={strings.descriptionPlaceholder}
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
        {emailCollection !== 'none' && (
          <View>
            <TextInput
              style={[styles.input, { backgroundColor: theme.secondary, color: theme.text }]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (!emailTouched) setEmailTouched(true);
              }}
              placeholder={strings.emailPlaceholder}
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {emailError && emailTouched ? (
              <Text style={[styles.emailHint, { color: '#ef4444' }]}>
                {emailError}
              </Text>
            ) : (
              <Text style={[styles.emailHint, { color: theme.textSecondary }]}>
                {emailCollection === 'required' ? strings.emailRequired : strings.emailEncouragement}
              </Text>
            )}
          </View>
        )}
        {nativeHeader && (
          <TouchableOpacity
            style={[styles.submitButton, styles.bodySubmitButton, { backgroundColor: canSubmit ? theme.accent : theme.accentLight }]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            {isSubmitting ? <ActivityIndicator size="small" color={theme.accentForeground} /> : (
              <Text style={[styles.submitText, { color: canSubmit ? theme.accentForeground : theme.textSecondary }]}>
                {strings.submit}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    minHeight: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
    minWidth: 44,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bodySubmitButton: {
    minHeight: 48,
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  input: {
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
  },
  emailHint: {
    fontSize: 13,
    marginTop: 4,
  },
});
