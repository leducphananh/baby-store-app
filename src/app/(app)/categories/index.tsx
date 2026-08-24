import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { CategoryListItem } from '@/features/categories/components/CategoryListItem';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { categoryDetailHref } from '@/features/categories/utils/routes';
import type { CategoryRow } from '@/features/categories/types/category';

export default function CategoriesListScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data: categories, isLoading, isError, isRefetching, refetch } = useCategories(debouncedSearch);

  function openDetail(category: CategoryRow) {
    router.push(categoryDetailHref(category.id));
  }

  function openCreate() {
    router.push('/(app)/categories/create');
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={[styles.searchBox, { backgroundColor: theme.backgroundElement }]}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm danh mục theo tên..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
            accessibilityLabel="Tìm kiếm danh mục"
            returnKeyType="search"
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Thêm danh mục"
          onPress={openCreate}
          style={[styles.addButton, { backgroundColor: '#208AEF' }]}
        >
          <ThemedText type="title" style={styles.addButtonLabel}>
            +
          </ThemedText>
        </Pressable>
      </View>

      {isLoading ? (
        <Loading message="Đang tải danh mục..." />
      ) : isError ? (
        <ErrorState message="Không thể tải danh sách danh mục." onRetry={refetch} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CategoryListItem category={item} onPress={openDetail} />}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.backgroundSelected }]} />}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={categories?.length ? undefined : styles.emptyContainer}
          ListEmptyComponent={
            <EmptyState
              title={search ? 'Không tìm thấy danh mục' : 'Chưa có danh mục nào'}
              description={
                search
                  ? `Không có danh mục nào khớp với "${search}".`
                  : 'Thêm danh mục đầu tiên để bắt đầu quản lý sản phẩm.'
              }
              actionLabel={search ? undefined : 'Thêm danh mục'}
              onAction={search ? undefined : openCreate}
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 48,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    minHeight: 48,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonLabel: {
    color: '#ffffff',
    fontSize: 26,
    lineHeight: 30,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.three,
  },
  emptyContainer: {
    flexGrow: 1,
  },
});
