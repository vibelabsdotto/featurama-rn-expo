import type { JSX } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { PlusIcon } from '../icons';

interface FabProps {
  onPress: () => void;
  safeAreaBottom: number;
}

export function Fab({ onPress, safeAreaBottom }: FabProps): JSX.Element {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: theme.accent, bottom: safeAreaBottom + 24 }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <PlusIcon size={24} color={theme.accentForeground} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});
