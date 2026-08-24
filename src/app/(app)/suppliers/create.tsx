import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { SupplierForm } from '@/features/suppliers/components/SupplierForm';
import { useCreateSupplier } from '@/features/suppliers/hooks/useCreateSupplier';
import { supplierDetailHref } from '@/features/suppliers/utils/routes';
import type { SupplierFormValues } from '@/features/suppliers/schemas/supplierSchema';

export default function CreateSupplierScreen() {
  const { mutate, isPending } = useCreateSupplier();

  function handleSubmit(values: SupplierFormValues) {
    mutate(values, {
      onSuccess: (supplier) => {
        Alert.alert('Thành công', 'Đã tạo nhà cung cấp mới.');
        router.replace(supplierDetailHref(supplier.id));
      },
      onError: (error) => {
        Alert.alert('Không thể tạo nhà cung cấp', error.message);
      },
    });
  }

  return (
    <Screen padded>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <SupplierForm submitLabel="Tạo nhà cung cấp" isSubmitting={isPending} onSubmit={handleSubmit} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.six,
  },
});
