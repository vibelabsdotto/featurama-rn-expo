import type { JSX } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { CloseIcon } from '../icons';
import type { FeaturamaStrings } from '../strings/en';

interface HeaderProps {
  strings: FeaturamaStrings;
  onClose?: () => void;
  insetTop: number;
}

export function Header({ strings, onClose, insetTop }: HeaderProps): JSX.Element {
  const theme = useTheme();

  return (
    <View style={[styles.header, { paddingTop: insetTop + 8, borderColor: theme.border }]}>
      {onClose ? (
        <TouchableOpacity onPress={onClose} style={styles.headerButton}
          accessibilityRole="button" accessibilityLabel={strings.close}>
          <CloseIcon size={22} color={theme.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButton} />
      )}
      <Text style={[styles.headerTitle, { color: theme.text }]}>{strings.title}</Text>
      <View style={styles.headerButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    minHeight: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    padding: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
});
