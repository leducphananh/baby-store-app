import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCategories } from '@/features/categories/hooks/useCategories';
import type { CategoryRow } from '@/features/categories/types/category';

type CategoryPickerProps = {
  value: string;
  onChange: (categoryId: string) => void;
  disabled?: boolean;
  /** When true, shows a "Tất cả danh mục" row that clears the selection (used for filtering, not the form). */
  allowClear?: boolean;
};

/**
 * Single-select category picker backed by real Category data (no hardcoded
 * IDs). Presented as a modal list rather than a native `<Picker>` since the
 * project has no picker dependency installed — this reuses only existing
 * primitives (`Modal`, `FlatList`, `Pressable`).
 */
export function CategoryPicker({ value, onChange, disabled, allowClear }: CategoryPickerProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const { data: categories, isLoading, isError, refetch } = useCategories();

  const selectedName = categories?.find((category) => category.id === value)?.name;

  function select(id: string) {
    onChange(id);
    setVisible(false);
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Chọn danh mục sản phẩm"
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={[
          styles.trigger,
          { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected, opacity: disabled ? 0.6 : 1 },
        ]}
      >
        <ThemedText type="default" themeColor={selectedName ? 'text' : 'textSecondary'}>
          {selectedName ?? 'Chọn danh mục'}
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          ›
        </ThemedText>
      </Pressable>

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <View style={styles.sheetHeader}>
            <ThemedText type="smallBold">Chọn danh mục</ThemedText>
            <Pressable accessibilityRole="button" accessibilityLabel="Đóng" onPress={() => setVisible(false)}>
              <ThemedText type="default" themeColor="textSecondary">
                Đóng
              </ThemedText>
            </Pressable>
          </View>

          {isLoading ? (
            <Loading message="Đang tải danh mục..." />
          ) : isError ? (
            <ErrorState message="Không thể tải danh mục." onRetry={refetch} />
          ) : (
            <FlatList<CategoryRow | { id: ''; name: string }>
              data={allowClear ? [{ id: '', name: 'Tất cả danh mục' }, ...(categories ?? [])] : (categories ?? [])}
              keyExtractor={(item) => item.id || '__all__'}
              style={styles.list}
              renderItem={({ item }) => {
                const isSelected = item.id === value;
                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => select(item.id)}
                    style={({ pressed }) => [
                      styles.row,
                      { backgroundColor: pressed ? theme.backgroundSelected : 'transparent' },
                    ]}
                  >
                    <ThemedText type="default" style={isSelected ? styles.selected : undefined}>
                      {item.name}
                    </ThemedText>
                    {isSelected ? <ThemedText type="default">✓</ThemedText> : null}
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Chưa có danh mục nào.
                  </ThemedText>
                </View>
              }
            />
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: 48,
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    maxHeight: '70%',
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  list: {
    paddingHorizontal: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: Spacing.two,
  },
  selected: {
    fontWeight: '700',
  },
  emptyList: {
    padding: Spacing.four,
    alignItems: 'center',
  },
});
