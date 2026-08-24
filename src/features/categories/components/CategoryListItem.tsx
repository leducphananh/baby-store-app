import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { CategoryRow } from '../types/category';

type CategoryListItemProps = {
  category: CategoryRow;
  onPress: (category: CategoryRow) => void;
};

/** A single row in the category list. */
export function CategoryListItem({ category, onPress }: CategoryListItemProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(category)}
      style={({ pressed }) => [styles.container, { backgroundColor: pressed ? theme.backgroundSelected : theme.background }]}
    >
      <View style={styles.textContainer}>
        <ThemedText type="default" numberOfLines={1}>
          {category.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2} style={styles.description}>
          {category.description?.trim() || 'Chưa có mô tả'}
        </ThemedText>
      </View>
      <ThemedText type="default" themeColor="textSecondary">
        ›
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    marginTop: Spacing.half,
  },
});
