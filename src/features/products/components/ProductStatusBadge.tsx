import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { getProductStatusLabel } from '../utils/status';

type ProductStatusBadgeProps = {
  status: string;
};

/** Small colored pill for a product's status. Shared by the list item and the detail card. */
export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const theme = useTheme();
  const isArchived = status === 'archived';

  return (
    <View style={[styles.badge, { backgroundColor: isArchived ? theme.backgroundSelected : '#DCFCE7' }]}>
      <ThemedText type="small" style={{ color: isArchived ? theme.textSecondary : '#15803D' }}>
        {getProductStatusLabel(status)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
});
