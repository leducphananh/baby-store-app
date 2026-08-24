import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { supplierSchema, type SupplierFormValues } from '../schemas/supplierSchema';

type SupplierFormProps = {
  defaultValues?: SupplierFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: SupplierFormValues) => void;
};

const EMPTY_VALUES: SupplierFormValues = {
  name: '',
  phone: '',
  email: '',
  address: '',
  tax_code: '',
  contact_person: '',
  notes: '',
};

type FieldConfig = {
  name: keyof SupplierFormValues;
  label: string;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
  maxLength: number;
};

const FIELDS: FieldConfig[] = [
  { name: 'phone', label: 'Số điện thoại', placeholder: 'Ví dụ: 0901234567', keyboardType: 'phone-pad', maxLength: 20 },
  { name: 'email', label: 'Email', placeholder: 'Ví dụ: contact@nhacungcap.vn', keyboardType: 'email-address', maxLength: 255 },
  { name: 'address', label: 'Địa chỉ', placeholder: 'Địa chỉ nhà cung cấp', maxLength: 255 },
  { name: 'tax_code', label: 'Mã số thuế', placeholder: 'Mã số thuế (nếu có)', maxLength: 50 },
  { name: 'contact_person', label: 'Người liên hệ', placeholder: 'Tên người liên hệ', maxLength: 150 },
  { name: 'notes', label: 'Ghi chú', placeholder: 'Ghi chú thêm (không bắt buộc)', multiline: true, maxLength: 1000 },
];

/** Create/edit form for a supplier. Reused by the create and edit screens. */
export function SupplierForm({ defaultValues, submitLabel, isSubmitting, onSubmit }: SupplierFormProps) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: defaultValues ?? EMPTY_VALUES,
  });

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <ThemedText type="smallBold">Tên nhà cung cấp</ThemedText>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ví dụ: Công ty TNHH Thư Hưng"
              placeholderTextColor={theme.textSecondary}
              style={inputStyle}
              editable={!isSubmitting}
              maxLength={150}
              accessibilityLabel="Tên nhà cung cấp"
            />
          )}
        />
        {errors.name ? (
          <ThemedText type="small" style={styles.error}>
            {errors.name.message}
          </ThemedText>
        ) : null}
      </View>

      {FIELDS.map((fieldConfig) => (
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
                autoCapitalize={fieldConfig.keyboardType === 'email-address' ? 'none' : 'sentences'}
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
      ))}

      <Button title={submitLabel} onPress={handleSubmit(onSubmit)} loading={isSubmitting} disabled={isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  error: {
    color: '#D92D20',
  },
});
