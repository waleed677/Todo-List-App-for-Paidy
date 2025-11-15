import React, { type ReactNode } from 'react';
import { StyleSheet, Text, type TextProps as RNTextProps } from 'react-native';

// Simple typography primitives for consistent text styling across the app.

export interface TextProps extends RNTextProps {
  children: ReactNode;
}

export function Title({ children, style, ...rest }: TextProps) {
  return (
    <Text {...rest} style={[styles.title, style]}>
      {children}
    </Text>
  );
}

export function Body({ children, style, ...rest }: TextProps) {
  return (
    <Text {...rest} style={[styles.body, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
});


