import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { shadows } from '@/constants/shadows';
import { spacing } from '@/constants/spacing';
import { getCurrentArtist } from '@/services/artistService';

// Fan counting is not implemented yet; show a placeholder value.
const PLACEHOLDER_FAN_COUNT = 0;

export default function HomeDashboardScreen() {
  const router = useRouter();
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greetingBlock}>
          <Text variant="heading">Hey {greetingName}</Text>
          <Text variant="body" color={colors.muted}>
            {"What's your next show?"}
          </Text>
        </View>

        <View style={styles.fanBadge}>
          <Text variant="caption" color={colors.onPrimary}>
            {PLACEHOLDER_FAN_COUNT} fans
          </Text>
        </View>
      </View>

      <View style={styles.center}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tell GigLift about your next show"
          onPress={() => router.push('/voice-input')}
          style={({ pressed }) => [styles.mic, pressed && styles.micPressed]}
        >
          <View style={styles.micBody} />
          <View style={styles.micStem} />
          <View style={styles.micBase} />
        </Pressable>

        <Text variant="body" color={colors.muted} style={styles.caption}>
          Tap to tell GigLift about your next show
        </Text>
      </View>

      <Button
        label="Or Enter Show Manually"
        variant="ghost"
        onPress={() => router.push('/review')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greetingBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  fanBadge: {
    marginLeft: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
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
  micBody: {
    width: 30,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.onPrimary,
  },
  micStem: {
    width: 4,
    height: 14,
    marginTop: 4,
    backgroundColor: colors.onPrimary,
  },
  micBase: {
    width: 34,
    height: 4,
    marginTop: 2,
    borderRadius: 2,
    backgroundColor: colors.onPrimary,
  },
  caption: {
    textAlign: 'center',
  },
});
