import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';

type InputProps = TextInputProps & {
  label: string;
  required?: boolean;
  error?: string;
};

type FocusEvent = Parameters<NonNullable<TextInputProps['onFocus']>>[0];
type BlurEvent = Parameters<NonNullable<TextInputProps['onBlur']>>[0];

export function Input({
  label,
  required = false,
  error,
  multiline,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  const handleFocus = (event: FocusEvent) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: BlurEvent) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <View style={styles.container}>
      <Text variant="caption" color={colors.muted} style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>

      <TextInput
        style={[styles.input, multiline && styles.multiline, { borderColor }, style]}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />

      {error ? (
        <Text variant="caption" color={colors.danger} style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  error: {
    marginTop: spacing.xs,
  },
});
