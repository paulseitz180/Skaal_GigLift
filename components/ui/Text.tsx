import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';

import { colors } from '@/constants/colors';
import { typography, type TypographyVariant } from '@/constants/typography';

type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: string;
};

export function Text({ variant = 'body', color = colors.text, style, ...rest }: TextProps) {
  return <RNText style={[styles[variant], { color }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  display: typography.display,
  heading: typography.heading,
  body: typography.body,
  caption: typography.caption,
});
