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
import { CustomerListItem } from '@/features/customers/components/CustomerListItem';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { customerDetailHref } from '@/features/customers/utils/routes';
import type { CustomerRow, CustomerStatusFilter } from '@/features/customers/types/customer';

const STATUS_FILTERS: { value: CustomerStatusFilter; label: string }[] = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'archived', label: 'Đã lưu trữ' },
  { value: 'all', label: 'Tất cả' },
];

export default function CustomersListScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CustomerStatusFilter>('active');
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data: customers, isLoading, isError, isRefetching, refetch } = useCustomers(debouncedSearch, status);

  function openDetail(customer: CustomerRow) {
    router.push(customerDetailHref(customer.id));
  }

  function openCreate() {
    router.push('/(app)/customers/create');
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={[styles.searchBox, { backgroundColor: theme.backgroundElement }]}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm theo tên, SĐT, email..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
            accessibilityLabel="Tìm kiếm khách hàng"
            returnKeyType="search"
            keyboardType="default"
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Thêm khách hàng"
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
        <Loading message="Đang tải khách hàng..." />
      ) : isError ? (
        <ErrorState message="Không thể tải danh sách khách hàng." onRetry={refetch} />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CustomerListItem customer={item} onPress={openDetail} />}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.backgroundSelected }]} />}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={customers?.length ? undefined : styles.emptyContainer}
          ListEmptyComponent={
            <EmptyState
              title={search ? 'Không tìm thấy khách hàng' : emptyTitleFor(status)}
              description={search ? `Không tìm thấy khách hàng phù hợp với "${search}".` : emptyDescriptionFor(status)}
              actionLabel={!search && status !== 'archived' ? 'Thêm khách hàng' : undefined}
              onAction={!search && status !== 'archived' ? openCreate : undefined}
            />
          }
        />
      )}
    </Screen>
  );
}

function emptyTitleFor(status: CustomerStatusFilter): string {
  if (status === 'archived') return 'Chưa có khách hàng lưu trữ';
  return 'Chưa có khách hàng.';
}

function emptyDescriptionFor(status: CustomerStatusFilter): string {
  if (status === 'archived') return 'Các khách hàng đã lưu trữ sẽ hiển thị ở đây.';
  return 'Thêm khách hàng đầu tiên để bắt đầu quản lý bán hàng.';
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
