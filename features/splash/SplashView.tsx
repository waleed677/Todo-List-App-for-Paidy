import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

// Simple reusable splash view that mirrors the native splash design.
// This can be used as a fallback/loading UI inside the app if needed.

export function SplashView() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/splashLogo.png')}
        resizeMode="contain"
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6362F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 260,
    height: 260,
  },
});


