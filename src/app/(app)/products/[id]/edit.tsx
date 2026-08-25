import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Spacing } from '@/constants/theme';
import { ProductForm } from '@/features/products/components/ProductForm';
import { useProduct } from '@/features/products/hooks/useProduct';
import { useUpdateProduct } from '@/features/products/hooks/useUpdateProduct';
import { productDetailHref } from '@/features/products/utils/routes';
import type { ProductFormValues } from '@/features/products/schemas/productSchema';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading, isError, error, refetch } = useProduct(id);
  const { mutate, isPending } = useUpdateProduct();

  function handleSubmit(values: ProductFormValues) {
    mutate(
      { id, values },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Đã cập nhật sản phẩm.');
          router.replace(productDetailHref(id));
        },
        onError: (err) => {
          Alert.alert('Không thể cập nhật sản phẩm', err.message);
        },
      }
    );
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

  return (
    <Screen padded>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ProductForm
          defaultValues={{
            name: product.name,
            sku: product.sku,
            barcode: product.barcode ?? '',
            category_id: product.category_id ?? '',
            brand: product.brand ?? '',
            unit: product.unit,
            description: product.description ?? '',
            selling_price: String(product.selling_price),
            default_purchase_price: String(product.default_purchase_price),
            minimum_stock: String(product.minimum_stock),
            origin_country: product.origin_country ?? '',
            manufacturer: product.manufacturer ?? '',
            distributor: product.distributor ?? '',
            source_description: product.source_description ?? '',
          }}
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
