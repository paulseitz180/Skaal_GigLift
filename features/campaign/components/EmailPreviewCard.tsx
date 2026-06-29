import { ScrollView, StyleSheet, View } from 'react-native';

import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';

type EmailPreviewCardProps = {
  /** Full page width so the card fills one horizontal paging slot. */
  width: number;
  stage: string;
  position: string;
  fromName: string;
  subject: string;
  body: string;
  signatureName: string;
  isEditing: boolean;
  onChangeSubject: (value: string) => void;
};

/** Inbox-style snippet derived from the body, the way a mail client shows it. */
function toPreviewText(body: string): string {
  const flat = body.replace(/\s+/g, ' ').trim();
  return flat.length > 90 ? `${flat.slice(0, 90)}…` : flat;
}

/**
 * A single email rendered to resemble an open message in an iPhone mail client:
 * sender row, subject, preview snippet, scrollable body, and artist signature.
 */
export function EmailPreviewCard({
  width,
  stage,
  position,
  fromName,
  subject,
  body,
  signatureName,
  isEditing,
  onChangeSubject,
}: EmailPreviewCardProps) {
  const initial = fromName.charAt(0).toUpperCase();

  return (
    <View style={[styles.page, { width }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.metaRow}>
          <Text variant="caption" color={colors.primary} style={styles.stage}>
            {stage}
          </Text>
          <Text variant="caption" color={colors.muted}>
            {position}
          </Text>
        </View>

        <View style={styles.fromRow}>
          <View style={styles.avatar}>
            <Text variant="body" color={colors.onPrimary} style={styles.avatarText}>
              {initial}
            </Text>
          </View>
          <View style={styles.fromText}>
            <Text variant="body" style={styles.fromName}>
              {fromName}
            </Text>
            <Text variant="caption" color={colors.muted}>
              to: Your Fans
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {isEditing ? (
          <Input label="Subject" value={subject} onChangeText={onChangeSubject} />
        ) : (
          <Text variant="heading" style={styles.subject}>
            {subject}
          </Text>
        )}

        <Text variant="caption" color={colors.muted} style={styles.preview}>
          {toPreviewText(body)}
        </Text>

        <View style={styles.divider} />

        <Text variant="body" style={styles.body}>
          {body}
        </Text>

        <View style={styles.signature}>
          <Text variant="body" color={colors.muted}>
            —
          </Text>
          <Text variant="body" style={styles.signatureName}>
            {signatureName}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  stage: {
    fontWeight: '600',
  },
  fromRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '600',
  },
  fromText: {
    flex: 1,
    gap: spacing.xs,
  },
  fromName: {
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  subject: {
    marginBottom: spacing.xs,
  },
  preview: {
    marginTop: spacing.xs,
  },
  body: {
    lineHeight: 24,
  },
  signature: {
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  signatureName: {
    fontWeight: '600',
  },
});
