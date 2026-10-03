import type { JSX } from 'react';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
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
import type { FeatureRequestsScreenInternalProps } from './types';
import type { ProjectConfig, RequestFilter, FeatureRequest, Comment } from '../types';

export function FeatureRequestsScreen({
  colorScheme,
  accentColor,
  locale: appLocale,
  onClose,
  safeAreaTop,
  safeAreaBottom,
  keyboardVerticalOffset,
  nativeHeader = false,
  onNavigationChange,
  theme: themeOverrides,
}: FeatureRequestsScreenInternalProps): JSX.Element {
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
  const [voterIdError, setVoterIdError] = useState<Error | null>(null);
  const [identityAttempt, setIdentityAttempt] = useState(0);
  const [votingIds, setVotingIds] = useState<Set<string>>(new Set());
  const votingIdsRef = useRef(new Set<string>());

  // Detail view state
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentVotingIds, setCommentVotingIds] = useState<Set<string>>(new Set());
  const commentVotingIdsRef = useRef(new Set<string>());

  const locale = useMemo(() => appLocale ?? getDeviceLocale(), [appLocale]);
  const strings = useMemo(() => getStringsForLocale(locale), [locale]);

  const showBranding = config ? config.branding.showBranding : true;
  const emailCollection = config?.emailCollection ?? 'none';

  const { data, isLoading, error, refetch } = useRequests({
    pageSize: 50,
    filter: activeFilter,
    submitterIdentifier: voterId ?? undefined,
    enabled: voterId !== null,
  });

  useEffect(() => {
    let active = true;
    getOrCreateVoterId().then((id) => {
      if (active) setVoterId(id);
    }).catch((err: unknown) => {
      if (active) {
        setVoterIdError(err instanceof Error ? err : new Error('Unable to load device identity'));
      }
    });
    return () => { active = false; };
  }, [identityAttempt]);

  useEffect(() => {
    let active = true;
    client.getConfig().then((result) => {
      if (active) setConfig(result);
    }).catch(() => {
      // Config fetch failed — use defaults silently
    });
    return () => { active = false; };
  }, [client]);

  const handleRefetch = useCallback(async () => {
    if (voterId === null) {
      setVoterIdError(null);
      setIdentityAttempt((attempt) => attempt + 1);
      return;
    }
    await refetch();
  }, [voterId, refetch]);

  const handleSubmit = useCallback(
    async (title: string, description: string, email?: string) => {
      if (!voterId) throw new Error('Request author is not ready');
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
      if (!voterId || votingIdsRef.current.has(requestId)) return;

      // Block voting on pending requests
      const request = data?.items.find((r) => r.id === requestId);
      if (request && !request.isApproved) return;

      votingIdsRef.current.add(requestId);
      setVotingIds((prev) => new Set(prev).add(requestId));
      try {
        await client.toggleVote(requestId, voterId);
        await refetch();
      } catch {
        Alert.alert(strings.error, strings.mutationError);
      } finally {
        votingIdsRef.current.delete(requestId);
        setVotingIds((prev) => {
          const next = new Set(prev);
          next.delete(requestId);
          return next;
        });
      }
    },
    [voterId, client, refetch, data, strings]
  );

  // Detail view handlers
  const handleRequestPress = useCallback(
    async (request: FeatureRequest) => {
      setSelectedRequest(request);
      setComments([]);
      setIsLoadingComments(true);
      try {
        let authorIdentifier = voterId;
        if (!authorIdentifier) {
          try {
            authorIdentifier = await getOrCreateVoterId();
          } catch {
            // Comments remain readable even if local identity storage fails.
          }
        }
        const result = await client.getComments(request.id, authorIdentifier ?? undefined);
        setComments(result);
      } catch {
        // Silently fail — show empty comments
      } finally {
        setIsLoadingComments(false);
      }
    },
    [client, voterId]
  );

  const handleBack = useCallback(() => {
    setSelectedRequest(null);
    setComments([]);
    refetch(); // Refresh list to get updated commentCount
  }, [refetch]);

  useEffect(() => {
    if (!nativeHeader || !onNavigationChange) return;
    onNavigationChange(selectedRequest
      ? { screen: 'detail', title: selectedRequest.title, onBack: handleBack }
      : isAdding
        ? { screen: 'create', title: strings.newRequest, onBack: () => setIsAdding(false) }
        : { screen: 'list', title: strings.title, onBack: onClose ?? (() => {}) });
  }, [nativeHeader, onNavigationChange, selectedRequest, isAdding, strings, handleBack, onClose]);

  const handleAddComment = useCallback(
    async (content: string) => {
      if (!voterId || !selectedRequest) throw new Error('Comment author is not ready');
      setIsSubmittingComment(true);
      try {
        const comment = await client.addComment(selectedRequest.id, {
          content,
          authorIdentifier: voterId,
        });
        setComments((prev) => [...prev, { ...comment, isOwn: true }]);
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
      if (!voterId || !selectedRequest || commentVotingIdsRef.current.has(commentId)) return;

      commentVotingIdsRef.current.add(commentId);
      setCommentVotingIds((prev) => new Set(prev).add(commentId));
      try {
        const { comment: updated } = await client.toggleCommentVote(
          selectedRequest.id,
          commentId,
          voterId
        );
        setComments((prev) =>
          prev.map((c) => (c.id === commentId
            ? { ...updated, isOwn: updated.isOwn ?? c.isOwn }
            : c))
        );
      } catch {
        Alert.alert(strings.error, strings.mutationError);
      } finally {
        commentVotingIdsRef.current.delete(commentId);
        setCommentVotingIds((prev) => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
      }
    },
    [voterId, selectedRequest, client, strings]
  );

  const handleToggleRequestVoteInDetail = useCallback(async () => {
    if (!voterId || !selectedRequest || votingIdsRef.current.has(selectedRequest.id)) return;
    if (!selectedRequest.isApproved) return;

    const requestId = selectedRequest.id;
    votingIdsRef.current.add(requestId);
    setVotingIds((prev) => new Set(prev).add(requestId));
    try {
      const { request: updated, isVoting } = await client.toggleVote(requestId, voterId);
      setSelectedRequest((current) => current?.id === requestId ? { ...updated, hasVoted: isVoting } : current);
    } catch {
      Alert.alert(strings.error, strings.mutationError);
    } finally {
      votingIdsRef.current.delete(requestId);
      setVotingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  }, [voterId, selectedRequest, client, strings]);

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
            locale={locale}
            strings={strings}
            insetTop={insets.top}
            insetBottom={insets.bottom}
            keyboardVerticalOffset={effectiveKeyboardOffset}
            nativeHeader={nativeHeader}
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
            nativeHeader={nativeHeader}
            onSubmit={handleSubmit}
            onCancel={() => setIsAdding(false)}
          />
        ) : (
          <>
            {!nativeHeader && <Header strings={strings} onClose={onClose} insetTop={insets.top} />}
            <FilterTabs
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              strings={strings}
            />
            <RequestList
              data={data}
              isLoading={voterId === null ? voterIdError === null : isLoading}
              error={voterIdError ?? error}
              votingIds={votingIds}
              strings={strings}
              safeAreaBottom={insets.bottom}
              onToggleVote={handleToggleVote}
              onRefetch={handleRefetch}
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
