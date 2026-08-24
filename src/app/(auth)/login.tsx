import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/services/supabase/client';

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Show Vietnamese-friendly error without raw technical details
      Alert.alert('Đăng nhập thất bại', 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.');
    }
    setLoading(false);
  }

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
  ];

  return (
    <Screen padded>
      <View style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Quản Lý Cửa Hàng Mẹ &amp; Bé
        </ThemedText>

        <View style={styles.form}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            style={inputStyle}
            editable={!loading}
            accessibilityLabel="Email"
          />

          <View style={styles.passwordField}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Mật khẩu"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showPassword}
              style={[inputStyle, styles.passwordInput]}
              editable={!loading}
              accessibilityLabel="Mật khẩu"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeButton}
              hitSlop={8}
            >
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={theme.textSecondary} />
            </Pressable>
          </View>
        </View>

        <Button title="Đăng nhập" onPress={signInWithEmail} loading={loading} disabled={loading} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.five,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
  },
  form: {
    gap: Spacing.three,
  },
  input: {
    minHeight: 48,
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  passwordField: {
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: Spacing.three + 28,
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing.three,
    padding: Spacing.one,
  },
});
