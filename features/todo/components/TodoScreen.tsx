import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Body, Title } from '@/components/ui/Typography';
import type { TodoItem } from '@/features/todo/types';
import { useTodoStore } from '@/features/todo/state/todoStore';
import { useTodoActions } from '@/features/todo/hooks/useTodoActions';

import { TodoForm, type TodoFormValues } from './TodoForm';
import { TodoList } from './TodoList';

// High-level screen component for the TODO feature.
// This screen:
// - Manages the TODO list state via useTodoStore.
// - Allows creating, editing, deleting, and toggling completion of tasks.
// - Enforces authentication before any mutation using useTodoActions.withAuth.

export default function TodoScreen() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodoStatus } = useTodoStore();
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { withAuth } = useTodoActions();

  const formMode = editingTodo ? 'edit' : 'create';
  const formInitialValues: TodoFormValues | undefined = useMemo(
    () =>
      editingTodo
        ? {
            title: editingTodo.title,
            description: editingTodo.description,
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
    <ScreenContainer>
      <View style={styles.root}>
        <View style={styles.header}>
          <Title style={styles.title}>Todoist</Title>
          <Body style={styles.subtitle}>Stay on top of what matters today.</Body>
        </View>

        {(isCreating || editingTodo) && (
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
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
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



