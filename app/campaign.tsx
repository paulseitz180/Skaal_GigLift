import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { ReviewItemCard } from '@/features/campaign/components/ReviewItemCard';
import { MockCampaignService } from '@/services/campaign/MockCampaignService';
import { DemoDataService } from '@/services/demo/DemoDataService';
import { useCampaignStore } from '@/stores/campaignStore';
import { useShowStore } from '@/stores/showStore';
import type { Campaign, ItemStatus } from '@/types/campaign';
import {
  cloneCampaign,
  summarizeStatuses,
  updateEmailField,
  updatePressReleaseField,
  updateSocialField,
  updateTimelineItemField,
} from '@/utils/campaign';

type TabKey = 'emails' | 'social' | 'press' | 'timeline';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'emails', label: 'Emails' },
  { key: 'social', label: 'Social' },
  { key: 'press', label: 'Press Release' },
  { key: 'timeline', label: 'Timeline' },
];

const campaignService = new MockCampaignService();

export default function CampaignScreen() {
  const router = useRouter();
  const storeCampaign = useCampaignStore((state) => state.campaign);
  const currentShow = useShowStore((state) => state.currentShow);

  const [campaign, setCampaign] = useState<Campaign | null>(() =>
    storeCampaign ? cloneCampaign(storeCampaign) : null,
  );
  const [activeTab, setActiveTab] = useState<TabKey>('emails');
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    // Local state is initialized from the store at mount. Only generate a
    // fallback campaign if we reached this screen without one available.
    if (campaign || storeCampaign) {
      return;
    }
    let active = true;
    campaignService.generate(currentShow ?? DemoDataService.fallbackShow).then((result) => {
      if (active) {
        setCampaign(result);
      }
    });
    return () => {
      active = false;
    };
  }, [campaign, storeCampaign, currentShow]);

  const statusFor = (key: string): ItemStatus => statuses[key] ?? 'pending';
  const setStatus = (key: string, status: ItemStatus) =>
    setStatuses((prev) => ({ ...prev, [key]: status }));
  const toggleEditing = (key: string) => setEditingKey((prev) => (prev === key ? null : key));

  const itemHandlers = (key: string) => ({
    status: statusFor(key),
    isEditing: editingKey === key,
    onApprove: () => setStatus(key, 'approved'),
    onSkip: () => setStatus(key, 'skipped'),
    onEditToggle: () => toggleEditing(key),
  });

  const updateEmail = (index: number, field: 'subject' | 'body', value: string) =>
    setCampaign((prev) => (prev ? updateEmailField(prev, index, field, value) : prev));

  const updateSocial = (field: 'instagramPost' | 'facebookPost' | 'xPost', value: string) =>
    setCampaign((prev) => (prev ? updateSocialField(prev, field, value) : prev));

  const updatePressRelease = (value: string) =>
    setCampaign((prev) => (prev ? updatePressReleaseField(prev, value) : prev));

  const updateTimelineItem = (index: number, field: 'title' | 'detail', value: string) =>
    setCampaign((prev) => (prev ? updateTimelineItemField(prev, index, field, value) : prev));

  const summary = useMemo(() => summarizeStatuses(statuses), [statuses]);

  if (!campaign) {
    return (
      <EmptyState
        title="Your campaign will appear here"
        message="Tell GigLift about your next show and we'll write the emails, posts, and press release for you."
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const selected = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Text
                variant="caption"
                color={selected ? colors.primary : colors.muted}
                style={selected ? styles.tabLabelSelected : undefined}
              >
                {tab.label}
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
        <Text variant="caption" color={colors.muted}>
          {summary.approved} approved · {summary.skipped} skipped
        </Text>

        {activeTab === 'emails'
          ? campaign.emails.map((email, index) => {
              const key = `email-${index}`;
              const editing = editingKey === key;
              return (
                <ReviewItemCard
                  key={key}
                  title={`Email ${index + 1}`}
                  subtitle={email.audience}
                  {...itemHandlers(key)}
                >
                  {editing ? (
                    <>
                      <Input
                        label="Subject"
                        value={email.subject}
                        onChangeText={(value) => updateEmail(index, 'subject', value)}
                      />
                      <Input
                        label="Message"
                        value={email.body}
                        multiline
                        onChangeText={(value) => updateEmail(index, 'body', value)}
                      />
                    </>
                  ) : (
                    <>
                      <Text variant="body" style={styles.emphasis}>
                        {email.subject}
                      </Text>
                      <Text variant="body" color={colors.muted}>
                        {email.body}
                      </Text>
                    </>
                  )}
                </ReviewItemCard>
              );
            })
          : null}

        {activeTab === 'social' ? (
          <>
            <ReviewItemCard title="Instagram" {...itemHandlers('social-instagram')}>
              {editingKey === 'social-instagram' ? (
                <Input
                  label="Caption"
                  value={campaign.instagramPost}
                  multiline
                  onChangeText={(value) => updateSocial('instagramPost', value)}
                />
              ) : (
                <Text variant="body" color={colors.muted}>
                  {campaign.instagramPost}
                </Text>
              )}
            </ReviewItemCard>

            <ReviewItemCard title="Facebook" {...itemHandlers('social-facebook')}>
              {editingKey === 'social-facebook' ? (
                <Input
                  label="Post"
                  value={campaign.facebookPost}
                  multiline
                  onChangeText={(value) => updateSocial('facebookPost', value)}
                />
              ) : (
                <Text variant="body" color={colors.muted}>
                  {campaign.facebookPost}
                </Text>
              )}
            </ReviewItemCard>

            <ReviewItemCard title="X" {...itemHandlers('social-x')}>
              {editingKey === 'social-x' ? (
                <Input
                  label="Post"
                  value={campaign.xPost}
                  multiline
                  onChangeText={(value) => updateSocial('xPost', value)}
                />
              ) : (
                <Text variant="body" color={colors.muted}>
                  {campaign.xPost}
                </Text>
              )}
            </ReviewItemCard>
          </>
        ) : null}

        {activeTab === 'press' ? (
          <ReviewItemCard title="Press Release" {...itemHandlers('press-release')}>
            {editingKey === 'press-release' ? (
              <Input
                label="Press release"
                value={campaign.pressRelease}
                multiline
                style={styles.pressInput}
                onChangeText={updatePressRelease}
              />
            ) : (
              <Text variant="body" color={colors.muted}>
                {campaign.pressRelease}
              </Text>
            )}
          </ReviewItemCard>
        ) : null}

        {activeTab === 'timeline'
          ? campaign.timelineItems.map((item, index) => {
              const key = `timeline-${index}`;
              const editing = editingKey === key;
              return (
                <ReviewItemCard
                  key={key}
                  title={item.title}
                  subtitle={`${item.daysBeforeShow} days before show`}
                  {...itemHandlers(key)}
                >
                  {editing ? (
                    <>
                      <Input
                        label="Title"
                        value={item.title}
                        onChangeText={(value) => updateTimelineItem(index, 'title', value)}
                      />
                      <Input
                        label="Detail"
                        value={item.detail}
                        multiline
                        onChangeText={(value) => updateTimelineItem(index, 'detail', value)}
                      />
                    </>
                  ) : (
                    <Text variant="body" color={colors.muted}>
                      {item.detail}
                    </Text>
                  )}
                </ReviewItemCard>
              );
            })
          : null}

        <Button
          label="Continue to Previews"
          variant="primary"
          style={styles.continueButton}
          onPress={() => router.push('/email-preview')}
        />
      </ScrollView>
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
    gap: spacing.md,
  },
  continueButton: {
    marginTop: spacing.sm,
  },
  emphasis: {
    fontWeight: '600',
  },
  pressInput: {
    minHeight: 200,
  },
});
