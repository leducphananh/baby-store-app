import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Spacing } from '@/constants/theme';
import { CustomerForm } from '@/features/customers/components/CustomerForm';
import { useCustomer } from '@/features/customers/hooks/useCustomer';
import { useUpdateCustomer } from '@/features/customers/hooks/useUpdateCustomer';
import { customerDetailHref } from '@/features/customers/utils/routes';
import type { CustomerFormValues } from '@/features/customers/schemas/customerSchema';

export default function EditCustomerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: customer, isLoading, isError, error, refetch } = useCustomer(id);
  const { mutate, isPending } = useUpdateCustomer();

  function handleSubmit(values: CustomerFormValues) {
    mutate(
      { id, values },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Đã cập nhật khách hàng.');
          router.replace(customerDetailHref(id));
        },
        onError: (err) => {
          Alert.alert('Không thể cập nhật khách hàng', err.message);
        },
      }
    );
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

  return (
    <Screen padded>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <CustomerForm
          defaultValues={{
            name: customer.name,
            phone: customer.phone ?? '',
            email: customer.email ?? '',
            address: customer.address ?? '',
            notes: customer.notes ?? '',
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
