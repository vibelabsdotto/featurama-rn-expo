import type { JSX } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ChevronUpIcon, ChatBubbleIcon } from '../icons';
import type { FeatureRequest } from '../../types';
import type { FeaturamaStrings } from '../strings/en';

interface RequestCardProps {
  request: FeatureRequest;
  isVoting: boolean;
  strings: FeaturamaStrings;
  onToggleVote: (id: string) => void;
  onPress: (request: FeatureRequest) => void;
}

export function RequestCard({ request, isVoting, strings, onToggleVote, onPress }: RequestCardProps): JSX.Element {
  const theme = useTheme();
  const commentCount = request.commentCount ?? 0;
  const isPending = !request.isApproved;
  const isPlanned = String(request.status) === 'Roadmap';
  const hasVoted = request.hasVoted ?? false;
  const voteColor = hasVoted ? theme.accent : theme.textSecondary;
  const voteBg = hasVoted ? theme.accentLight : theme.gray100;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={request.title}
      onPress={() => onPress(request)}
      style={[
        styles.requestItem,
        { backgroundColor: theme.card, borderColor: isPending ? theme.warning : theme.border },
        isPending && { opacity: 0.85 },
      ]}
    >
      <TouchableOpacity
        style={[styles.voteButton, { backgroundColor: voteBg }]}
        onPress={() => onToggleVote(request.id)}
        disabled={isVoting || isPending}
      >
        {isVoting ? (
          <ActivityIndicator size="small" color={voteColor} />
        ) : (
          <>
            <ChevronUpIcon size={20} color={voteColor} />
            <Text style={[styles.voteCount, { color: voteColor }]}>{request.voteCount}</Text>
          </>
        )}
      </TouchableOpacity>
      <View style={styles.requestContent}>
        <View style={styles.titleRow}>
          <Text style={[styles.requestTitle, { color: theme.text, flex: 1 }]}>{request.title}</Text>
          <View style={styles.commentBubble}>
            <ChatBubbleIcon size={30} color={theme.accent} />
            <Text style={[styles.commentBubbleCount, { color: theme.accent }]}>{commentCount}</Text>
          </View>
        </View>
        {isPending && (
          <View style={[styles.pendingBadge, { backgroundColor: theme.warningLight }]}>
            <Text style={[styles.pendingText, { color: theme.warningText }]}>
              {strings.pendingReview}
            </Text>
          </View>
        )}
        {isPlanned && !isPending && (
          <View style={[styles.pendingBadge, { backgroundColor: theme.accentLight }]}>
            <Text style={[styles.pendingText, { color: theme.accent }]}>
              {strings.badgePlanned}
            </Text>
          </View>
        )}
        {request.description ? (
          <Text style={[styles.requestDescription, { color: theme.textSecondary }]} numberOfLines={2}>
            {request.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  requestItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  voteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 48,
  },
  voteCount: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  requestContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentBubble: {
    position: 'absolute',
    right: -6,
    top: -6,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentBubbleCount: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '700',
    marginTop: -2,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  requestDescription: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  pendingBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
