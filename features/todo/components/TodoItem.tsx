import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TodoItem as TodoItemType } from '@/features/todo/types';

// Single TODO item row component.
// Shows title, status, and basic actions (toggle + edit + delete).

export interface TodoItemProps {
  item: TodoItemType;
  onToggleStatus: (id: string) => void;
  onEdit: (item: TodoItemType) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ item, onToggleStatus, onEdit, onDelete }: TodoItemProps) {
  const isCompleted = item.status === 'completed';

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={() => onToggleStatus(item.id)}
        style={styles.mainArea}>
        <View style={[styles.statusIndicator, isCompleted && styles.statusIndicatorCompleted]} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, isCompleted && styles.titleCompleted]}>{item.title}</Text>
          {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
        </View>
      </Pressable>
      <View style={styles.actionsColumn}>
        <Pressable onPress={() => onEdit(item)} style={styles.actionButton}>
          <Text style={styles.actionText}>Edit</Text>
        </Pressable>
        <Pressable onPress={() => onDelete(item.id)} style={styles.actionButton}>
          <Text style={[styles.actionText, styles.destructiveText]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#ffffff',
  },
  mainArea: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
    gap: 12,
  },
  statusIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#d2d2ff',
    marginTop: 4,
  },
  statusIndicatorCompleted: {
    backgroundColor: '#6362F9',
    borderColor: '#6362F9',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: '#4b5563',
  },
  actionsColumn: {
    marginLeft: 8,
    alignItems: 'flex-end',
    gap: 4,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#6362F9',
  },
  destructiveText: {
    color: '#dc2626',
  },
});



