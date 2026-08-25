import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { customerSchema, type CustomerFormValues } from '../schemas/customerSchema';

type CustomerFormProps = {
  defaultValues?: CustomerFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: CustomerFormValues) => void;
};

const EMPTY_VALUES: CustomerFormValues = {
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
};

type FieldConfig = {
  name: keyof CustomerFormValues;
  label: string;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
  maxLength: number;
};

const FIELDS: FieldConfig[] = [
  { name: 'phone', label: 'Số điện thoại', placeholder: 'Ví dụ: 0901234567', keyboardType: 'phone-pad', maxLength: 20 },
  { name: 'email', label: 'Email', placeholder: 'Ví dụ: khachhang@email.com', keyboardType: 'email-address', maxLength: 255 },
  { name: 'address', label: 'Địa chỉ', placeholder: 'Địa chỉ khách hàng', maxLength: 255 },
  { name: 'notes', label: 'Ghi chú', placeholder: 'Ghi chú thêm (không bắt buộc)', multiline: true, maxLength: 1000 },
];

/** Create/edit form for a customer. Reused by the create and edit screens. */
export function CustomerForm({ defaultValues, submitLabel, isSubmitting, onSubmit }: CustomerFormProps) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: defaultValues ?? EMPTY_VALUES,
  });

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <ThemedText type="smallBold">Tên khách hàng</ThemedText>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ví dụ: Nguyễn Thị Hương"
              placeholderTextColor={theme.textSecondary}
              style={inputStyle}
              editable={!isSubmitting}
              maxLength={150}
              accessibilityLabel="Tên khách hàng"
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
