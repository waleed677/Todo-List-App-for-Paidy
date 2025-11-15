import React, { type ReactNode } from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';

// Simple shared screen wrapper to keep screen layout consistent.

export interface ScreenContainerProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function ScreenContainer({ children, style }: ScreenContainerProps) {
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // App-wide background should be white except for the dedicated splash screen.
    backgroundColor: '#ffffff',
  },
});


