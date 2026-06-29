import { useRouter, type Href } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';

type NextHeaderButtonProps = {
  /** Where the guided demo advances to next. */
  to: Href;
  /** Short label naming the next stage (e.g. "Social"). */
  label: string;
};

/**
 * Header-right "continue the tour" affordance. Pairs with the native header back
 * button (which acts as Previous) to give a clear Next/Previous flow across the
 * chained demo stages without crowding each screen's own controls.
 */
export function NextHeaderButton({ to, label }: NextHeaderButtonProps) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Next: ${label}`}
      hitSlop={8}
      onPress={() => router.push(to)}
    >
      <Text variant="body" color={colors.primary} style={styles.label}>
        {label} ›
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
  },
});
