import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { formatCurrency } from '@/utils/format-currency';
import { getProductUnitLabel } from '../constants/productUnits';
import { ProductStatusBadge } from './ProductStatusBadge';
import type { ProductWithCategory } from '../types/product';

type ProductListItemProps = {
  product: ProductWithCategory;
  onPress: (product: ProductWithCategory) => void;
};

/**
 * A single row in the product list. Deliberately shows only master data
 * (name, SKU, category, price, unit, status) — never stock/availability,
 * which belongs to the Inventory phase and does not exist on `products`.
 */
export function ProductListItem({ product, onPress }: ProductListItemProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(product)}
      style={({ pressed }) => [styles.container, { backgroundColor: pressed ? theme.backgroundSelected : theme.background }]}
    >
      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <ThemedText type="default" numberOfLines={1} style={styles.name}>
            {product.name}
          </ThemedText>
          <ProductStatusBadge status={product.status} />
        </View>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={styles.subtitle}>
          {[product.sku, product.categories?.name ?? 'Chưa phân loại'].join(' • ')}
        </ThemedText>
        <View style={styles.priceRow}>
          <ThemedText type="smallBold">{formatCurrency(product.selling_price)}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            / {getProductUnitLabel(product.unit)}
          </ThemedText>
        </View>
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
    minHeight: 76,
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: Spacing.half,
  },
});
