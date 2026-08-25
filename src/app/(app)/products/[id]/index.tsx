import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { ProductCard } from '@/features/products/components/ProductCard';
import { useProduct } from '@/features/products/hooks/useProduct';
import { useArchiveProduct } from '@/features/products/hooks/useArchiveProduct';
import { useRestoreProduct } from '@/features/products/hooks/useRestoreProduct';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading, isError, error, refetch } = useProduct(id);
  const { mutate: archiveProduct, isPending: isArchiving } = useArchiveProduct();
  const { mutate: restoreProduct, isPending: isRestoring } = useRestoreProduct();

  function handleEdit() {
    router.push({ pathname: '/(app)/products/[id]/edit', params: { id } });
  }

  function handleArchive() {
    Alert.alert(
      'Lưu trữ sản phẩm',
      'Bạn có chắc muốn lưu trữ sản phẩm này không? Sản phẩm sẽ không được sử dụng cho giao dịch mới nhưng dữ liệu lịch sử vẫn được giữ lại.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Lưu trữ',
          style: 'destructive',
          onPress: () => {
            archiveProduct(id, {
              onError: (err) => Alert.alert('Không thể lưu trữ', err.message),
            });
          },
        },
      ]
    );
  }

  function handleRestore() {
    Alert.alert('Khôi phục sản phẩm', 'Khôi phục sản phẩm này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Khôi phục',
        onPress: () => {
          restoreProduct(id, {
            onError: (err) => Alert.alert('Không thể khôi phục', err.message),
          });
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <Screen>
        <Loading message="Đang tải sản phẩm..." />
      </Screen>
    );
  }

  if (isError || !product) {
    return (
      <Screen>
        <ErrorState message={error?.message ?? 'Không tìm thấy sản phẩm.'} onRetry={refetch} />
      </Screen>
    );
  }

  const isPending = isArchiving || isRestoring;

  return (
    <Screen padded>
      <ScrollView contentContainerStyle={styles.content}>
        <ProductCard product={product} />
        <View style={styles.actions}>
          <Button title="Chỉnh sửa" onPress={handleEdit} disabled={isPending} />
          {product.status === 'active' ? (
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
