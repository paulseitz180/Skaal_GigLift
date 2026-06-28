import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { shadows } from '@/constants/shadows';
import { spacing } from '@/constants/spacing';

type CardProps = ViewProps;

export function Card({ style, ...rest }: CardProps) {
  return <View style={[styles.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
});
