import type { JSX } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ChevronUpIcon } from '../icons';
import type { Comment } from '../../types';
import type { FeaturamaStrings } from '../strings/en';

interface CommentItemProps {
  comment: Comment;
  isVoting: boolean;
  strings: FeaturamaStrings;
  onToggleVote: (commentId: string) => void;
}

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

export function CommentItem({ comment, isVoting, strings, onToggleVote }: CommentItemProps): JSX.Element {
  const theme = useTheme();
  const displayName = comment.authorName || comment.authorIdentifier.slice(0, 8);
  const isDeveloper = comment.authorRole === 'developer';

  return (
    <View style={[styles.container, { borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.authorName, { color: theme.text }]}>{displayName}</Text>
        {isDeveloper && (
          <View style={[styles.badge, { backgroundColor: theme.accent }]}>
            <Text style={[styles.badgeText, { color: theme.accentForeground }]}>{strings.developerBadge}</Text>
          </View>
        )}
        <Text style={[styles.time, { color: theme.textSecondary }]}>
          {formatRelativeTime(comment.createdAt)}
        </Text>
      </View>
      <Text style={[styles.content, { color: theme.text }]}>{comment.content}</Text>
      <TouchableOpacity
        style={styles.voteRow}
        onPress={() => onToggleVote(comment.id)}
        disabled={isVoting}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {isVoting ? (
          <ActivityIndicator size="small" color={theme.accent} />
        ) : (
          <>
            <ChevronUpIcon size={14} color={theme.textSecondary} />
            <Text style={[styles.voteCount, { color: theme.textSecondary }]}>{comment.voteCount}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  voteCount: {
    fontSize: 12,
    fontWeight: '600',
  },
});
