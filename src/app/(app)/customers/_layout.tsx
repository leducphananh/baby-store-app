import { Stack } from 'expo-router';

export default function CustomersLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Khách hàng' }} />
      <Stack.Screen name="create" options={{ title: 'Thêm khách hàng', presentation: 'modal' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Chi tiết khách hàng' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Chỉnh sửa khách hàng', presentation: 'modal' }} />
    </Stack>
  );
}
