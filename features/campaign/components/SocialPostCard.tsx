import { StyleSheet, View } from 'react-native';

import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { splitSocialPost } from '@/utils/campaign';

type SocialPostCardProps = {
  platformLabel: string;
  iconLabel: string;
  brandColor: string;
  post: string;
  charLimit: number;
  isEditing: boolean;
  onChangeText: (value: string) => void;
};

/**
 * A single social post rendered as a platform-styled preview card: brand icon,
 * caption, hashtag chips, and a live character count. Editing swaps the caption
 * for a multiline input bound to the full post text.
 */
export function SocialPostCard({
  platformLabel,
  iconLabel,
  brandColor,
  post,
  charLimit,
  isEditing,
  onChangeText,
}: SocialPostCardProps) {
  const { caption, hashtags } = splitSocialPost(post);
  const overLimit = post.length > charLimit;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: brandColor }]}>
          <Text variant="caption" color={colors.onPrimary} style={styles.iconLabel}>
            {iconLabel}
          </Text>
        </View>
        <Text variant="body" style={styles.platform}>
          {platformLabel}
        </Text>
      </View>

      <View style={styles.divider} />

      {isEditing ? (
        <Input
          label="Caption"
          value={post}
          multiline
          style={styles.input}
          onChangeText={onChangeText}
        />
      ) : (
        <>
          <Text variant="body" style={styles.caption}>
            {caption}
          </Text>

          {hashtags.length > 0 ? (
            <View style={styles.hashtags}>
              {hashtags.map((tag) => (
                <View key={tag} style={styles.chip}>
                  <Text variant="caption" color={colors.primary}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </>
      )}

      <View style={styles.footer}>
        <Text variant="caption" color={overLimit ? colors.danger : colors.muted}>
          {post.length} / {charLimit} characters
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    fontWeight: '700',
  },
  platform: {
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  caption: {
    lineHeight: 24,
  },
  hashtags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    minHeight: 140,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
