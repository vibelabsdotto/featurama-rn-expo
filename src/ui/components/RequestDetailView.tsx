import type { JSX } from 'react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Keyboard, Platform, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ChevronLeftIcon, ChevronUpIcon } from '../icons';
import { CommentItem } from './CommentItem';
import { AddCommentForm } from './AddCommentForm';
import type { FeatureRequest, Comment } from '../../types';
import type { FeaturamaStrings } from '../strings/en';
import type { SupportedLocale } from '../utils/locale';

interface RequestDetailViewProps {
  request: FeatureRequest;
  comments: Comment[];
  isLoadingComments: boolean;
  isSubmittingComment: boolean;
  isVotingRequest: boolean;
  commentVotingIds: Set<string>;
  locale: SupportedLocale;
  strings: FeaturamaStrings;
  insetTop: number;
  insetBottom: number;
  keyboardVerticalOffset: number;
  nativeHeader?: boolean;
  onBack: () => void;
  onToggleRequestVote: () => void;
  onToggleCommentVote: (commentId: string) => void;
  onAddComment: (content: string) => Promise<void>;
}

const STATUS_LABELS: Record<string, string> = {
  Requested: 'New',
  Roadmap: 'Planned',
  InProgress: 'In Progress',
  Done: 'Done',
  Declined: 'Declined',
};

export function RequestDetailView({
  request,
  comments,
  isLoadingComments,
  isSubmittingComment,
  isVotingRequest,
  commentVotingIds,
  locale,
  strings,
  insetTop,
  insetBottom,
  keyboardVerticalOffset,
  nativeHeader = false,
  onBack,
  onToggleRequestVote,
  onToggleCommentVote,
  onAddComment,
}: RequestDetailViewProps): JSX.Element {
  const theme = useTheme();
  const hasVoted = request.hasVoted ?? false;
  const voteColor = hasVoted ? theme.accent : theme.textSecondary;
  const voteBg = hasVoted ? theme.accentLight : theme.gray100;
  const orderedComments = useMemo(() => comments
    .map((comment, index) => ({ comment, index, time: Date.parse(comment.createdAt) }))
    .sort((a, b) => {
      const aTime = Number.isNaN(a.time) ? Infinity : a.time;
      const bTime = Number.isNaN(b.time) ? Infinity : b.time;
      return aTime - bTime || a.index - b.index;
    })
    .map(({ comment }) => comment), [comments]);

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollAfterSubmit = useRef(false);
  const handleAddComment = async (content: string) => {
    scrollAfterSubmit.current = true;
    try {
      await onAddComment(content);
    } catch (error) {
      scrollAfterSubmit.current = false;
      throw error;
    }
  };

  // On Android, manually track keyboard height instead of using KeyboardAvoidingView
  // which doesn't properly reset after keyboard dismissal.
  const [androidKeyboardHeight, setAndroidKeyboardHeight] = useState(0);
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setAndroidKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setAndroidKeyboardHeight(0);
    });
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const isIOS = Platform.OS === 'ios';
  const containerRef = useRef<View>(null);
  const keyboardTop = useRef<number | null>(null);
  const [keyboardOverlap, setKeyboardOverlap] = useState(0);
  const measureKeyboardOverlap = useCallback(() => {
    containerRef.current?.measureInWindow((_x, y, _width, height) => {
      const top = keyboardTop.current;
      // A native Stack may resize the view itself. Only compensate for the
      // part of the keyboard that still overlaps this SDK-owned container.
      setKeyboardOverlap(top === null ? 0 : Math.max(0, y + height - (top - keyboardVerticalOffset)));
    });
  }, [keyboardVerticalOffset]);

  useEffect(() => {
    if (!isIOS) return;
    const change = Keyboard.addListener('keyboardWillChangeFrame', (event) => {
      keyboardTop.current = event.endCoordinates.screenY;
      measureKeyboardOverlap();
    });
    const shown = Keyboard.addListener('keyboardDidShow', (event) => {
      keyboardTop.current = event.endCoordinates.screenY;
      measureKeyboardOverlap();
    });
    const hide = () => {
      keyboardTop.current = null;
      setKeyboardOverlap(0);
    };
    const hiding = Keyboard.addListener('keyboardWillHide', hide);
    const hidden = Keyboard.addListener('keyboardDidHide', hide);
    return () => { change.remove(); shown.remove(); hiding.remove(); hidden.remove(); };
  }, [isIOS, measureKeyboardOverlap]);

  return (
    <View ref={containerRef} style={styles.container} onLayout={isIOS ? measureKeyboardOverlap : undefined}>
      {/* Header */}
      {!nativeHeader && <View style={[styles.header, { paddingTop: insetTop + 8, backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <ChevronLeftIcon size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>{request.title}</Text>
        <View style={styles.headerButton} />
      </View>}

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => {
          if (scrollAfterSubmit.current) {
            scrollAfterSubmit.current = false;
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }
        }}
      >
        {/* Title + status */}
        <Text style={[styles.title, { color: theme.text }]}>{request.title}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.statusBadge, { backgroundColor: theme.accentLight }]}>
            <Text style={[styles.statusText, { color: theme.accent }]}>
              {STATUS_LABELS[request.status] ?? request.status}
            </Text>
          </View>
          {!request.isApproved && (
            <View style={[styles.statusBadge, { backgroundColor: theme.warningLight }]}>
              <Text style={[styles.statusText, { color: theme.warningText }]}>
                {strings.pendingReview}
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <Text style={[styles.description, { color: theme.textSecondary }]}>{request.description}</Text>

        {/* Vote button */}
        <TouchableOpacity
          style={[styles.voteButton, { backgroundColor: voteBg }]}
          onPress={onToggleRequestVote}
          disabled={isVotingRequest || !request.isApproved}
        >
          {isVotingRequest ? (
            <ActivityIndicator size="small" color={voteColor} />
          ) : (
            <>
              <ChevronUpIcon size={18} color={voteColor} />
              <Text style={[styles.voteCount, { color: voteColor }]}>{request.voteCount}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Comments section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {strings.comments} ({comments.length})
        </Text>

        {isLoadingComments ? (
          <ActivityIndicator size="small" color={theme.accent} style={styles.commentsLoading} />
        ) : comments.length === 0 ? (
          <View style={styles.emptyComments}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{strings.noComments}</Text>
            <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>{strings.noCommentsHint}</Text>
          </View>
        ) : (
          orderedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isOwn={comment.isOwn === true}
              isVoting={commentVotingIds.has(comment.id)}
              locale={locale}
              strings={strings}
              onToggleVote={onToggleCommentVote}
            />
          ))
        )}
      </ScrollView>

      {/* Add comment form */}
      <View style={isIOS ? (keyboardOverlap > 0 ? { marginBottom: keyboardOverlap } : undefined)
        : androidKeyboardHeight > 0 ? { marginBottom: androidKeyboardHeight } : undefined}>
        <AddCommentForm
          strings={strings}
          isSubmitting={isSubmittingComment}
          safeAreaBottom={isIOS && keyboardOverlap > 0 ? 0 : insetBottom}
          onSubmit={handleAddComment}
        />
      </View>
    </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  voteCount: {
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  commentsLoading: {
    marginTop: 16,
  },
  emptyComments: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: 13,
    marginTop: 4,
  },
});
