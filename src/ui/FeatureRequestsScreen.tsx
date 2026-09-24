import type { JSX } from 'react';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFeaturama } from '../hooks/useFeaturama';
import { useRequests } from '../hooks/useRequests';
import { useAutoInsets } from './utils/useAutoInsets';
import { createTheme } from './theme/createTheme';
import { ThemeContext } from './theme/ThemeContext';
import { getStringsForLocale } from './strings';
import { getDeviceLocale } from './utils/locale';
import { getOrCreateVoterId } from './utils/voterId';
import { Header } from './components/Header';
import { FilterTabs } from './components/FilterTabs';
import { CreateRequestForm } from './components/CreateRequestForm';
import { RequestList } from './components/RequestList';
import { RequestDetailView } from './components/RequestDetailView';
import { Branding } from './components/Branding';
import { Fab } from './components/Fab';
import type { FeatureRequestsScreenProps } from './types';
import type { ProjectConfig, RequestFilter, FeatureRequest, Comment } from '../types';

export function FeatureRequestsScreen({
  colorScheme,
  accentColor,
  onClose,
  safeAreaTop,
  safeAreaBottom,
  keyboardVerticalOffset,
  theme: themeOverrides,
}: FeatureRequestsScreenProps): JSX.Element {
  const theme = useMemo(
    () => ({ ...createTheme(accentColor, colorScheme), ...themeOverrides }),
    [accentColor, colorScheme, themeOverrides]
  );

  const insets = useAutoInsets(safeAreaTop, safeAreaBottom);
  const effectiveKeyboardOffset = keyboardVerticalOffset ?? 0;

  const { client } = useFeaturama();

  const [config, setConfig] = useState<ProjectConfig | null>(null);
  const [activeFilter, setActiveFilter] = useState<RequestFilter>('new');
  const [isAdding, setIsAdding] = useState(false);
  const [voterId, setVoterId] = useState<string | null>(null);
  const [votingIds, setVotingIds] = useState<Set<string>>(new Set());

  // Detail view state
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentVotingIds, setCommentVotingIds] = useState<Set<string>>(new Set());

  const locale = useMemo(() => getDeviceLocale(), []);
  const strings = useMemo(() => getStringsForLocale(locale), [locale]);

  const showBranding = config ? config.branding.showBranding : true;
  const emailCollection = config?.emailCollection ?? 'none';

  const { data, isLoading, error, refetch } = useRequests({
    pageSize: 50,
    filter: activeFilter,
    submitterIdentifier: voterId ?? undefined,
  });

  useEffect(() => {
    getOrCreateVoterId().then(setVoterId);
    client.getConfig().then(setConfig).catch(() => {
      // Config fetch failed — use defaults silently
    });
  }, [client]);

  const handleSubmit = useCallback(
    async (title: string, description: string, email?: string) => {
      if (!voterId) return;
      await client.createRequest({
        title,
        description,
        submitterIdentifier: voterId,
        ...(email ? { email } : {}),
      });
      setIsAdding(false);
      await refetch();
    },
    [voterId, client, refetch]
  );

  const handleToggleVote = useCallback(
    async (requestId: string) => {
      if (!voterId || votingIds.has(requestId)) return;

      // Block voting on pending requests
      const request = data?.items.find((r) => r.id === requestId);
      if (request && !request.isApproved) return;

      setVotingIds((prev) => new Set(prev).add(requestId));
      try {
        await client.toggleVote(requestId, voterId);
        await refetch();
      } finally {
        setVotingIds((prev) => {
          const next = new Set(prev);
          next.delete(requestId);
          return next;
        });
      }
    },
    [voterId, votingIds, client, refetch, data]
  );

  // Detail view handlers
  const handleRequestPress = useCallback(
    async (request: FeatureRequest) => {
      setSelectedRequest(request);
      setComments([]);
      setIsLoadingComments(true);
      try {
        const result = await client.getComments(request.id);
        setComments(result);
      } catch {
        // Silently fail — show empty comments
      } finally {
        setIsLoadingComments(false);
      }
    },
    [client]
  );

  const handleBack = useCallback(() => {
    setSelectedRequest(null);
    setComments([]);
    refetch(); // Refresh list to get updated commentCount
  }, [refetch]);

  const handleAddComment = useCallback(
    async (content: string) => {
      if (!voterId || !selectedRequest) return;
      setIsSubmittingComment(true);
      try {
        const comment = await client.addComment(selectedRequest.id, {
          content,
          authorIdentifier: voterId,
        });
        setComments((prev) => [...prev, comment]);
        // Update local request commentCount
        setSelectedRequest((prev) =>
          prev ? { ...prev, commentCount: (prev.commentCount ?? 0) + 1 } : null
        );
      } finally {
        setIsSubmittingComment(false);
      }
    },
    [voterId, selectedRequest, client]
  );

  const handleToggleCommentVote = useCallback(
    async (commentId: string) => {
      if (!voterId || !selectedRequest || commentVotingIds.has(commentId)) return;

      setCommentVotingIds((prev) => new Set(prev).add(commentId));
      try {
        const { comment: updated } = await client.toggleCommentVote(
          selectedRequest.id,
          commentId,
          voterId
        );
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? updated : c))
        );
      } finally {
        setCommentVotingIds((prev) => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
      }
    },
    [voterId, selectedRequest, commentVotingIds, client]
  );

  const handleToggleRequestVoteInDetail = useCallback(async () => {
    if (!voterId || !selectedRequest || votingIds.has(selectedRequest.id)) return;
    if (!selectedRequest.isApproved) return;

    setVotingIds((prev) => new Set(prev).add(selectedRequest.id));
    try {
      const { request: updated, isVoting } = await client.toggleVote(selectedRequest.id, voterId);
      setSelectedRequest({ ...updated, hasVoted: isVoting });
    } finally {
      setVotingIds((prev) => {
        const next = new Set(prev);
        if (selectedRequest) next.delete(selectedRequest.id);
        return next;
      });
    }
  }, [voterId, selectedRequest, votingIds, client]);

  return (
    <ThemeContext.Provider value={theme}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {selectedRequest ? (
          <RequestDetailView
            request={selectedRequest}
            comments={comments}
            isLoadingComments={isLoadingComments}
            isSubmittingComment={isSubmittingComment}
            isVotingRequest={votingIds.has(selectedRequest.id)}
            commentVotingIds={commentVotingIds}
            strings={strings}
            insetTop={insets.top}
            insetBottom={insets.bottom}
            keyboardVerticalOffset={effectiveKeyboardOffset}
            onBack={handleBack}
            onToggleRequestVote={handleToggleRequestVoteInDetail}
            onToggleCommentVote={handleToggleCommentVote}
            onAddComment={handleAddComment}
          />
        ) : isAdding ? (
          <CreateRequestForm
            strings={strings}
            emailCollection={emailCollection}
            insetTop={insets.top}
            insetBottom={insets.bottom}
            keyboardVerticalOffset={effectiveKeyboardOffset}
            onSubmit={handleSubmit}
            onCancel={() => setIsAdding(false)}
          />
        ) : (
          <>
            <Header
              strings={strings}
              onClose={onClose}
              insetTop={insets.top}
            />
            <FilterTabs
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              strings={strings}
            />
            <RequestList
              data={data}
              isLoading={isLoading}
              error={error}
              votingIds={votingIds}
              strings={strings}
              safeAreaBottom={insets.bottom}
              onToggleVote={handleToggleVote}
              onRefetch={refetch}
              onRequestPress={handleRequestPress}
            />
            {showBranding && <Branding safeAreaBottom={insets.bottom} />}
            <Fab onPress={() => setIsAdding(true)} safeAreaBottom={insets.bottom} />
          </>
        )}
      </View>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
