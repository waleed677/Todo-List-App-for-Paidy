import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
} from 'react-native';

// Minimal shared text input component to keep input styling consistent.

export type TextInputProps = RNTextInputProps;

export function TextInput(props: TextInputProps) {
  return <RNTextInput {...props} style={[styles.input, props.style]} />;
}

const styles = StyleSheet.create({
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
});


