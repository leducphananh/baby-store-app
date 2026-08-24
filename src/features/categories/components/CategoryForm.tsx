import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { categorySchema, type CategoryFormValues } from '../schemas/categorySchema';

type CategoryFormProps = {
  defaultValues?: CategoryFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: CategoryFormValues) => void;
};

/** Create/edit form for a category. Reused by the create and edit screens. */
export function CategoryForm({ defaultValues, submitLabel, isSubmitting, onSubmit }: CategoryFormProps) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? { name: '', description: '' },
  });

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <ThemedText type="smallBold">Tên danh mục</ThemedText>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ví dụ: Sữa bột"
              placeholderTextColor={theme.textSecondary}
              style={inputStyle}
              editable={!isSubmitting}
              maxLength={100}
              accessibilityLabel="Tên danh mục"
            />
          )}
        />
        {errors.name ? (
          <ThemedText type="small" style={styles.error}>
            {errors.name.message}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Mô tả</ThemedText>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Mô tả ngắn về danh mục (không bắt buộc)"
              placeholderTextColor={theme.textSecondary}
              style={[inputStyle, styles.multiline]}
              editable={!isSubmitting}
              maxLength={500}
              multiline
              numberOfLines={4}
              accessibilityLabel="Mô tả danh mục"
            />
          )}
        />
        {errors.description ? (
          <ThemedText type="small" style={styles.error}>
            {errors.description.message}
          </ThemedText>
        ) : null}
      </View>

      <Button
        title={submitLabel}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
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
