import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { FALLBACK_SHOW } from '@/mock/show';
import {
  TIMELINE_REFERENCE_DATE,
  TIMELINE_STATUS_SEQUENCE,
  type TimelineStatus,
} from '@/mock/timeline';
import { MockCampaignService } from '@/services/campaign/MockCampaignService';
import { useCampaignStore } from '@/stores/campaignStore';
import { useShowStore } from '@/stores/showStore';
import type { Campaign } from '@/types/campaign';

type TimelineEntry = {
  id: string;
  title: string;
  date: string;
  detail: string;
  status: TimelineStatus;
};

const STATUS_LABEL: Record<TimelineStatus, string> = {
  scheduled: 'Scheduled',
  approved: 'Approved',
  skipped: 'Skipped',
  completed: 'Completed',
};

const STATUS_COLOR: Record<TimelineStatus, string> = {
  scheduled: colors.info,
  approved: colors.success,
  skipped: colors.muted,
  completed: colors.primary,
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const campaignService = new MockCampaignService();

function formatMockDate(daysBeforeShow: number): string {
  const date = new Date(TIMELINE_REFERENCE_DATE);
  date.setDate(date.getDate() - daysBeforeShow);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export default function TimelineScreen() {
  const router = useRouter();
  const storeCampaign = useCampaignStore((state) => state.campaign);
  const currentShow = useShowStore((state) => state.currentShow);

  const [campaign, setCampaign] = useState<Campaign | null>(() => storeCampaign);
  const [selected, setSelected] = useState<TimelineEntry | null>(null);

  useEffect(() => {
    if (campaign || storeCampaign) {
      return;
    }
    let active = true;
    campaignService.generate(currentShow ?? FALLBACK_SHOW).then((result) => {
      if (active) {
        setCampaign(result);
      }
    });
    return () => {
      active = false;
    };
  }, [campaign, storeCampaign, currentShow]);

  const entries = useMemo<TimelineEntry[]>(() => {
    if (!campaign) {
      return [];
    }
    return campaign.timelineItems.map((item, index) => ({
      id: `timeline-${index}`,
      title: item.title,
      date: formatMockDate(item.daysBeforeShow),
      detail: item.detail,
      status: TIMELINE_STATUS_SEQUENCE[index % TIMELINE_STATUS_SEQUENCE.length] ?? 'scheduled',
    }));
  }, [campaign]);

  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text variant="body" color={colors.muted} style={styles.emptyText}>
          No timeline yet. Generate a campaign to see your promotion schedule here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {entries.map((entry, index) => (
          <Pressable
            key={entry.id}
            accessibilityRole="button"
            onPress={() => setSelected(entry)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <View style={styles.rail}>
              <View style={[styles.dot, { backgroundColor: STATUS_COLOR[entry.status] }]} />
              {index < entries.length - 1 ? <View style={styles.line} /> : null}
            </View>

            <Card style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text variant="body" style={styles.itemTitle}>
                  {entry.title}
                </Text>
                <StatusBadge status={entry.status} />
              </View>
              <Text variant="caption" color={colors.muted}>
                {entry.date}
              </Text>
            </Card>
          </Pressable>
        ))}

        <Button
          label="Return Home"
          variant="primary"
          style={styles.returnHomeButton}
          onPress={() => router.replace('/')}
        />
      </ScrollView>

      <Modal
        visible={selected !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalBackdrop}>
          <Card style={styles.modalCard}>
            {selected ? (
              <>
                <View style={styles.itemHeader}>
                  <Text variant="heading" style={styles.modalTitle}>
                    {selected.title}
                  </Text>
                  <StatusBadge status={selected.status} />
                </View>
                <Text variant="caption" color={colors.muted}>
                  {selected.date}
                </Text>
                <Text variant="body" color={colors.muted} style={styles.modalDetail}>
                  {selected.detail}
                </Text>
                <Button label="Close" variant="primary" onPress={() => setSelected(null)} />
              </>
            ) : null}
          </Card>
        </View>
      </Modal>
    </View>
  );
}

function StatusBadge({ status }: { status: TimelineStatus }) {
  return (
    <View style={[styles.badge, { backgroundColor: STATUS_COLOR[status] }]}>
      <Text variant="caption" color={colors.onPrimary}>
        {STATUS_LABEL[status]}
      </Text>
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
  },
  returnHomeButton: {
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowPressed: {
    opacity: 0.7,
  },
  rail: {
    alignItems: 'center',
    width: 16,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: radius.full,
    marginTop: spacing.lg,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  itemCard: {
    flex: 1,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  itemTitle: {
    flex: 1,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  modalCard: {
    gap: spacing.md,
  },
  modalTitle: {
    flex: 1,
  },
  modalDetail: {
    lineHeight: 22,
  },
  empty: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
  },
});
