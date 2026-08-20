import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function DashboardScreen() {
  const { session } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Welcome back, {session?.user?.email}</Text>
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
