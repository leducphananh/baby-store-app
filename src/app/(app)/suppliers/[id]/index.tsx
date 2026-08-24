import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { SupplierCard } from '@/features/suppliers/components/SupplierCard';
import { useSupplier } from '@/features/suppliers/hooks/useSupplier';
import { useArchiveSupplier } from '@/features/suppliers/hooks/useArchiveSupplier';
import { useRestoreSupplier } from '@/features/suppliers/hooks/useRestoreSupplier';

export default function SupplierDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: supplier, isLoading, isError, error, refetch } = useSupplier(id);
  const { mutate: archiveSupplier, isPending: isArchiving } = useArchiveSupplier();
  const { mutate: restoreSupplier, isPending: isRestoring } = useRestoreSupplier();

  function handleEdit() {
    router.push({ pathname: '/(app)/suppliers/[id]/edit', params: { id } });
  }

  function handleArchive() {
    Alert.alert(
      'Lưu trữ nhà cung cấp',
      'Bạn có chắc muốn lưu trữ nhà cung cấp này không? Nhà cung cấp sẽ không còn được sử dụng cho các giao dịch mới nhưng dữ liệu lịch sử vẫn được giữ lại.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Lưu trữ',
          style: 'destructive',
          onPress: () => {
            archiveSupplier(id, {
              onError: (err) => Alert.alert('Không thể lưu trữ', err.message),
            });
          },
        },
      ]
    );
  }

  function handleRestore() {
    restoreSupplier(id, {
      onError: (err) => Alert.alert('Không thể khôi phục', err.message),
    });
  }

  if (isLoading) {
    return (
      <Screen>
        <Loading message="Đang tải nhà cung cấp..." />
      </Screen>
    );
  }

  if (isError || !supplier) {
    return (
      <Screen>
        <ErrorState message={error?.message ?? 'Không tìm thấy nhà cung cấp.'} onRetry={refetch} />
      </Screen>
    );
  }

  const isPending = isArchiving || isRestoring;

  return (
    <Screen padded>
      <ScrollView contentContainerStyle={styles.content}>
        <SupplierCard supplier={supplier} />
        <View style={styles.actions}>
          <Button title="Chỉnh sửa" onPress={handleEdit} disabled={isPending} />
          {supplier.status === 'active' ? (
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
