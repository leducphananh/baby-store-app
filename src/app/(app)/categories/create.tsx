import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { CategoryForm } from '@/features/categories/components/CategoryForm';
import { useCreateCategory } from '@/features/categories/hooks/useCreateCategory';
import { categoryDetailHref } from '@/features/categories/utils/routes';
import type { CategoryFormValues } from '@/features/categories/schemas/categorySchema';

export default function CreateCategoryScreen() {
  const { mutate, isPending } = useCreateCategory();

  function handleSubmit(values: CategoryFormValues) {
    mutate(values, {
      onSuccess: (category) => {
        Alert.alert('Thành công', 'Đã tạo danh mục mới.');
        router.replace(categoryDetailHref(category.id));
      },
      onError: (error) => {
        Alert.alert('Không thể tạo danh mục', error.message);
      },
    });
  }

  return (
    <Screen padded>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <CategoryForm submitLabel="Tạo danh mục" isSubmitting={isPending} onSubmit={handleSubmit} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.six,
  },
});
