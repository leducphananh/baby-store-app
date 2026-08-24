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
import { SupplierListItem } from '@/features/suppliers/components/SupplierListItem';
import { useSuppliers } from '@/features/suppliers/hooks/useSuppliers';
import { supplierDetailHref } from '@/features/suppliers/utils/routes';
import type { SupplierRow, SupplierStatusFilter } from '@/features/suppliers/types/supplier';

const STATUS_FILTERS: { value: SupplierStatusFilter; label: string }[] = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'archived', label: 'Đã lưu trữ' },
  { value: 'all', label: 'Tất cả' },
];

export default function SuppliersListScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<SupplierStatusFilter>('active');
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data: suppliers, isLoading, isError, isRefetching, refetch } = useSuppliers(debouncedSearch, status);

  function openDetail(supplier: SupplierRow) {
    router.push(supplierDetailHref(supplier.id));
  }

  function openCreate() {
    router.push('/(app)/suppliers/create');
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={[styles.searchBox, { backgroundColor: theme.backgroundElement }]}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm theo tên, SĐT, MST, người liên hệ..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
            accessibilityLabel="Tìm kiếm nhà cung cấp"
            returnKeyType="search"
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Thêm nhà cung cấp"
          onPress={openCreate}
          style={[styles.addButton, { backgroundColor: '#208AEF' }]}
        >
          <ThemedText type="title" style={styles.addButtonLabel}>
            +
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {STATUS_FILTERS.map((filter) => {
          const active = filter.value === status;
          return (
            <Pressable
              key={filter.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setStatus(filter.value)}
              style={[styles.filterChip, { backgroundColor: active ? '#208AEF' : theme.backgroundElement }]}
            >
              <ThemedText type="small" style={{ color: active ? '#ffffff' : theme.text }}>
                {filter.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <Loading message="Đang tải nhà cung cấp..." />
      ) : isError ? (
        <ErrorState message="Không thể tải danh sách nhà cung cấp." onRetry={refetch} />
      ) : (
        <FlatList
          data={suppliers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SupplierListItem supplier={item} onPress={openDetail} />}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.backgroundSelected }]} />}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={suppliers?.length ? undefined : styles.emptyContainer}
          ListEmptyComponent={
            <EmptyState
              title={search ? 'Không tìm thấy nhà cung cấp' : emptyTitleFor(status)}
              description={
                search
                  ? `Không có nhà cung cấp nào khớp với "${search}".`
                  : emptyDescriptionFor(status)
              }
              actionLabel={!search && status !== 'archived' ? 'Thêm nhà cung cấp' : undefined}
              onAction={!search && status !== 'archived' ? openCreate : undefined}
            />
          }
        />
      )}
    </Screen>
  );
}

function emptyTitleFor(status: SupplierStatusFilter): string {
  if (status === 'archived') return 'Chưa có nhà cung cấp lưu trữ';
  return 'Chưa có nhà cung cấp';
}

function emptyDescriptionFor(status: SupplierStatusFilter): string {
  if (status === 'archived') return 'Các nhà cung cấp đã lưu trữ sẽ hiển thị ở đây.';
  return 'Thêm nhà cung cấp đầu tiên để bắt đầu quản lý nguồn hàng.';
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
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  filterChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.three,
  },
  emptyContainer: {
    flexGrow: 1,
  },
});
