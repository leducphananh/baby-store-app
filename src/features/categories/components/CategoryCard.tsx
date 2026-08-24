import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatDateTime } from '../utils/format';
import type { CategoryRow } from '../types/category';

type CategoryCardProps = {
  category: CategoryRow;
};

/** Displays the full detail of a category (used on the detail screen). */
export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.field}>
        <ThemedText type="small" themeColor="textSecondary">
          Tên danh mục
        </ThemedText>
        <ThemedText type="title" style={styles.name}>
          {category.name}
        </ThemedText>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" themeColor="textSecondary">
          Mô tả
        </ThemedText>
        <ThemedText type="default">{category.description?.trim() || 'Chưa có mô tả'}</ThemedText>
      </View>

      <View style={styles.row}>
        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            Ngày tạo
          </ThemedText>
          <ThemedText type="small">{formatDateTime(category.created_at)}</ThemedText>
        </View>
        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            Ngày cập nhật
          </ThemedText>
          <ThemedText type="small">{formatDateTime(category.updated_at)}</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  field: {
    gap: Spacing.half,
    flex: 1,
  },
  name: {
    fontSize: 24,
    lineHeight: 30,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
});
