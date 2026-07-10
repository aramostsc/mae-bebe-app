import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { colors } from '../theme';

type Props = PropsWithChildren<TextProps>;

export function Title({ children, style, ...props }: Props) {
  return (
    <Text style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
}

export function Heading({ children, style, ...props }: Props) {
  return (
    <Text style={[styles.heading, style]} {...props}>
      {children}
    </Text>
  );
}

export function Body({ children, style, ...props }: Props) {
  return (
    <Text style={[styles.body, style]} {...props}>
      {children}
    </Text>
  );
}

export function Caption({ children, style, ...props }: Props) {
  return (
    <Text style={[styles.caption, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  heading: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  body: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 23,
  },
  caption: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
