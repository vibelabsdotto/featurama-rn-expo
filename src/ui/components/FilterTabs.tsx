import type { JSX } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import type { RequestFilter } from '../../types';
import type { FeaturamaStrings } from '../strings/en';

interface FilterTabsProps {
  activeFilter: RequestFilter;
  onFilterChange: (filter: RequestFilter) => void;
  strings: FeaturamaStrings;
}

const FILTERS: { key: RequestFilter; stringKey: keyof FeaturamaStrings }[] = [
  { key: 'new', stringKey: 'filterNew' },
  { key: 'in_progress', stringKey: 'filterInProgress' },
  { key: 'done', stringKey: 'filterDone' },
];

export function FilterTabs({ activeFilter, onFilterChange, strings }: FilterTabsProps): JSX.Element {
  const theme = useTheme();

  return (
    <View style={styles.filterContainer}>
      <View style={[styles.segmentedControl, { backgroundColor: theme.gray100 }]}>
        {FILTERS.map(({ key, stringKey }) => (
          <Pressable
            key={key}
            style={[
              styles.segment,
              activeFilter === key && [styles.segmentActive, { backgroundColor: theme.card }],
            ]}
            onPress={() => onFilterChange(key)}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeFilter === key ? theme.text : theme.textSecondary },
              ]}
            >
              {strings[stringKey]}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  segmentActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
