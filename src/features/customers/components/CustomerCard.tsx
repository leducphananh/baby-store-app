import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatDateTime } from '@/utils/format-date';
import { getCustomerStatusLabel } from '../utils/status';
import type { CustomerRow } from '../types/customer';

type CustomerCardProps = {
  customer: CustomerRow;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="default">{value}</ThemedText>
    </View>
  );
}

/** Displays the full detail of a customer (used on the detail screen). */
export function CustomerCard({ customer }: CustomerCardProps) {
  const isArchived = customer.status === 'archived';

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.field}>
        <ThemedText type="small" themeColor="textSecondary">
          Tên khách hàng
        </ThemedText>
        <ThemedText type="title" style={styles.name}>
          {customer.name}
        </ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: isArchived ? '#E0E1E6' : '#DCFCE7' }]}>
          <ThemedText type="small" style={{ color: isArchived ? '#60646C' : '#15803D' }}>
            {getCustomerStatusLabel(customer.status)}
          </ThemedText>
        </View>
      </View>

      <Field label="Số điện thoại" value={customer.phone?.trim() || 'Chưa có'} />
      <Field label="Email" value={customer.email?.trim() || 'Chưa có'} />
      <Field label="Địa chỉ" value={customer.address?.trim() || 'Chưa có'} />
      <Field label="Ghi chú" value={customer.notes?.trim() || 'Chưa có'} />

      <View style={styles.row}>
        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            Ngày tạo
          </ThemedText>
          <ThemedText type="small">{formatDateTime(customer.created_at)}</ThemedText>
        </View>
        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            Ngày cập nhật
          </ThemedText>
          <ThemedText type="small">{formatDateTime(customer.updated_at)}</ThemedText>
        </View>
      </View>

      <View style={styles.field}>
        <ThemedText type="small" themeColor="textSecondary">
          Lịch sử mua hàng
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Lịch sử mua hàng sẽ được bổ sung ở module Đơn hàng.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  field: {
    gap: Spacing.half,
    flex: 1,
  },
  name: {
    fontSize: 24,
    lineHeight: 30,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 999,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
});
