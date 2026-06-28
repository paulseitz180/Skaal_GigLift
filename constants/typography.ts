import type { TextStyle } from 'react-native';

/**
 * Type scale. Each variant is a complete text style that can be spread
 * onto a Text component.
 */
export const typography = {
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
  },
  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
