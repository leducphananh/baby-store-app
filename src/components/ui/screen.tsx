import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

type ScreenProps = ViewProps & {
  edges?: Edge[];
  padded?: boolean;
};

/**
 * Base screen wrapper: applies the themed background and safe-area insets.
 * Use for every route screen instead of a bare `View`.
 */
export function Screen({ style, edges, padded = false, children, ...rest }: ScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={edges ?? ['top', 'bottom', 'left', 'right']}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.container, padded && styles.padded, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padded: {
    padding: 16,
  },
});
