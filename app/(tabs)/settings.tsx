import { useRouter } from 'expo-router';
import { type ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { DemoDataService } from '@/services/demo/DemoDataService';

const APP_VERSION = '1.0.0';

const NOTIFICATION_OPTIONS = [
  { key: 'shows', label: 'Show reminders', sublabel: 'Get nudged before each gig' },
  { key: 'campaigns', label: 'Campaign updates', sublabel: 'When content is ready to review' },
  { key: 'fans', label: 'New fan alerts', sublabel: 'When someone joins your list' },
] as const;

const PRIVACY_OPTIONS = [
  { key: 'policy', label: 'Privacy Policy' },
  { key: 'data', label: 'Manage Your Data' },
  { key: 'permissions', label: 'App Permissions' },
];

const noop = () => {};

export default function SettingsScreen() {
  const router = useRouter();
  const { artist, subscription, connectedAccounts } = DemoDataService;

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    shows: true,
    campaigns: true,
    fans: false,
  });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="heading">Settings</Text>

      <Section title="Artist Profile">
        <Card style={styles.profileCard}>
          <Avatar name={artist.name} size={52} />
          <View style={styles.profileText}>
            <Text variant="body" style={styles.semibold}>
              {artist.name}
            </Text>
            <Text variant="caption" color={colors.muted}>
              {artist.genre_tags.join(' · ')}
            </Text>
          </View>
          <Button
            label="Edit"
            variant="secondary"
            style={styles.smallButton}
            onPress={() => router.push('/profile-setup')}
          />
        </Card>
      </Section>

      <Section title="Subscription">
        <Card>
          <Row label="Plan" right={<Text variant="body">{subscription.plan}</Text>} />
          <Row
            label="Status"
            right={
              <Text variant="body" color={colors.success}>
                {subscription.status}
              </Text>
            }
          />
          <Row label="Renews" right={<Text variant="body">{subscription.renews}</Text>} isLast />
        </Card>
        <Button label="Manage Plan" variant="ghost" onPress={noop} style={styles.sectionButton} />
      </Section>

      <Section title="Connected Accounts">
        <Card>
          {connectedAccounts.map((account, index) => (
            <Row
              key={account.key}
              label={account.name}
              sublabel={account.connected ? 'Connected' : 'Not Connected'}
              sublabelColor={account.connected ? colors.success : colors.muted}
              isLast={index === connectedAccounts.length - 1}
              right={
                <Button
                  label={account.connected ? 'Disconnect' : 'Connect'}
                  variant={account.connected ? 'ghost' : 'secondary'}
                  style={styles.smallButton}
                  onPress={noop}
                />
              }
            />
          ))}
        </Card>
      </Section>

      <Section title="Notifications">
        <Card>
          {NOTIFICATION_OPTIONS.map((option, index) => (
            <Row
              key={option.key}
              label={option.label}
              sublabel={option.sublabel}
              isLast={index === NOTIFICATION_OPTIONS.length - 1}
              right={
                <Switch
                  value={notifications[option.key] ?? false}
                  onValueChange={(value) =>
                    setNotifications((prev) => ({ ...prev, [option.key]: value }))
                  }
                  trackColor={{ true: colors.primary, false: colors.border }}
                />
              }
            />
          ))}
        </Card>
      </Section>

      <Section title="Privacy">
        <Card>
          {PRIVACY_OPTIONS.map((option, index) => (
            <Pressable
              key={option.key}
              accessibilityRole="button"
              onPress={noop}
              style={({ pressed }) => (pressed ? styles.pressed : undefined)}
            >
              <Row
                label={option.label}
                right={<Chevron />}
                isLast={index === PRIVACY_OPTIONS.length - 1}
              />
            </Pressable>
          ))}
        </Card>
      </Section>

      <Section title="About GigLift">
        <Card>
          <Row label="Version" right={<Text variant="body">{APP_VERSION}</Text>} />
          <Row label="Build" right={<Text variant="body">Prototype</Text>} />
          <Pressable accessibilityRole="button" onPress={noop}>
            <Row label="Terms of Service" right={<Chevron />} />
          </Pressable>
          <Pressable accessibilityRole="button" onPress={noop}>
            <Row label="Acknowledgements" right={<Chevron />} isLast />
          </Pressable>
        </Card>
      </Section>
    </ScrollView>
  );
}

type SectionProps = { title: string; children: ReactNode };

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text variant="caption" color={colors.muted} style={styles.sectionTitle}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

type RowProps = {
  label: string;
  sublabel?: string;
  sublabelColor?: string;
  right?: ReactNode;
  isLast?: boolean;
};

function Row({ label, sublabel, sublabelColor = colors.muted, right, isLast = false }: RowProps) {
  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <View style={styles.rowText}>
        <Text variant="body">{label}</Text>
        {sublabel ? (
          <Text variant="caption" color={sublabelColor}>
            {sublabel}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

function Chevron() {
  return <View style={styles.chevron} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    letterSpacing: 1,
    marginLeft: spacing.xs,
  },
  sectionButton: {
    alignSelf: 'flex-start',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profileText: {
    flex: 1,
    gap: spacing.xs,
  },
  semibold: {
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
  },
  smallButton: {
    minHeight: 36,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  pressed: {
    opacity: 0.6,
  },
  chevron: {
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.muted,
    transform: [{ rotate: '45deg' }],
  },
});
