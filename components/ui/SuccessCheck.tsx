import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';

/**
 * Animated success badge: a circular mark that springs in with a checkmark.
 * Entrance is ~400ms and respects the system reduce-motion setting (Reanimated
 * entering animations default to ReduceMotion.System). Shared by every "done"
 * moment so success always looks the same.
 */
export function SuccessCheck() {
  return (
    <Animated.View entering={ZoomIn.duration(400).springify().damping(12)} style={styles.circle}>
      <View style={styles.check} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 16,
    height: 28,
    marginBottom: 4,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: colors.onPrimary,
    transform: [{ rotate: '45deg' }],
  },
});
