import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme';

type Props = PropsWithChildren<{
  contentStyle?: ViewStyle;
}>;

export function Screen({ children, contentStyle }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={[styles.content, contentStyle]}>{children}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.md,
    maxWidth: 760,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    width: '100%',
    alignSelf: 'center',
  },
});
