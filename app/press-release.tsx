import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { DemoDataService } from '@/services/demo/DemoDataService';
import { useShowStore } from '@/stores/showStore';
import type { PressRelease } from '@/types/pressRelease';

type EditableField = 'headline' | 'subheadline' | 'body' | 'quote' | 'bio' | 'mediaContact';

const COPIED_FEEDBACK_MS = 2000;

export default function PressReleaseScreen() {
  const currentShow = useShowStore((state) => state.currentShow);

  const [release, setRelease] = useState<PressRelease>(() =>
    DemoDataService.buildPressRelease(currentShow ?? DemoDataService.fallbackShow),
  );
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
    };
  }, []);

  const updateField = (field: EditableField, value: string) =>
    setRelease((prev) => ({ ...prev, [field]: value }));

  const handleCopy = () => {
    // Prototype only: no clipboard, export, or networking, just visible feedback.
    setCopied(true);
    if (copyTimer.current) {
      clearTimeout(copyTimer.current);
    }
    copyTimer.current = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text variant="caption" color={colors.muted} style={styles.eyebrow}>
          FOR IMMEDIATE RELEASE
        </Text>

        {editing ? (
          <>
            <Input
              label="Headline"
              value={release.headline}
              multiline
              onChangeText={(value) => updateField('headline', value)}
            />
            <Input
              label="Subheadline"
              value={release.subheadline}
              multiline
              onChangeText={(value) => updateField('subheadline', value)}
            />
            <Input
              label="Body"
              value={release.body}
              multiline
              style={styles.bodyInput}
              onChangeText={(value) => updateField('body', value)}
            />
            <Input
              label="Artist Quote"
              value={release.quote}
              multiline
              onChangeText={(value) => updateField('quote', value)}
            />
            <Input
              label="Bio"
              value={release.bio}
              multiline
              onChangeText={(value) => updateField('bio', value)}
            />
            <Input
              label="Media Contact"
              value={release.mediaContact}
              multiline
              onChangeText={(value) => updateField('mediaContact', value)}
            />
          </>
        ) : (
          <>
            <Text variant="display" style={styles.headline}>
              {release.headline}
            </Text>

            <Text variant="heading" color={colors.muted} style={styles.subheadline}>
              {release.subheadline}
            </Text>

            <Text variant="body" style={styles.lead}>
              <Text variant="body" style={styles.dateline}>
                {release.dateline}{' '}
              </Text>
              {release.body}
            </Text>

            <View style={styles.quoteBlock}>
              <Text variant="body" style={styles.quote}>
                {release.quote}
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="caption" color={colors.muted} style={styles.sectionLabel}>
                SHOW DETAILS
              </Text>
              {release.showDetails.map((detail) => (
                <View key={detail.label} style={styles.detailRow}>
                  <Text variant="body" color={colors.muted} style={styles.detailLabel}>
                    {detail.label}
                  </Text>
                  <Text variant="body" style={styles.detailValue}>
                    {detail.value}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text variant="caption" color={colors.muted} style={styles.sectionLabel}>
                ABOUT {release.showDetails[0]?.value.toUpperCase() ?? 'THE ARTIST'}
              </Text>
              <Text variant="body" style={styles.paragraph}>
                {release.bio}
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="caption" color={colors.muted} style={styles.sectionLabel}>
                MEDIA CONTACT
              </Text>
              <Text variant="body" style={styles.paragraph}>
                {release.mediaContact}
              </Text>
            </View>

            <Text variant="body" color={colors.muted} style={styles.endMark}>
              ###
            </Text>
          </>
        )}
      </ScrollView>

      <View style={styles.toolbar}>
        <Button
          label={copied ? 'Copied!' : 'Copy'}
          variant="secondary"
          onPress={handleCopy}
          style={styles.toolbarButton}
        />
        <Button
          label={editing ? 'Done' : 'Edit'}
          variant="ghost"
          onPress={() => setEditing((prev) => !prev)}
          style={styles.toolbarButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  eyebrow: {
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  headline: {
    fontWeight: '700',
  },
  subheadline: {
    fontStyle: 'italic',
  },
  lead: {
    marginTop: spacing.sm,
    lineHeight: 26,
  },
  dateline: {
    fontWeight: '700',
  },
  quoteBlock: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.md,
    marginVertical: spacing.sm,
  },
  quote: {
    fontStyle: 'italic',
    lineHeight: 26,
  },
  section: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  sectionLabel: {
    fontWeight: '700',
    letterSpacing: 1,
  },
  detailRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  detailLabel: {
    width: 84,
  },
  detailValue: {
    flex: 1,
    fontWeight: '600',
  },
  paragraph: {
    lineHeight: 24,
  },
  endMark: {
    textAlign: 'center',
    marginTop: spacing.md,
    letterSpacing: 2,
  },
  bodyInput: {
    minHeight: 160,
  },
  toolbar: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  toolbarButton: {
    flex: 1,
  },
});
