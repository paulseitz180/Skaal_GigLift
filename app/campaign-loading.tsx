import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { SuccessCheck } from '@/components/ui/SuccessCheck';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { MockCampaignService } from '@/services/campaign/MockCampaignService';
import { DemoDataService } from '@/services/demo/DemoDataService';
import type { CampaignService } from '@/services/campaign/CampaignService';
import { useCampaignStore } from '@/stores/campaignStore';
import { useShowStore } from '@/stores/showStore';
import type { Campaign } from '@/types/campaign';

const MESSAGES = [
  'Writing your emails...',
  'Creating Instagram posts...',
  'Generating press release...',
  'Building timeline...',
  'Preparing campaign...',
];

const MESSAGE_INTERVAL_MS = 2000;
const READY_AFTER_MS = 8000;

const campaignService: CampaignService = new MockCampaignService();

export default function CampaignLoadingScreen() {
  const router = useRouter();
  const currentShow = useShowStore((state) => state.currentShow);
  const setStoreCampaign = useCampaignStore((state) => state.setCampaign);

  const [messageIndex, setMessageIndex] = useState(0);
  const [timerDone, setTimerDone] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);

    const timeout = setTimeout(() => {
      setTimerDone(true);
      clearInterval(interval);
    }, READY_AFTER_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    let active = true;
    campaignService.generate(currentShow ?? DemoDataService.fallbackShow).then((result) => {
      if (active) {
        setCampaign(result);
        setStoreCampaign(result);
      }
    });
    return () => {
      active = false;
    };
  }, [currentShow, setStoreCampaign]);

  const isReady = timerDone && campaign !== null;

  return (
    <View style={styles.container}>
      {isReady ? (
        <>
          <View style={styles.readyBlock}>
            <SuccessCheck />
            <Animated.View entering={FadeInDown.delay(200).duration(400)}>
              <Text variant="heading">Campaign Ready</Text>
            </Animated.View>
          </View>

          <Animated.View entering={FadeInUp.delay(350).duration(400)}>
            <Button
              label="Review Campaign"
              variant="primary"
              onPress={() => router.replace('/campaign')}
            />
          </Animated.View>
        </>
      ) : (
        <View style={styles.loadingBlock}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="body" color={colors.muted} style={styles.message}>
            {MESSAGES[messageIndex] ?? ''}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
    gap: spacing.xl,
  },
  loadingBlock: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  message: {
    textAlign: 'center',
  },
  readyBlock: {
    alignItems: 'center',
    gap: spacing.md,
  },
});
