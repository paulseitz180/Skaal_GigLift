import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SuccessCheck } from '@/components/ui/SuccessCheck';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useShowStore } from '@/stores/showStore';
import { fieldToPartial, toFields, type EditableField } from '@/utils/showFields';

export default function ReviewScreen() {
  const router = useRouter();
  const currentShow = useShowStore((state) => state.currentShow);
  const updateShow = useShowStore((state) => state.updateShow);
  const reducedMotion = useReducedMotion();

  const [completing, setCompleting] = useState(false);

  const fields = useMemo(() => (currentShow ? toFields(currentShow) : []), [currentShow]);

  const handleSaveField = (key: string, value: string) => {
    updateShow(fieldToPartial(key, value));
  };

  const handleLooksGood = () => {
    // Brief "Review Complete" confirmation, then continue to campaign building.
    setCompleting(true);
    setTimeout(() => router.push('/campaign-loading'), reducedMotion ? 150 : 500);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="heading" style={styles.title}>
          Your Show Details
        </Text>

        {fields.length > 0 ? (
          <Card>
            {fields.map((field, index) => (
              <FieldRow
                key={field.key}
                field={field}
                isLast={index === fields.length - 1}
                onSave={handleSaveField}
              />
            ))}
          </Card>
        ) : (
          <Card>
            <Text variant="body" color={colors.muted}>
              Tell GigLift about your show and these details will fill in automatically.
            </Text>
          </Card>
        )}

        <View style={styles.actions}>
          <Button
            label="Looks Good"
            variant="primary"
            disabled={completing}
            onPress={handleLooksGood}
          />
          <Button label="Edit All" variant="ghost" />
        </View>
      </ScrollView>

      {completing ? (
        <Animated.View entering={FadeIn.duration(200)} style={styles.successOverlay}>
          <SuccessCheck />
          <Text variant="heading" style={styles.successText}>
            Looks great!
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

type FieldRowProps = {
  field: EditableField;
  isLast: boolean;
  onSave: (key: string, value: string) => void;
};

function FieldRow({ field, isLast, onSave }: FieldRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(field.value);
  const [error, setError] = useState<string | undefined>(undefined);

  const startEditing = () => {
    setDraft(field.value);
    setError(undefined);
    setIsEditing(true);
  };

  const commit = () => {
    if (field.required && draft.trim().length === 0) {
      setError(`${field.label} is required.`);
      return;
    }
    setError(undefined);
    onSave(field.key, draft);
    setIsEditing(false);
  };

  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <View style={styles.rowText}>
        <Text variant="caption" color={colors.muted}>
          {field.label}
          {field.required ? ' *' : ''}
        </Text>

        {isEditing ? (
          <>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              autoFocus
              multiline={field.multiline}
              style={[
                styles.input,
                field.multiline && styles.inputMultiline,
                error && styles.inputError,
              ]}
              placeholderTextColor={colors.muted}
              onSubmitEditing={field.multiline ? undefined : commit}
              returnKeyType="done"
            />
            {error ? (
              <Text variant="caption" color={colors.danger} style={styles.error}>
                {error}
              </Text>
            ) : null}
          </>
        ) : (
          <Text variant="body">{field.value || '—'}</Text>
        )}
      </View>

      <Pressable
        onPress={isEditing ? commit : startEditing}
        accessibilityRole="button"
        accessibilityLabel={isEditing ? `Save ${field.label}` : `Edit ${field.label}`}
        hitSlop={8}
        style={styles.iconButton}
      >
        {isEditing ? <CheckIcon /> : <PencilIcon />}
      </Pressable>
    </View>
  );
}

function PencilIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={styles.pencil}>
        <View style={styles.pencilBody} />
        <View style={styles.pencilTip} />
      </View>
    </View>
  );
}

function CheckIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={styles.check} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  successText: {
    textAlign: 'center',
  },
  title: {
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
    paddingRight: spacing.md,
  },
  input: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    marginTop: spacing.xs,
  },
  actions: {
    gap: spacing.md,
  },
  iconButton: {
    paddingTop: spacing.md,
  },
  iconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pencil: {
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  pencilBody: {
    width: 5,
    height: 12,
    borderRadius: 1,
    backgroundColor: colors.muted,
  },
  pencilTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 2.5,
    borderRightWidth: 2.5,
    borderTopWidth: 4,
    borderLeftColor: colors.transparent,
    borderRightColor: colors.transparent,
    borderTopColor: colors.muted,
  },
  check: {
    width: 7,
    height: 13,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: colors.primary,
    transform: [{ rotate: '45deg' }],
  },
});
