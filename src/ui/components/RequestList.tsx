import type { JSX } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { RequestCard } from './RequestCard';
import type { FeatureRequest, PaginatedResponse } from '../../types';
import type { FeaturamaStrings } from '../strings/en';

interface RequestListProps {
  data: PaginatedResponse<FeatureRequest> | null;
  isLoading: boolean;
  error: Error | null;
  votingIds: Set<string>;
  strings: FeaturamaStrings;
  safeAreaBottom: number;
  onToggleVote: (id: string) => void;
  onRefetch: () => Promise<void>;
  onRequestPress: (request: FeatureRequest) => void;
}

export function RequestList({
  data,
  isLoading,
  error,
  votingIds,
  strings,
  safeAreaBottom,
  onToggleVote,
  onRefetch,
  onRequestPress,
}: RequestListProps): JSX.Element {
  const theme = useTheme();

  // Loading state (initial)
  if (isLoading && !data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  // Error state (no data)
  if (error && !data) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{strings.error}</Text>
        <TouchableOpacity onPress={onRefetch} style={[styles.retryButton, { backgroundColor: theme.accent }]}>
          <Text style={{ color: theme.accentForeground }}>{strings.retry}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (data && data.items.length === 0 && !isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{strings.empty}</Text>
        <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>{strings.emptyHint}</Text>
      </View>
    );
  }

  // Request list
  if (data && data.items.length > 0) {
    return (
      <FlatList
        data={data.items}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            isVoting={votingIds.has(item.id)}
            strings={strings}
            onToggleVote={onToggleVote}
            onPress={onRequestPress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: safeAreaBottom + 80 }]}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={onRefetch}
      />
    );
  }

  return <View />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});
