import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// Simple empty state component for the TODO list.
// Shows an illustration and guidance text when there are no tasks.

export function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Image
        source={require('@/assets/images/empty.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>No Tasks Yet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#9ca3af',
  },
});


