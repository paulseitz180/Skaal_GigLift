import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/constants/colors';

const BARS = [
  { id: 'bar-1', delay: 0 },
  { id: 'bar-2', delay: 120 },
  { id: 'bar-3', delay: 240 },
  { id: 'bar-4', delay: 360 },
  { id: 'bar-5', delay: 240 },
  { id: 'bar-6', delay: 120 },
  { id: 'bar-7', delay: 0 },
];

const REST_SCALE = 0.4;

type WaveformProps = {
  active: boolean;
};

export function Waveform({ active }: WaveformProps) {
  return (
    <View style={styles.container}>
      {BARS.map((bar) => (
        <WaveBar key={bar.id} delay={bar.delay} active={active} />
      ))}
    </View>
  );
}

type WaveBarProps = {
  delay: number;
  active: boolean;
};

function WaveBar({ delay, active }: WaveBarProps) {
  const scale = useSharedValue(REST_SCALE);

  useEffect(() => {
    if (active) {
      scale.value = withDelay(delay, withRepeat(withTiming(1, { duration: 450 }), -1, true));
    } else {
      cancelAnimation(scale);
      scale.value = withTiming(REST_SCALE, { duration: 200 });
    }
  }, [active, delay, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scale.value }],
  }));

  return <Animated.View style={[styles.bar, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    gap: 8,
  },
  bar: {
    width: 6,
    height: 48,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
});
