import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuthStore } from '@/features/auth/store/authStore';
import { supabase } from '@/services/supabase/client';

export default function SettingsScreen() {
  const { session } = useAuthStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài đặt</Text>
      <Text style={styles.email}>Đăng nhập với: {session?.user?.email}</Text>
      <Button title="Đăng xuất" onPress={handleSignOut} color="#ff3b30" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
  },
});
