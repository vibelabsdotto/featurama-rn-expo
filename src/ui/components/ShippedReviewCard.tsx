import type { JSX } from 'react';
import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { CloseIcon } from '../icons';
import type { FeatureRequest } from '../../types';
import type { FeaturamaStrings } from '../strings/en';

interface ShippedReviewCardProps {
  request: FeatureRequest;
  isOwn: boolean;
  storeUrl: string;
  strings: FeaturamaStrings;
  onPress: (request: FeatureRequest) => void;
  onDismiss: () => void;
}

export function ShippedReviewCard({
  request,
  isOwn,
  storeUrl,
  strings,
  onPress,
  onDismiss,
}: ShippedReviewCardProps): JSX.Element {
  const theme = useTheme();
  const [openFailed, setOpenFailed] = useState(false);
  const openingRef = useRef(false);
  const title = isOwn ? strings.shippedTitleOwn : strings.shippedTitleVoted;

  async function openStore() {
    if (openingRef.current) return;
    openingRef.current = true;
    setOpenFailed(false);
    try {
      await Linking.openURL(storeUrl);
    } catch {
      setOpenFailed(true);
    } finally {
      openingRef.current = false;
    }
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.accentLight, borderColor: theme.borderAccent }]}>
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={() => onPress(request)}
          style={styles.content}
        >
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.body, { color: theme.textSecondary }]} numberOfLines={2}>
            {strings.shippedBody.replace('{title}', request.title)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={strings.close}
          hitSlop={8}
          onPress={onDismiss}
          style={styles.closeButton}
        >
          <CloseIcon size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        accessibilityRole="link"
        onPress={() => void openStore()}
        style={styles.rateButton}
      >
        <Text style={[styles.rateText, { color: theme.accent }]}>{strings.rateApp}</Text>
      </TouchableOpacity>
      {openFailed && (
        <Text accessibilityRole="alert" style={[styles.body, styles.errorText, { color: theme.text }]}>
          {strings.rateOpenError}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    paddingBottom: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  errorText: {
    marginTop: 0,
    marginBottom: 8,
  },
  closeButton: {
    padding: 2,
  },
  rateButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
