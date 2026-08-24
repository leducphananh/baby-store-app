import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Spacing } from '@/constants/theme';
import { SupplierForm } from '@/features/suppliers/components/SupplierForm';
import { useSupplier } from '@/features/suppliers/hooks/useSupplier';
import { useUpdateSupplier } from '@/features/suppliers/hooks/useUpdateSupplier';
import { supplierDetailHref } from '@/features/suppliers/utils/routes';
import type { SupplierFormValues } from '@/features/suppliers/schemas/supplierSchema';

export default function EditSupplierScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: supplier, isLoading, isError, error, refetch } = useSupplier(id);
  const { mutate, isPending } = useUpdateSupplier();

  function handleSubmit(values: SupplierFormValues) {
    mutate(
      { id, values },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Đã cập nhật nhà cung cấp.');
          router.replace(supplierDetailHref(id));
        },
        onError: (err) => {
          Alert.alert('Không thể cập nhật nhà cung cấp', err.message);
        },
      }
    );
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

  return (
    <Screen padded>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <SupplierForm
          defaultValues={{
            name: supplier.name,
            phone: supplier.phone ?? '',
            email: supplier.email ?? '',
            address: supplier.address ?? '',
            tax_code: supplier.tax_code ?? '',
            contact_person: supplier.contact_person ?? '',
            notes: supplier.notes ?? '',
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
