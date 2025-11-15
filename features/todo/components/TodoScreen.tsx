import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Body, Title } from '@/components/ui/Typography';
import type { TodoItem } from '@/features/todo/types';
import { useTodoStore } from '@/features/todo/state/todoStore';
import { useTodoActions } from '@/features/todo/hooks/useTodoActions';

import { AddTaskModal } from './AddTaskModal';
import { TodoForm, type TodoFormValues } from './TodoForm';
import { TodoList } from './TodoList';

// High-level screen component for the TODO feature.
// This screen:
// - Manages the TODO list state via useTodoStore.
// - Allows creating, editing, deleting, and toggling completion of tasks.
// - Enforces authentication before any mutation using useTodoActions.withAuth.

function formatTodayLabel(date: Date): string {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const weekday = weekdays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${weekday}, ${day}${getOrdinalSuffix(day)} ${month}`;
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export default function TodoScreen() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodoStatus } = useTodoStore();
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { withAuth } = useTodoActions();
  const todayLabel = useMemo(() => formatTodayLabel(new Date()), []);

  const formMode = editingTodo ? 'edit' : 'create';
  const formInitialValues: TodoFormValues | undefined = useMemo(
    () =>
      editingTodo
        ? {
            title: editingTodo.title,
            description: editingTodo.description,
            deadlineDate: editingTodo.deadlineDate,
            category: editingTodo.category,
          }
        : undefined,
    [editingTodo],
  );

  const handleSubmit = async (values: TodoFormValues) => {
    if (editingTodo) {
      const result = await withAuth(() =>
        updateTodo({
          id: editingTodo.id,
          title: values.title,
          description: values.description,
          deadlineDate: values.deadlineDate,
          category: values.category,
        }),
      );
      if (result !== null) {
        setEditingTodo(null);
      }
    } else {
      const result = await withAuth(() =>
        addTodo({
          title: values.title,
          description: values.description,
          deadlineDate: values.deadlineDate,
          category: values.category,
        }),
      );
      if (result !== null) {
        setIsCreating(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setIsCreating(false);
  };

  const handleToggleStatus = async (id: string) => {
    await withAuth(() => toggleTodoStatus(id));
  };

  const handleEdit = (item: TodoItem) => {
    setEditingTodo(item);
  };

  const handleDelete = async (id: string) => {
    const result = await withAuth(() => deleteTodo(id));
    if (result !== null && editingTodo?.id === id) {
      setEditingTodo(null);
    }
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingTodo(null);
  };

  return (
    <ScreenContainer style={styles.screenBackground}>
      <View style={styles.root}>
        <View style={styles.header}>
          <View>
            <Body style={styles.date}>{todayLabel}</Body>
            <Title style={styles.title}>Todoist</Title>
          </View>
          <Pressable hitSlop={8}>
            <Text style={styles.headerMenu}>⋯</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          {editingTodo && (
            <TodoForm
              mode={formMode}
              initialValues={formInitialValues}
              onSubmit={handleSubmit}
              onCancelEdit={handleCancelEdit}
            />
          )}

          <TodoList
            items={todos}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {!editingTodo && (
            <Pressable style={styles.fab} onPress={handleStartCreate}>
              <Text style={styles.fabLabel}>+</Text>
            </Pressable>
          )}

          {isCreating && (
            <AddTaskModal onSubmit={handleSubmit} onClose={() => setIsCreating(false)} />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screenBackground: {
    // Full-screen primary background behind the white content card.
    backgroundColor: '#6362F9',
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 25,
    borderTopLeftRadius: 48,
    // Clip children to respect the rounded corner.
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerMenu: {
    fontSize: 24,
    color: '#ffffff',
    paddingHorizontal: 4,
  },
  subtitle: {
    marginTop: 4,
    color: '#6b7280',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6362F9',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  fabLabel: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '600',
    marginTop: -2,
  },
});



