import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

/** Shown when a query/mutation fails. Always displays a friendly message. */
export function ErrorState({ message = 'Đã xảy ra lỗi. Vui lòng thử lại.', onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="default" style={styles.message}>
        {message}
      </ThemedText>
      {onRetry ? (
        <View style={styles.action}>
          <Button title="Thử lại" variant="outline" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  message: {
    textAlign: 'center',
  },
  action: {
    marginTop: Spacing.four,
  },
});
