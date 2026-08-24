import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { categoriesListHref } from '@/features/categories/utils/routes';

export default function InventoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kho hàng</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(categoriesListHref())}
        style={styles.link}
      >
        <Text style={styles.linkText}>Danh mục sản phẩm</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  link: {
    minHeight: 48,
    paddingHorizontal: 24,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#208AEF',
  },
  linkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
