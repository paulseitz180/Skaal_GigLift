import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { MicIcon } from '@/components/ui/MicIcon';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Waveform } from '@/features/voice/components/Waveform';
import { useFakeRecording } from '@/features/voice/hooks/useFakeRecording';
import type { ExtractionService } from '@/services/ai/ExtractionService';
import { MockExtractionService } from '@/services/ai/MockExtractionService';
import { useShowStore } from '@/stores/showStore';

// Swappable behind the ExtractionService interface; mock for the prototype.
const extractionService: ExtractionService = new MockExtractionService();

export function VoiceRecorder() {
  const router = useRouter();
  const setCurrentShow = useShowStore((state) => state.setCurrentShow);

  const { transcript, isRecording, isProcessing, stop } = useFakeRecording({
    onFinish: async (finalTranscript) => {
      const show = await extractionService.extract(finalTranscript);
      setCurrentShow(show);
      router.replace('/review');
    },
  });

  const pulse = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      pulse.value = withRepeat(withTiming(1.12, { duration: 700 }), -1, true);
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(1, { duration: 250 });
    }
  }, [isRecording, pulse]);

  const micStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          hitSlop={8}
          disabled={isProcessing}
        >
          <Text variant="body" color={colors.onPrimary}>
            Cancel
          </Text>
        </Pressable>
      </View>

      <View style={styles.center}>
        <Animated.View style={[styles.mic, micStyle]}>
          <MicIcon />
        </Animated.View>

        <Waveform active={isRecording} />

        <View style={styles.transcriptArea}>
          <Text variant="body" color={colors.onPrimary} style={styles.transcript}>
            {isProcessing ? 'Processing...' : transcript}
          </Text>
        </View>
      </View>

      <Button label="Stop Recording" variant="primary" onPress={stop} disabled={isProcessing} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.recordingBackground,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  topBar: {
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  mic: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transcriptArea: {
    minHeight: 72,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  transcript: {
    textAlign: 'center',
  },
});
