import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCategories } from '@/features/categories/hooks/useCategories';
import type { ProductStatusFilter } from '../types/product';

const STATUS_FILTERS: { value: ProductStatusFilter; label: string }[] = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'archived', label: 'Đã lưu trữ' },
  { value: 'all', label: 'Tất cả' },
];

type ProductFiltersProps = {
  status: ProductStatusFilter;
  onStatusChange: (status: ProductStatusFilter) => void;
  categoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
};

/**
 * Status + category filter chips for the product list. Category options
 * come from real Categories data (never hardcoded IDs); a loading/error
 * category list simply degrades to "no category filter available" rather
 * than blocking the rest of the screen.
 */
export function ProductFilters({ status, onStatusChange, categoryId, onCategoryChange }: ProductFiltersProps) {
  const theme = useTheme();
  const { data: categories } = useCategories();

  return (
    <View style={styles.container}>
      <View style={styles.chipRow}>
        {STATUS_FILTERS.map((filter) => {
          const active = filter.value === status;
          return (
            <Pressable
              key={filter.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onStatusChange(filter.value)}
              style={[styles.chip, { backgroundColor: active ? '#208AEF' : theme.backgroundElement }]}
            >
              <ThemedText type="small" style={{ color: active ? '#ffffff' : theme.text }}>
                {filter.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {categories && categories.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: categoryId === null }}
            onPress={() => onCategoryChange(null)}
            style={[styles.chip, { backgroundColor: categoryId === null ? '#208AEF' : theme.backgroundElement }]}
          >
            <ThemedText type="small" style={{ color: categoryId === null ? '#ffffff' : theme.text }}>
              Tất cả danh mục
            </ThemedText>
          </Pressable>
          {categories.map((category) => {
            const active = category.id === categoryId;
            return (
              <Pressable
                key={category.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => onCategoryChange(category.id)}
                style={[styles.chip, { backgroundColor: active ? '#208AEF' : theme.backgroundElement }]}
              >
                <ThemedText type="small" style={{ color: active ? '#ffffff' : theme.text }}>
                  {category.name}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
  },
});
