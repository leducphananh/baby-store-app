import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { MenuItem } from '@/components/ui/menu-item';
import { Spacing } from '@/constants/theme';
import { categoriesListHref } from '@/features/categories/utils/routes';
import { suppliersListHref } from '@/features/suppliers/utils/routes';
import { productsListHref } from '@/features/products/utils/routes';

export default function InventoryScreen() {
  return (
    <Screen padded>
      <ThemedText type="title" style={styles.title}>
        Kho hàng
      </ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
        Quản lý danh mục, nhà cung cấp và tồn kho sản phẩm.
      </ThemedText>

      <View style={styles.list}>
        <MenuItem
          icon="cube-outline"
          iconColor="#B45309"
          iconBackground="#FEF3C7"
          title="Sản phẩm"
          description="Danh sách sản phẩm, giá bán, xuất xứ..."
          onPress={() => router.push(productsListHref())}
        />
        <MenuItem
          icon="pricetags-outline"
          iconColor="#208AEF"
          iconBackground="#E6F4FE"
          title="Danh mục sản phẩm"
          description="Quản lý các nhóm hàng: bỉm, sữa, bình sữa..."
          onPress={() => router.push(categoriesListHref())}
        />
        <MenuItem
          icon="people-outline"
          iconColor="#15803D"
          iconBackground="#DCFCE7"
          title="Nhà cung cấp"
          description="Danh sách NCC, thông tin liên hệ và trạng thái"
          onPress={() => router.push(suppliersListHref())}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    marginTop: Spacing.one,
    marginBottom: Spacing.five,
  },
  list: {
    gap: Spacing.two,
  },
});
