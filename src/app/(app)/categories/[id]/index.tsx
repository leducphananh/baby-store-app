import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { CategoryCard } from '@/features/categories/components/CategoryCard';
import { useCategory } from '@/features/categories/hooks/useCategory';
import { useDeleteCategory } from '@/features/categories/hooks/useDeleteCategory';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: category, isLoading, isError, error, refetch } = useCategory(id);
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  function handleEdit() {
    router.push({ pathname: '/(app)/categories/[id]/edit', params: { id } });
  }

  function handleDelete() {
    Alert.alert('Xóa danh mục', 'Bạn có chắc muốn xóa danh mục này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          deleteCategory(id, {
            onSuccess: () => {
              router.back();
            },
            onError: (err) => {
              Alert.alert('Không thể xóa danh mục', err.message);
            },
          });
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <Screen>
        <Loading message="Đang tải danh mục..." />
      </Screen>
    );
  }

  if (isError || !category) {
    return (
      <Screen>
        <ErrorState message={error?.message ?? 'Không tìm thấy danh mục.'} onRetry={refetch} />
      </Screen>
    );
  }

  return (
    <Screen padded>
      <ScrollView contentContainerStyle={styles.content}>
        <CategoryCard category={category} />
        <View style={styles.actions}>
          <Button title="Chỉnh sửa" onPress={handleEdit} disabled={isDeleting} />
          <Button title="Xóa danh mục" variant="danger" onPress={handleDelete} loading={isDeleting} disabled={isDeleting} />
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
