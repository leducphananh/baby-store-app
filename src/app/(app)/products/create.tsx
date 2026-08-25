import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { ProductForm } from '@/features/products/components/ProductForm';
import { useCreateProduct } from '@/features/products/hooks/useCreateProduct';
import { productDetailHref } from '@/features/products/utils/routes';
import type { ProductFormValues } from '@/features/products/schemas/productSchema';

export default function CreateProductScreen() {
  const { mutate, isPending } = useCreateProduct();

  function handleSubmit(values: ProductFormValues) {
    mutate(values, {
      onSuccess: (product) => {
        Alert.alert('Thành công', 'Đã tạo sản phẩm mới.');
        router.replace(productDetailHref(product.id));
      },
      onError: (error) => {
        Alert.alert('Không thể tạo sản phẩm', error.message);
      },
    });
  }

  return (
    <Screen padded>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ProductForm submitLabel="Tạo sản phẩm" isSubmitting={isPending} onSubmit={handleSubmit} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.six,
  },
});
