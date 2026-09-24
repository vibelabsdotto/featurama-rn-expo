// Card Component - Styled card container

import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { useThemeStore } from '@stores/themeStore';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  padding = 'medium',
}) => {
  const colors = useThemeStore((state) => state.colors);

  const paddingValue = {
    none: 0,
    small: 8,
    medium: 16,
    large: 24,
  }[padding];

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
      padding: paddingValue,
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...cardStyle,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
