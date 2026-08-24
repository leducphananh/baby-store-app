import { Stack } from 'expo-router';

export default function SuppliersLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Nhà cung cấp' }} />
      <Stack.Screen name="create" options={{ title: 'Thêm nhà cung cấp', presentation: 'modal' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Chi tiết nhà cung cấp' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Chỉnh sửa nhà cung cấp', presentation: 'modal' }} />
    </Stack>
  );
}
