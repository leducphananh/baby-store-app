import { Stack } from 'expo-router';

export default function ProductsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Sản phẩm' }} />
      <Stack.Screen name="create" options={{ title: 'Thêm sản phẩm', presentation: 'modal' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Chi tiết sản phẩm' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Chỉnh sửa sản phẩm', presentation: 'modal' }} />
    </Stack>
  );
}
