import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Spacing } from '@/constants/theme';
import { CategoryForm } from '@/features/categories/components/CategoryForm';
import { useCategory } from '@/features/categories/hooks/useCategory';
import { useUpdateCategory } from '@/features/categories/hooks/useUpdateCategory';
import { categoryDetailHref } from '@/features/categories/utils/routes';
import type { CategoryFormValues } from '@/features/categories/schemas/categorySchema';

export default function EditCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: category, isLoading, isError, error, refetch } = useCategory(id);
  const { mutate, isPending } = useUpdateCategory();

  function handleSubmit(values: CategoryFormValues) {
    mutate(
      { id, values },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Đã cập nhật danh mục.');
          router.replace(categoryDetailHref(id));
        },
        onError: (err) => {
          Alert.alert('Không thể cập nhật danh mục', err.message);
        },
      }
    );
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
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <CategoryForm
          defaultValues={{ name: category.name, description: category.description ?? '' }}
          submitLabel="Lưu thay đổi"
          isSubmitting={isPending}
          onSubmit={handleSubmit}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.six,
  },
});
