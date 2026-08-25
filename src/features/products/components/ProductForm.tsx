import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PRODUCT_UNITS } from '../constants/productUnits';
import { CategoryPicker } from './CategoryPicker';
import { productSchema, type ProductFormValues } from '../schemas/productSchema';

type ProductFormProps = {
  defaultValues?: ProductFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: ProductFormValues) => void;
};

const EMPTY_VALUES: ProductFormValues = {
  name: '',
  sku: '',
  barcode: '',
  category_id: '',
  brand: '',
  unit: '',
  description: '',
  selling_price: '0',
  default_purchase_price: '0',
  minimum_stock: '0',
  origin_country: '',
  manufacturer: '',
  distributor: '',
  source_description: '',
};

type TextFieldConfig = {
  name: keyof ProductFormValues;
  label: string;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
  maxLength: number;
};

const ORIGIN_FIELDS: TextFieldConfig[] = [
  { name: 'origin_country', label: 'Quốc gia xuất xứ', placeholder: 'Ví dụ: Việt Nam, Nhật Bản...', maxLength: 100 },
  { name: 'manufacturer', label: 'Nhà sản xuất', placeholder: 'Tên nhà sản xuất', maxLength: 150 },
  { name: 'distributor', label: 'Nhà phân phối', placeholder: 'Tên nhà phân phối', maxLength: 150 },
  { name: 'source_description', label: 'Mô tả nguồn gốc', placeholder: 'Ghi chú thêm về nguồn hàng', multiline: true, maxLength: 500 },
];

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

/** Create/edit form for a product master-data record. Reused by the create and edit screens. */
export function ProductForm({ defaultValues, submitLabel, isSubmitting, onSubmit }: ProductFormProps) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ?? EMPTY_VALUES,
  });

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
  ];

  function renderTextField(fieldConfig: TextFieldConfig) {
    return (
      <View key={fieldConfig.name} style={styles.field}>
        <ThemedText type="smallBold">{fieldConfig.label}</ThemedText>
        <Controller
          control={control}
          name={fieldConfig.name}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={fieldConfig.placeholder}
              placeholderTextColor={theme.textSecondary}
              style={[inputStyle, fieldConfig.multiline && styles.multiline]}
              editable={!isSubmitting}
              maxLength={fieldConfig.maxLength}
              keyboardType={fieldConfig.keyboardType ?? 'default'}
              multiline={fieldConfig.multiline}
              numberOfLines={fieldConfig.multiline ? 4 : undefined}
              accessibilityLabel={fieldConfig.label}
            />
          )}
        />
        {errors[fieldConfig.name] ? (
          <ThemedText type="small" style={styles.error}>
            {errors[fieldConfig.name]?.message}
          </ThemedText>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Section title="Thông tin cơ bản">
        <View style={styles.field}>
          <ThemedText type="smallBold">Tên sản phẩm</ThemedText>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Ví dụ: Sữa bột Aptamil 800g"
                placeholderTextColor={theme.textSecondary}
                style={inputStyle}
                editable={!isSubmitting}
                maxLength={200}
                accessibilityLabel="Tên sản phẩm"
              />
            )}
          />
          {errors.name ? (
            <ThemedText type="small" style={styles.error}>
              {errors.name.message}
            </ThemedText>
          ) : null}
        </View>

        {renderTextField({ name: 'sku', label: 'SKU', placeholder: 'Ví dụ: APT-001', maxLength: 50 })}
        {renderTextField({ name: 'barcode', label: 'Mã vạch', placeholder: 'Mã vạch (nếu có)', keyboardType: 'numeric', maxLength: 64 })}

        <View style={styles.field}>
          <ThemedText type="smallBold">Danh mục</ThemedText>
          <Controller
            control={control}
            name="category_id"
            render={({ field: { value, onChange } }) => (
              <CategoryPicker value={value ?? ''} onChange={onChange} disabled={isSubmitting} />
            )}
          />
          {errors.category_id ? (
            <ThemedText type="small" style={styles.error}>
              {errors.category_id.message}
            </ThemedText>
          ) : null}
        </View>

        {renderTextField({ name: 'brand', label: 'Thương hiệu', placeholder: 'Ví dụ: Aptamil', maxLength: 150 })}

        <View style={styles.field}>
          <ThemedText type="smallBold">Đơn vị</ThemedText>
          <Controller
            control={control}
            name="unit"
            render={({ field: { value, onChange, onBlur } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ví dụ: Hộp, Gói 20 miếng, Thùng 12 gói..."
                  placeholderTextColor={theme.textSecondary}
                  style={inputStyle}
                  editable={!isSubmitting}
                  maxLength={50}
                  accessibilityLabel="Đơn vị sản phẩm"
                />
                <View style={styles.unitRow}>
                  {PRODUCT_UNITS.map((option) => (
                    <Pressable
                      key={option.value}
                      accessibilityRole="button"
                      disabled={isSubmitting}
                      onPress={() => onChange(option.label)}
                      style={[styles.unitChip, { backgroundColor: theme.backgroundElement }]}
                    >
                      <ThemedText type="small">{option.label}</ThemedText>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
          />
          <ThemedText type="small" themeColor="textSecondary">
            Chọn gợi ý để điền nhanh rồi có thể gõ thêm, ví dụ &quot;Gói 20 miếng&quot;.
          </ThemedText>
          {errors.unit ? (
            <ThemedText type="small" style={styles.error}>
              {errors.unit.message}
            </ThemedText>
          ) : null}
        </View>

        {renderTextField({ name: 'description', label: 'Mô tả', placeholder: 'Mô tả thêm về sản phẩm', multiline: true, maxLength: 2000 })}
      </Section>

      <Section title="Giá & tồn kho">
        {renderTextField({ name: 'selling_price', label: 'Giá bán (₫)', placeholder: '0', keyboardType: 'numeric', maxLength: 12 })}
        {renderTextField({
          name: 'default_purchase_price',
          label: 'Giá nhập mặc định (₫)',
          placeholder: '0',
          keyboardType: 'numeric',
          maxLength: 12,
        })}
        <ThemedText type="small" themeColor="textSecondary">
          Giá nhập mặc định chỉ dùng để gợi ý khi tạo phiếu nhập, không phải giá vốn lịch sử.
        </ThemedText>
        {renderTextField({
          name: 'minimum_stock',
          label: 'Mức tồn kho tối thiểu',
          placeholder: '0',
          keyboardType: 'numeric',
          maxLength: 12,
        })}
      </Section>

      <Section title="Xuất xứ">{ORIGIN_FIELDS.map(renderTextField)}</Section>

      <Button title={submitLabel} onPress={handleSubmit(onSubmit)} loading={isSubmitting} disabled={isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.six,
  },
  section: {
    gap: Spacing.three,
  },
  sectionBody: {
    gap: Spacing.four,
  },
  field: {
    gap: Spacing.two,
  },
  input: {
    minHeight: 48,
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  unitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  unitChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
  },
  error: {
    color: '#D92D20',
  },
});
