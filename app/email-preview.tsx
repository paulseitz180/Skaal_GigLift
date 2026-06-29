import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { EnvelopeGlyph } from '@/components/ui/glyphs';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { EmailPreviewCard } from '@/features/campaign/components/EmailPreviewCard';
import { MockCampaignService } from '@/services/campaign/MockCampaignService';
import { DemoDataService } from '@/services/demo/DemoDataService';
import { useCampaignStore } from '@/stores/campaignStore';
import { useShowStore } from '@/stores/showStore';
import type { CampaignEmail } from '@/types/campaign';

const EMAIL_STAGES = ['Announcement', 'Momentum', 'Last Call', 'Day Of'];

const campaignService = new MockCampaignService();

export default function EmailPreviewScreen() {
  const { width } = useWindowDimensions();
  const storeCampaign = useCampaignStore((state) => state.campaign);
  const currentShow = useShowStore((state) => state.currentShow);

  const [emails, setEmails] = useState<CampaignEmail[]>(() =>
    storeCampaign ? storeCampaign.emails.map((email) => ({ ...email })) : [],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (emails.length > 0 || storeCampaign) {
      return;
    }
    let active = true;
    campaignService.generate(currentShow ?? DemoDataService.fallbackShow).then((result) => {
      if (active) {
        setEmails(result.emails.map((email) => ({ ...email })));
      }
    });
    return () => {
      active = false;
    };
  }, [emails.length, storeCampaign, currentShow]);

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(emails.length - 1, index));
    scrollRef.current?.scrollTo({ x: clamped * width, animated: true });
    setCurrentIndex(clamped);
  };

  const handleMomentumScrollEnd = (offsetX: number) => {
    if (width > 0) {
      setCurrentIndex(Math.round(offsetX / width));
    }
  };

  const toggleEdit = () => setEditingIndex((prev) => (prev === currentIndex ? null : currentIndex));

  const changeSubject = (index: number, value: string) =>
    setEmails((prev) =>
      prev.map((email, i) => (i === index ? { ...email, subject: value } : email)),
    );

  if (emails.length === 0) {
    return (
      <EmptyState
        icon={<EnvelopeGlyph />}
        title="Your emails will appear here"
        message="Your announcement, reminder, and last-call emails show up here as soon as your campaign is ready."
      />
    );
  }

  const isEditingCurrent = editingIndex === currentIndex;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onMomentumScrollEnd={(event) => handleMomentumScrollEnd(event.nativeEvent.contentOffset.x)}
      >
        {emails.map((email, index) => (
          <EmailPreviewCard
            key={`email-${index}`}
            width={width}
            stage={EMAIL_STAGES[index] ?? `Email ${index + 1}`}
            position={`Email ${index + 1} of ${emails.length}`}
            fromName={DemoDataService.artist.name}
            subject={email.subject}
            body={email.body}
            signatureName={DemoDataService.artist.name}
            isEditing={editingIndex === index}
            onChangeSubject={(value) => changeSubject(index, value)}
          />
        ))}
      </ScrollView>

      <View style={styles.toolbar}>
        <Button
          label="Previous"
          variant="secondary"
          disabled={currentIndex === 0}
          onPress={() => goTo(currentIndex - 1)}
          style={styles.toolbarButton}
        />
        <Button
          label={isEditingCurrent ? 'Done' : 'Edit'}
          variant="ghost"
          onPress={toggleEdit}
          style={styles.toolbarButton}
        />
        <Button
          label="Next"
          variant="secondary"
          disabled={currentIndex === emails.length - 1}
          onPress={() => goTo(currentIndex + 1)}
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
