import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatDateTime } from '@/utils/format-date';
import { formatCurrency } from '@/utils/format-currency';
import { getProductUnitLabel } from '../constants/productUnits';
import { ProductStatusBadge } from './ProductStatusBadge';
import type { ProductWithCategory } from '../types/product';

type ProductCardProps = {
  product: ProductWithCategory;
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {title}
      </ThemedText>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

/** Displays the full master-data detail of a product (used on the detail screen). */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.field}>
        <ThemedText type="title" style={styles.name}>
          {product.name}
        </ThemedText>
        <ProductStatusBadge status={product.status} />
      </View>

      <Section title="Thông tin cơ bản">
        <Field label="SKU" value={product.sku} />
        <Field label="Mã vạch" value={product.barcode?.trim() || 'Chưa có'} />
        <Field label="Danh mục" value={product.categories?.name ?? 'Chưa phân loại'} />
        <Field label="Thương hiệu" value={product.brand?.trim() || 'Chưa có'} />
        <Field label="Đơn vị" value={getProductUnitLabel(product.unit)} />
        <Field label="Mô tả" value={product.description?.trim() || 'Chưa có'} />
      </Section>

      <Section title="Giá & tồn kho">
        <Field label="Giá bán" value={formatCurrency(product.selling_price)} />
        <Field label="Giá nhập mặc định" value={formatCurrency(product.default_purchase_price)} />
        <ThemedText type="small" themeColor="textSecondary">
          Giá nhập mặc định chỉ dùng để gợi ý khi tạo phiếu nhập, không phải giá vốn lịch sử.
        </ThemedText>
        <Field label="Mức tồn kho tối thiểu" value={`${product.minimum_stock} ${getProductUnitLabel(product.unit)}`} />
      </Section>

      <Section title="Xuất xứ">
        <Field label="Quốc gia xuất xứ" value={product.origin_country?.trim() || 'Chưa có'} />
        <Field label="Nhà sản xuất" value={product.manufacturer?.trim() || 'Chưa có'} />
        <Field label="Nhà phân phối" value={product.distributor?.trim() || 'Chưa có'} />
        <Field label="Nguồn hàng" value={product.source_description?.trim() || 'Chưa có'} />
      </Section>

      <Section title="Tồn kho">
        <ThemedText type="small" themeColor="textSecondary">
          Thông tin tồn kho sẽ được bổ sung trong module Kho hàng.
        </ThemedText>
      </Section>

      <View style={styles.row}>
        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            Ngày tạo
          </ThemedText>
          <ThemedText type="small">{formatDateTime(product.created_at)}</ThemedText>
        </View>
        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            Ngày cập nhật
          </ThemedText>
          <ThemedText type="small">{formatDateTime(product.updated_at)}</ThemedText>
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
  section: {
    gap: Spacing.two,
  },
  sectionBody: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
});
