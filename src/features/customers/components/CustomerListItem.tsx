import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { getCustomerStatusLabel } from '../utils/status';
import type { CustomerRow } from '../types/customer';

type CustomerListItemProps = {
  customer: CustomerRow;
  onPress: (customer: CustomerRow) => void;
};

/** A single row in the customer list. Phone is shown first — it is the primary search/contact key. */
export function CustomerListItem({ customer, onPress }: CustomerListItemProps) {
  const theme = useTheme();
  const isArchived = customer.status === 'archived';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(customer)}
      style={({ pressed }) => [styles.container, { backgroundColor: pressed ? theme.backgroundSelected : theme.background }]}
    >
      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <ThemedText type="default" numberOfLines={1} style={styles.name}>
            {customer.name}
          </ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: isArchived ? theme.backgroundSelected : '#DCFCE7' }]}>
            <ThemedText type="small" style={{ color: isArchived ? theme.textSecondary : '#15803D' }}>
              {getCustomerStatusLabel(customer.status)}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={styles.subtitle}>
          {[customer.phone, customer.email].filter(Boolean).join(' • ') || 'Chưa có thông tin liên hệ'}
        </ThemedText>
      </View>
      <ThemedText type="default" themeColor="textSecondary">
        ›
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  textContainer: {
    flex: 1,
    gap: Spacing.half,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: {
    flexShrink: 1,
  },
  subtitle: {
    marginTop: Spacing.half,
  },
  statusBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 999,
  },
});
