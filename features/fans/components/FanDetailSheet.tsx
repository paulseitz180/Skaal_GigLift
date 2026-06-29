import { Modal, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import type { Fan } from '@/types/fan';

type FanDetailSheetProps = {
  fan: Fan | null;
  onClose: () => void;
};

/** Bottom sheet showing the full fan profile. Read-only — no CRUD. */
export function FanDetailSheet({ fan, onClose }: FanDetailSheetProps) {
  return (
    <Modal visible={fan !== null} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Card style={styles.sheet}>
          {fan ? (
            <>
              <View style={styles.header}>
                <Avatar name={fan.name} size={64} />
                <View style={styles.headerText}>
                  <Text variant="heading">{fan.name}</Text>
                  <Text variant="caption" color={colors.muted}>
                    {fan.email}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text variant="caption" color={colors.muted}>
                  Location
                </Text>
                <Text variant="body">{fan.location}</Text>
              </View>

              <View style={styles.scoreBlock}>
                <View style={styles.scoreLabelRow}>
                  <Text variant="caption" color={colors.muted}>
                    Engagement
                  </Text>
                  <Text variant="caption" color={colors.primary}>
                    {fan.engagementScore}/100
                  </Text>
                </View>
                <View style={styles.scoreTrack}>
                  <View style={[styles.scoreFill, { width: `${fan.engagementScore}%` }]} />
                </View>
              </View>

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

              <Button label="Close" variant="primary" onPress={onClose} />
            </>
          ) : null}
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  sheet: {
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  detailRow: {
    gap: spacing.xs,
  },
  scoreBlock: {
    gap: spacing.sm,
  },
  scoreLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreTrack: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
  },
});
