import type { JSX } from 'react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Keyboard, Platform, StyleSheet, Dimensions } from 'react-native';
import type { KeyboardEvent, LayoutChangeEvent } from 'react-native';
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
  const statusLabels: Record<string, string> = {
    Requested: strings.filterNew,
    Roadmap: strings.filterPlanned,
    InProgress: strings.filterInProgress,
    Done: strings.filterDone,
    Declined: strings.badgeDeclined,
  };
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
  const keyboardHeight = useRef(0);
  const containerLayout = useRef({ width: 0, height: 0, restingHeight: 0 });
  const [keyboardOverlap, setKeyboardOverlap] = useState(0);
  const updateKeyboardOverlap = useCallback(() => {
    // The composer is bottom-anchored. Fabric's measureInWindow can omit a
    // native sheet's translation, so use keyboard height, not absolute view Y.
    const { height, restingHeight } = containerLayout.current;
    const resizedByHost = Math.max(0, restingHeight - height);
    setKeyboardOverlap(keyboardHeight.current === 0 ? 0
      : Math.max(0, keyboardHeight.current - resizedByHost + keyboardVerticalOffset));
  }, [keyboardVerticalOffset]);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    const previous = containerLayout.current;
    // A width change starts a new orientation/layout baseline.
    const restingHeight = keyboardHeight.current === 0 || width !== previous.width
      ? height : previous.restingHeight;
    containerLayout.current = { width, height, restingHeight };
    updateKeyboardOverlap();
  }, [updateKeyboardOverlap]);

  useEffect(() => {
    if (!isIOS) return;
    const update = (event: KeyboardEvent) => {
      const { screenY, height } = event.endCoordinates;
      keyboardHeight.current = screenY >= Dimensions.get('window').height ? 0 : height;
      updateKeyboardOverlap();
    };
    const hide = () => {
      keyboardHeight.current = 0;
      setKeyboardOverlap(0);
    };
    const metrics = Keyboard.metrics();
    keyboardHeight.current = metrics?.height ?? 0;
    updateKeyboardOverlap();
    const change = Keyboard.addListener('keyboardWillChangeFrame', update);
    const changed = Keyboard.addListener('keyboardDidChangeFrame', update);
    const shown = Keyboard.addListener('keyboardDidShow', update);
    const hiding = Keyboard.addListener('keyboardWillHide', hide);
    const hidden = Keyboard.addListener('keyboardDidHide', hide);
    return () => { change.remove(); shown.remove(); hiding.remove(); hidden.remove(); changed.remove(); };
  }, [isIOS, updateKeyboardOverlap]);

  return (
    <View style={styles.container} onLayout={isIOS ? handleContainerLayout : undefined}>
      {/* Header */}
      {!nativeHeader && <View style={[styles.header, { paddingTop: insetTop + 8, backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}
          accessibilityRole="button" accessibilityLabel={strings.back}>
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
              {statusLabels[request.status] ?? request.status}
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
