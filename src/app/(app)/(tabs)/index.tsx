import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function DashboardScreen() {
  const { session } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tổng quan</Text>
      <Text>Chào mừng trở lại, {session?.user?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
