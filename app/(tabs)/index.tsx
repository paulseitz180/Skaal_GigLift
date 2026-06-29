import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { MetricCard } from '@/components/MetricCard';
import { Button } from '@/components/ui/Button';
import { MicIcon } from '@/components/ui/MicIcon';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { shadows } from '@/constants/shadows';
import { spacing } from '@/constants/spacing';
import { getCurrentArtist } from '@/services/artistService';
import { DemoDataService } from '@/services/demo/DemoDataService';
import { useShowStore } from '@/stores/showStore';

export default function HomeDashboardScreen() {
  const router = useRouter();
  const setCurrentShow = useShowStore((state) => state.setCurrentShow);
  const [artistName, setArtistName] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getCurrentArtist()
      .then((artist) => {
        if (isMounted) {
          setArtistName(artist?.name ?? null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setArtistName(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const greetingName = artistName ?? 'there';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.greetingBlock}>
        <Text variant="heading">Hey {greetingName}</Text>
        <Text variant="body" color={colors.muted}>
          {"Here's how your promotion is going."}
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        {DemoDataService.dashboardMetrics.map((metric) => (
          <MetricCard
            key={metric.key}
            label={metric.label}
            value={metric.value}
            wide={metric.wide}
          />
        ))}
      </View>

      <View style={styles.cta}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tell GigLift about your next show"
          onPress={() => router.push('/voice-input')}
          style={({ pressed }) => [styles.mic, pressed && styles.micPressed]}
        >
          <MicIcon />
        </Pressable>

        <Text variant="body" color={colors.muted} style={styles.caption}>
          Tap to tell GigLift about your next show
        </Text>
      </View>

      <Button
        label="Or Enter Show Manually"
        variant="ghost"
        onPress={() => {
          // Seed a draft show so the Review screen opens populated and editable.
          setCurrentShow(DemoDataService.primaryShow);
          router.push('/review');
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  greetingBlock: {
    gap: spacing.xs,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  cta: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  mic: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  micPressed: {
    opacity: 0.9,
  },
  caption: {
    textAlign: 'center',
  },
});
