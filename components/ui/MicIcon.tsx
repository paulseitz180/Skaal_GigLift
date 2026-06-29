import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

/**
 * Microphone glyph (body, stem, base) drawn with plain views. Render inside a
 * centered circular container. Shared by the Home dashboard and the voice
 * recorder so the icon stays identical in both places.
 */
export function MicIcon() {
  return (
    <>
      <View style={styles.body} />
      <View style={styles.stem} />
      <View style={styles.base} />
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    width: 30,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.onPrimary,
  },
  stem: {
    width: 4,
    height: 14,
    marginTop: 4,
    backgroundColor: colors.onPrimary,
  },
  base: {
    width: 34,
    height: 4,
    marginTop: 2,
    borderRadius: 2,
    backgroundColor: colors.onPrimary,
  },
});
