import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

/**
 * Simple, view-drawn icon placeholders for empty states. No images — just
 * design-system colored shapes that read at a glance (note, envelope, calendar,
 * post bubble). Sized to sit inside the EmptyState badge.
 */
export function MusicNoteGlyph() {
  return (
    <View style={styles.noteRow}>
      <View style={styles.noteHead} />
      <View style={styles.noteStem} />
    </View>
  );
}

export function EnvelopeGlyph() {
  return (
    <View style={styles.envelope}>
      <View style={styles.flapRow}>
        <View style={[styles.flapBar, styles.flapLeft]} />
        <View style={[styles.flapBar, styles.flapRight]} />
      </View>
    </View>
  );
}

export function CalendarGlyph() {
  return (
    <View style={styles.calendar}>
      <View style={styles.calendarTop} />
      <View style={styles.calendarBody} />
    </View>
  );
}

export function PostBubbleGlyph() {
  return (
    <View style={styles.bubble}>
      <View style={styles.dotsRow}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteHead: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginTop: 20,
  },
  noteStem: {
    width: 3,
    height: 36,
    borderRadius: 1.5,
    backgroundColor: colors.primary,
  },
  envelope: {
    width: 46,
    height: 32,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 6,
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 3,
  },
  flapRow: {
    flexDirection: 'row',
  },
  flapBar: {
    width: 24,
    height: 2,
    backgroundColor: colors.primary,
  },
  flapLeft: {
    transform: [{ rotate: '28deg' }],
  },
  flapRight: {
    marginLeft: -2,
    transform: [{ rotate: '-28deg' }],
  },
  calendar: {
    width: 36,
    height: 36,
  },
  calendarTop: {
    height: 9,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: colors.primary,
  },
  calendarBody: {
    flex: 1,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: colors.primary,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  bubble: {
    width: 46,
    height: 34,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
});
