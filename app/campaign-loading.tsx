import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { MockCampaignService } from '@/services/campaign/MockCampaignService';
import type { CampaignService } from '@/services/campaign/CampaignService';
import { useCampaignStore } from '@/stores/campaignStore';
import { useShowStore } from '@/stores/showStore';
import type { Campaign } from '@/types/campaign';
import type { Show } from '@/types/show';

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

/** Used only if the user reaches this screen without a show in the store. */
const FALLBACK_SHOW: Show = {
  venue: 'Your Venue',
  city: 'Your City',
  date: 'your show date',
  time: '8:00 PM',
  ticketPrice: 0,
  ticketLink: 'https://tickets.example.com',
  openingActs: [],
  genre: '',
  notes: '',
};

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
    campaignService.generate(currentShow ?? FALLBACK_SHOW).then((result) => {
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
            <View style={styles.successCircle}>
              <View style={styles.check} />
            </View>
            <Text variant="heading">Campaign Ready</Text>
          </View>

          <Button
            label="Review Campaign"
            variant="primary"
            onPress={() => router.replace('/campaign')}
          />
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
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
