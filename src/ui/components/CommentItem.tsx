import type { JSX } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ChevronUpIcon } from '../icons';
import type { Comment } from '../../types';
import type { FeaturamaStrings } from '../strings/en';
import type { SupportedLocale } from '../utils/locale';

interface CommentItemProps {
  comment: Comment;
  isOwn: boolean;
  isVoting: boolean;
  locale: SupportedLocale;
  strings: FeaturamaStrings;
  onToggleVote: (commentId: string) => void;
}

function formatCommentTime(dateString: string, locale: SupportedLocale): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const sameDay = date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
  return new Intl.DateTimeFormat(locale, sameDay
    ? { hour: '2-digit', minute: '2-digit' }
    : { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
  ).format(date);
}

export function CommentItem({ comment, isOwn, isVoting, locale, strings, onToggleVote }: CommentItemProps): JSX.Element {
  const theme = useTheme();
  const isDeveloper = comment.authorRole === 'developer';
  const ownMessage = isOwn && !isDeveloper;
  const displayName = ownMessage
    ? strings.youBadge
    : (comment.authorName?.trim() || (isDeveloper ? strings.developerBadge : strings.userBadge));
  const time = formatCommentTime(comment.createdAt, locale);

  return (
    <View style={[styles.container, ownMessage && styles.ownContainer]}>
      <View style={styles.senderRow}>
        {isDeveloper && (
          <Text style={[styles.role, { color: theme.accent }]}>{strings.developerBadge}</Text>
        )}
        {isDeveloper && comment.authorName?.trim() ? (
          <Text style={[styles.sender, { color: theme.textSecondary }]}>·</Text>
        ) : null}
        {(!isDeveloper || comment.authorName?.trim()) && (
          <Text style={[styles.sender, { color: theme.textSecondary }]} numberOfLines={1}>
            {displayName}
          </Text>
        )}
      </View>
      <View style={[
        styles.bubble,
        ownMessage && styles.ownBubble,
        {
          backgroundColor: ownMessage ? theme.accent : isDeveloper ? theme.accentLight : theme.card,
          borderColor: ownMessage ? theme.accent : theme.border,
        },
      ]}>
        <Text style={[styles.content, { color: ownMessage ? theme.accentForeground : theme.text }]}>
          {comment.content}
        </Text>
      </View>
      <View style={styles.metaRow}>
        {time ? <Text style={[styles.time, { color: theme.textSecondary }]}>{time}</Text> : null}
        <TouchableOpacity
          style={styles.voteButton}
          onPress={() => onToggleVote(comment.id)}
          disabled={isVoting}
          accessibilityRole="button"
          accessibilityLabel={`${strings.voteComment}, ${comment.voteCount}`}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    maxWidth: '82%',
    marginBottom: 14,
  },
  ownContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '100%',
    marginHorizontal: 7,
    marginBottom: 4,
  },
  sender: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  role: {
    fontSize: 12,
    fontWeight: '700',
  },
  bubble: {
    borderWidth: 1,
    borderRadius: 15,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  ownBubble: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 5,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 7,
    marginTop: 4,
    minHeight: 20,
  },
  time: {
    fontSize: 11,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    minHeight: 20,
  },
  voteCount: {
    fontSize: 11,
    fontWeight: '600',
  },
});