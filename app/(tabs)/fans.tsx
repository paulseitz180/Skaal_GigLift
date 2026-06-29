import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { FanDetailSheet } from '@/features/fans/components/FanDetailSheet';
import { FanRow } from '@/features/fans/components/FanRow';
import { DemoDataService } from '@/services/demo/DemoDataService';
import type { Fan } from '@/types/fan';
import { FAN_FILTERS, filterFans, type FanFilterKey } from '@/utils/fans';

export default function FansScreen() {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FanFilterKey[]>([]);
  const [selectedFan, setSelectedFan] = useState<Fan | null>(null);

  const results = useMemo(
    () => filterFans(DemoDataService.fans, query, activeFilters),
    [query, activeFilters],
  );

  const toggleFilter = (key: FanFilterKey) =>
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="heading">Fans</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, email, or city"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.search}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          keyboardShouldPersistTaps="handled"
        >
          {FAN_FILTERS.map((filter) => {
            const active = activeFilters.includes(filter.key);
            return (
              <Pressable
                key={filter.key}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => toggleFilter(filter.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text variant="caption" color={active ? colors.onPrimary : colors.primary}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={results}
        keyExtractor={(fan) => fan.id}
        renderItem={({ item }) => <FanRow fan={item} onPress={() => setSelectedFan(item)} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No fans match"
            message="Try a different search, or clear a filter to see more of your audience."
          />
        }
      />

      <FanDetailSheet fan={selectedFan} onClose={() => setSelectedFan(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  search: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  chips: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    flexGrow: 1,
  },
});
