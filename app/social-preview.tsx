import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PostBubbleGlyph } from '@/components/ui/glyphs';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { SocialPostCard } from '@/features/campaign/components/SocialPostCard';
import { MockCampaignService } from '@/services/campaign/MockCampaignService';
import { DemoDataService } from '@/services/demo/DemoDataService';
import { useCampaignStore } from '@/stores/campaignStore';
import { useShowStore } from '@/stores/showStore';
import type { Campaign } from '@/types/campaign';
import type { SocialField } from '@/utils/campaign';

type PlatformKey = 'instagram' | 'facebook' | 'x';

type PlatformConfig = {
  key: PlatformKey;
  label: string;
  iconLabel: string;
  brandColor: string;
  field: SocialField;
  charLimit: number;
};

const PLATFORMS: PlatformConfig[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    iconLabel: 'IG',
    brandColor: colors.instagram,
    field: 'instagramPost',
    charLimit: 2200,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    iconLabel: 'f',
    brandColor: colors.facebook,
    field: 'facebookPost',
    charLimit: 63206,
  },
  {
    key: 'x',
    label: 'X',
    iconLabel: 'X',
    brandColor: colors.x,
    field: 'xPost',
    charLimit: 280,
  },
];

const COPIED_FEEDBACK_MS = 2000;

const campaignService = new MockCampaignService();

type SocialPosts = Record<SocialField, string>;

function postsFromCampaign(campaign: Campaign): SocialPosts {
  return {
    instagramPost: campaign.instagramPost,
    facebookPost: campaign.facebookPost,
    xPost: campaign.xPost,
  };
}

export default function SocialPreviewScreen() {
  const storeCampaign = useCampaignStore((state) => state.campaign);
  const currentShow = useShowStore((state) => state.currentShow);

  const [posts, setPosts] = useState<SocialPosts | null>(() =>
    storeCampaign ? postsFromCampaign(storeCampaign) : null,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (posts || storeCampaign) {
      return;
    }
    let active = true;
    campaignService.generate(currentShow ?? DemoDataService.fallbackShow).then((result) => {
      if (active) {
        setPosts(postsFromCampaign(result));
      }
    });
    return () => {
      active = false;
    };
  }, [posts, storeCampaign, currentShow]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
    };
  }, []);

  // activeIndex is always a valid PLATFORMS index (0..2, kept in range on change).
  const platform = PLATFORMS[activeIndex];

  if (!posts || !platform) {
    return (
      <EmptyState
        icon={<PostBubbleGlyph />}
        title="Your social posts will appear here"
        message="Instagram, Facebook, and X posts will be ready to preview as soon as your campaign is built."
      />
    );
  }

  const selectPlatform = (index: number) => {
    setActiveIndex(index);
    setEditing(false);
    setCopied(false);
  };

  const nextPlatform = () => selectPlatform((activeIndex + 1) % PLATFORMS.length);

  const changePost = (value: string) =>
    setPosts((prev) => (prev ? { ...prev, [platform.field]: value } : prev));

  const handleCopy = () => {
    // Prototype only: no clipboard or networking, just visible feedback.
    setCopied(true);
    if (copyTimer.current) {
      clearTimeout(copyTimer.current);
    }
    copyTimer.current = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {PLATFORMS.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => selectPlatform(index)}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Text
                variant="caption"
                color={selected ? colors.primary : colors.muted}
                style={selected ? styles.tabLabelSelected : undefined}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SocialPostCard
          platformLabel={platform.label}
          iconLabel={platform.iconLabel}
          brandColor={platform.brandColor}
          post={posts[platform.field]}
          charLimit={platform.charLimit}
          isEditing={editing}
          onChangeText={changePost}
        />
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
        <Button
          label="Next Platform"
          variant="primary"
          onPress={nextPlatform}
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: colors.transparent,
  },
  tabSelected: {
    borderBottomColor: colors.primary,
  },
  tabLabelSelected: {
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
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
