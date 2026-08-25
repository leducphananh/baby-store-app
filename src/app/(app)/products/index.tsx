import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { ProductListItem } from '@/features/products/components/ProductListItem';
import { ProductFilters } from '@/features/products/components/ProductFilters';
import { useProducts } from '@/features/products/hooks/useProducts';
import { productDetailHref } from '@/features/products/utils/routes';
import type { ProductStatusFilter, ProductWithCategory } from '@/features/products/types/product';

export default function ProductsListScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProductStatusFilter>('active');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, 400);

  const {
    data,
    isLoading,
    isError,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({ search: debouncedSearch, categoryId, status });

  const products = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  function openDetail(product: ProductWithCategory) {
    router.push(productDetailHref(product.id));
  }

  function openCreate() {
    router.push('/(app)/products/create');
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={[styles.searchBox, { backgroundColor: theme.backgroundElement }]}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm theo tên, SKU, mã vạch, thương hiệu..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
            accessibilityLabel="Tìm kiếm sản phẩm"
            returnKeyType="search"
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Thêm sản phẩm"
          onPress={openCreate}
          style={[styles.addButton, { backgroundColor: '#208AEF' }]}
        >
          <ThemedText type="title" style={styles.addButtonLabel}>
            +
          </ThemedText>
        </Pressable>
      </View>

      <ProductFilters status={status} onStatusChange={setStatus} categoryId={categoryId} onCategoryChange={setCategoryId} />

      {isLoading ? (
        <Loading message="Đang tải sản phẩm..." />
      ) : isError ? (
        <ErrorState message="Không thể tải danh sách sản phẩm." onRetry={refetch} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductListItem product={item} onPress={openDetail} />}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.backgroundSelected }]} />}
          refreshing={isRefetching && !isFetchingNextPage}
          onRefresh={refetch}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.4}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          windowSize={7}
          contentContainerStyle={products.length ? undefined : styles.emptyContainer}
          ListEmptyComponent={
            <EmptyState
              title={search ? 'Không tìm thấy sản phẩm' : emptyTitleFor(status)}
              description={search ? `Không tìm thấy sản phẩm phù hợp với "${search}".` : emptyDescriptionFor(status)}
              actionLabel={!search && status !== 'archived' ? 'Thêm sản phẩm' : undefined}
              onAction={!search && status !== 'archived' ? openCreate : undefined}
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" />
                <ThemedText type="small" themeColor="textSecondary">
                  Đang tải thêm...
                </ThemedText>
              </View>
            ) : null
          }
        />
      )}
    </Screen>
  );
}

function emptyTitleFor(status: ProductStatusFilter): string {
  if (status === 'archived') return 'Chưa có sản phẩm lưu trữ';
  return 'Chưa có sản phẩm.';
}

function emptyDescriptionFor(status: ProductStatusFilter): string {
  if (status === 'archived') return 'Các sản phẩm đã lưu trữ sẽ hiển thị ở đây.';
  return 'Thêm sản phẩm đầu tiên để bắt đầu quản lý hàng hóa.';
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
});
