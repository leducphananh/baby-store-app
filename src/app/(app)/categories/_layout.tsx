import { Stack } from 'expo-router';

export default function CategoriesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Danh mục sản phẩm' }} />
      <Stack.Screen name="create" options={{ title: 'Thêm danh mục', presentation: 'modal' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Chi tiết danh mục' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Chỉnh sửa danh mục', presentation: 'modal' }} />
    </Stack>
  );
}
