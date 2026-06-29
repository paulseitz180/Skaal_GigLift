import { StyleSheet } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { useCountUp } from '@/hooks/useCountUp';

type MetricCardProps = {
  label: string;
  value: number;
  /** Span the full row instead of a half-width tile. */
  wide?: boolean;
};

/**
 * Dashboard metric tile: a large number that animates up from zero on mount,
 * with a caption label. Layout-only variants (half / wide) keep the grid tidy.
 */
export function MetricCard({ label, value, wide = false }: MetricCardProps) {
  const count = useCountUp(value);

  return (
    <Card style={[styles.card, wide ? styles.wide : styles.half]}>
      <Text variant="display" color={colors.primary}>
        {count.toLocaleString()}
      </Text>
      <Text variant="caption" color={colors.muted}>
        {label}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
  },
  half: {
    width: '48%',
  },
  wide: {
    width: '100%',
  },
});
