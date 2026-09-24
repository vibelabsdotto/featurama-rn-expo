import type { JSX } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { FeaturamaLogoIcon } from '../icons/FeaturamaLogoIcon';

interface BrandingProps {
  safeAreaBottom: number;
}

export function Branding({ safeAreaBottom }: BrandingProps): JSX.Element {
  const theme = useTheme();

  return (
    <View style={[styles.wrapper, { bottom: safeAreaBottom + 36 }]} pointerEvents="box-none">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => Linking.openURL('https://featurama.app')}
        style={[styles.badge, { backgroundColor: theme.gray100 }]}
      >
        <FeaturamaLogoIcon size={16} color={theme.accent} />
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          Powered by Featurama
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
  },
});
