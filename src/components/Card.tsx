import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../theme';

export function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
});
