import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import type { Fan } from '@/types/fan';

type FanRowProps = {
  fan: Fan;
  onPress: () => void;
};

/** A tappable fan summary: avatar, name, email, location, tags, and score. */
export function FanRow({ fan, onPress }: FanRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${fan.name}`}
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
    >
      <Card style={styles.card}>
        <Avatar name={fan.name} />

        <View style={styles.info}>
          <Text variant="body" style={styles.name}>
            {fan.name}
          </Text>
          <Text variant="caption" color={colors.muted}>
            {fan.email}
          </Text>
          <Text variant="caption" color={colors.muted}>
            {fan.location}
          </Text>

          {fan.tags.length > 0 ? (
            <View style={styles.tags}>
              {fan.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text variant="caption" color={colors.primary}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.score}>
          <Text variant="heading" color={colors.primary}>
            {fan.engagementScore}
          </Text>
          <Text variant="caption" color={colors.muted}>
            score
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
  },
  score: {
    alignItems: 'center',
  },
});
