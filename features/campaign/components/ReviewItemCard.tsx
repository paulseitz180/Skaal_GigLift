import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';

export type ItemStatus = 'pending' | 'approved' | 'skipped';

type ReviewItemCardProps = {
  title: string;
  subtitle?: string;
  status: ItemStatus;
  isEditing: boolean;
  onApprove: () => void;
  onSkip: () => void;
  onEditToggle: () => void;
  children: ReactNode;
};

const STATUS_LABEL: Record<ItemStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  skipped: 'Skipped',
};

export function ReviewItemCard({
  title,
  subtitle,
  status,
  isEditing,
  onApprove,
  onSkip,
  onEditToggle,
  children,
}: ReviewItemCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="body" style={styles.title}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" color={colors.muted}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={[styles.pill, PILL_CONTAINER[status]]}>
          <Text variant="caption" color={PILL_TEXT[status]}>
            {STATUS_LABEL[status]}
          </Text>
        </View>
      </View>

      <View style={styles.body}>{children}</View>

      <View style={styles.actions}>
        <ActionButton label="Approve" active={status === 'approved'} onPress={onApprove} />
        <ActionButton label="Skip" active={status === 'skipped'} onPress={onSkip} />
        <ActionButton
          label={isEditing ? 'Done' : 'Edit'}
          active={isEditing}
          onPress={onEditToggle}
        />
      </View>
    </Card>
  );
}

type ActionButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function ActionButton({ label, active, onPress }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        active && styles.actionActive,
        pressed && styles.actionPressed,
      ]}
    >
      <Text variant="caption" color={active ? colors.onPrimary : colors.primary}>
        {label}
      </Text>
    </Pressable>
  );
}

const PILL_CONTAINER: Record<ItemStatus, { backgroundColor: string }> = {
  pending: { backgroundColor: colors.border },
  approved: { backgroundColor: colors.primary },
  skipped: { backgroundColor: colors.disabled },
};

const PILL_TEXT: Record<ItemStatus, string> = {
  pending: colors.muted,
  approved: colors.onPrimary,
  skipped: colors.text,
};

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontWeight: '600',
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  body: {
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  actionActive: {
    backgroundColor: colors.primary,
  },
  actionPressed: {
    opacity: 0.7,
  },
});
