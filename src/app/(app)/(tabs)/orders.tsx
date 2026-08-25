import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { MenuItem } from '@/components/ui/menu-item';
import { Spacing } from '@/constants/theme';
import { customersListHref } from '@/features/customers/utils/routes';

export default function OrdersScreen() {
  return (
    <Screen padded>
      <ThemedText type="title" style={styles.title}>
        Đơn hàng
      </ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
        Quản lý khách hàng và đơn hàng.
      </ThemedText>

      <View style={styles.list}>
        <MenuItem
          icon="people-outline"
          iconColor="#208AEF"
          iconBackground="#E6F4FE"
          title="Khách hàng"
          description="Danh sách khách hàng, tìm kiếm theo SĐT, tạo mới"
          onPress={() => router.push(customersListHref())}
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
