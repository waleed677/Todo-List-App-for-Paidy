import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
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
        <View style={[styles.statusIndicator, isCompleted && styles.statusIndicatorCompleted]}>
          {isCompleted && <Text style={styles.statusCheck}>✓</Text>}
        </View>
        <View style={styles.textContainer}>
          {item.deadlineDate ? (
            <Text style={styles.dateText}>{item.deadlineDate}</Text>
          ) : null}
          <Text style={[styles.title, isCompleted && styles.titleCompleted]}>{item.title}</Text>
          {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
        </View>
      </Pressable>
      <View style={styles.actionsColumn}>
        <Pressable onPress={() => onEdit(item)} style={styles.iconButton} hitSlop={8}>
          <IconSymbol name="pencil" size={18} color="#9ca3af" />
        </Pressable>
        <Pressable onPress={() => onDelete(item.id)} style={styles.iconButton} hitSlop={8}>
          <IconSymbol name="trash" size={18} color="#f97373" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    // Slightly tinted background so each card stands out from the main white card.
    backgroundColor: '#F9FAFB',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  mainArea: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
    gap: 12,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6362F9',
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicatorCompleted: {
    backgroundColor: '#6362F9',
    borderColor: '#6362F9',
  },
  statusCheck: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  textContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
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
    justifyContent: 'space-between',
    gap: 8,
  },
  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});



