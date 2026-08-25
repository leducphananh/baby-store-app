import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { CustomerCard } from '@/features/customers/components/CustomerCard';
import { useCustomer } from '@/features/customers/hooks/useCustomer';
import { useArchiveCustomer } from '@/features/customers/hooks/useArchiveCustomer';
import { useRestoreCustomer } from '@/features/customers/hooks/useRestoreCustomer';

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: customer, isLoading, isError, error, refetch } = useCustomer(id);
  const { mutate: archiveCustomer, isPending: isArchiving } = useArchiveCustomer();
  const { mutate: restoreCustomer, isPending: isRestoring } = useRestoreCustomer();

  function handleEdit() {
    router.push({ pathname: '/(app)/customers/[id]/edit', params: { id } });
  }

  function handleArchive() {
    Alert.alert(
      'Lưu trữ khách hàng',
      'Bạn có chắc muốn lưu trữ khách hàng này không? Khách hàng sẽ không được chọn mặc định cho các đơn hàng mới, nhưng lịch sử giao dịch vẫn được giữ lại.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Lưu trữ',
          style: 'destructive',
          onPress: () => {
            archiveCustomer(id, {
              onError: (err) => Alert.alert('Không thể lưu trữ', err.message),
            });
          },
        },
      ]
    );
  }

  function handleRestore() {
    Alert.alert('Khôi phục khách hàng', 'Khôi phục khách hàng này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Khôi phục',
        onPress: () => {
          restoreCustomer(id, {
            onError: (err) => Alert.alert('Không thể khôi phục', err.message),
          });
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <Screen>
        <Loading message="Đang tải khách hàng..." />
      </Screen>
    );
  }

  if (isError || !customer) {
    return (
      <Screen>
        <ErrorState message={error?.message ?? 'Không tìm thấy khách hàng.'} onRetry={refetch} />
      </Screen>
    );
  }

  const isPending = isArchiving || isRestoring;

  return (
    <Screen padded>
      <ScrollView contentContainerStyle={styles.content}>
        <CustomerCard customer={customer} />
        <View style={styles.actions}>
          <Button title="Chỉnh sửa" onPress={handleEdit} disabled={isPending} />
          {customer.status === 'active' ? (
            <Button title="Lưu trữ" variant="danger" onPress={handleArchive} loading={isArchiving} disabled={isPending} />
          ) : (
            <Button title="Khôi phục" variant="outline" onPress={handleRestore} loading={isRestoring} disabled={isPending} />
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.four,
    paddingBottom: Spacing.six,
  },
  actions: {
    gap: Spacing.two,
  },
});
