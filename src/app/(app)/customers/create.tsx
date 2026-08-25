import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { CustomerForm } from '@/features/customers/components/CustomerForm';
import { useCreateCustomer } from '@/features/customers/hooks/useCreateCustomer';
import { customerDetailHref } from '@/features/customers/utils/routes';
import type { CustomerFormValues } from '@/features/customers/schemas/customerSchema';

export default function CreateCustomerScreen() {
  const { mutate, isPending } = useCreateCustomer();

  function handleSubmit(values: CustomerFormValues) {
    mutate(values, {
      onSuccess: (customer) => {
        Alert.alert('Thành công', 'Đã tạo khách hàng mới.');
        router.replace(customerDetailHref(customer.id));
      },
      onError: (error) => {
        Alert.alert('Không thể tạo khách hàng', error.message);
      },
    });
  }

  return (
    <Screen padded>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <CustomerForm submitLabel="Tạo khách hàng" isSubmitting={isPending} onSubmit={handleSubmit} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.six,
  },
});
