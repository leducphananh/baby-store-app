import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Wraps React Native's `useColorScheme` and normalizes the `null` value
 * (returned when the system preference is unknown) to `'unspecified'`,
 * matching the fallback expected by `useTheme`.
 */
export function useColorScheme(): 'light' | 'dark' | 'unspecified' {
  return useRNColorScheme() ?? 'unspecified';
}
