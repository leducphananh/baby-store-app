import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatDateTime } from '@/utils/format-date';
import { getSupplierStatusLabel } from '../utils/status';
import type { SupplierRow } from '../types/supplier';

type SupplierCardProps = {
  supplier: SupplierRow;
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

/** Displays the full detail of a supplier (used on the detail screen). */
export function SupplierCard({ supplier }: SupplierCardProps) {
  const isArchived = supplier.status === 'archived';

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.field}>
        <ThemedText type="small" themeColor="textSecondary">
          Tên nhà cung cấp
        </ThemedText>
        <ThemedText type="title" style={styles.name}>
          {supplier.name}
        </ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: isArchived ? '#E0E1E6' : '#DCFCE7' }]}>
          <ThemedText type="small" style={{ color: isArchived ? '#60646C' : '#15803D' }}>
            {getSupplierStatusLabel(supplier.status)}
          </ThemedText>
        </View>
      </View>

      <Field label="Số điện thoại" value={supplier.phone?.trim() || 'Chưa có'} />
      <Field label="Email" value={supplier.email?.trim() || 'Chưa có'} />
      <Field label="Địa chỉ" value={supplier.address?.trim() || 'Chưa có'} />
      <Field label="Mã số thuế" value={supplier.tax_code?.trim() || 'Chưa có'} />
      <Field label="Người liên hệ" value={supplier.contact_person?.trim() || 'Chưa có'} />
      <Field label="Ghi chú" value={supplier.notes?.trim() || 'Chưa có'} />

      <View style={styles.row}>
        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            Ngày tạo
          </ThemedText>
          <ThemedText type="small">{formatDateTime(supplier.created_at)}</ThemedText>
        </View>
        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            Ngày cập nhật
          </ThemedText>
          <ThemedText type="small">{formatDateTime(supplier.updated_at)}</ThemedText>
        </View>
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
