import { KeyboardTypeOptions, StyleSheet, TextInput, View } from 'react-native';

import { colors, radii, spacing } from '../theme';
import { Caption } from './Typography';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
};

export function FormField({ label, value, onChangeText, placeholder, keyboardType }: Props) {
  return (
    <View style={styles.wrap}>
      <Caption>{label}</Caption>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
});
