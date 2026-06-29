import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { MusicNoteGlyph } from '@/components/ui/glyphs';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';

type EmptyStateAction = { label: string; onPress: () => void };

type EmptyStateProps = {
  /** Icon placeholder shown in the badge. Defaults to a music note. */
  icon?: ReactNode;
  title: string;
  message: string;
  action?: EmptyStateAction;
};

/**
 * Friendly, centered empty state: a soft icon badge, an encouraging headline,
 * supportive copy, and an optional call to action. Used anywhere a screen has
 * no content yet, so nothing ever reads as a blank or technical dead end.
 */
export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>{icon ?? <MusicNoteGlyph />}</View>

      <Text variant="heading" style={styles.title}>
        {title}
      </Text>

      <Text variant="body" color={colors.muted} style={styles.message}>
        {message}
      </Text>

      {action ? (
        <Button
          label={action.label}
          variant="primary"
          style={styles.action}
          onPress={action.onPress}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  action: {
    marginTop: spacing.md,
  },
});
