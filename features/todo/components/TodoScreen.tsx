import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Body, Title } from '@/components/ui/Typography';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { TodoItem } from '@/features/todo/types';
import { useTodoStore } from '@/features/todo/state/todoStore';
import { resetLocalAuthSession, useLocalAuth } from '@/features/auth/hooks/useLocalAuth';

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

type FilterValue = 'all' | 'completed' | 'pending';

export default function TodoScreen() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodoStatus } = useTodoStore();
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [filter, setFilter] = useState<FilterValue>('all');
  const { authenticate } = useLocalAuth();
  const [isAuthed, setIsAuthed] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const todayLabel = useMemo(() => formatTodayLabel(new Date()), []);

  const filteredTodos = useMemo(() => {
    if (filter === 'completed') {
      return todos.filter((todo) => todo.status === 'completed');
    }
    if (filter === 'pending') {
      return todos.filter((todo) => todo.status === 'pending');
    }
    return todos;
  }, [todos, filter]);

  const handleSubmit = async (values: TodoFormValues) => {
    if (editingTodo) {
      updateTodo({
        id: editingTodo.id,
        title: values.title,
        description: values.description,
        deadlineDate: values.deadlineDate,
        category: values.category,
      });

      // If user changed completion status, sync the store.
      if (typeof values.isCompleted === 'boolean') {
        const currentlyCompleted = editingTodo.status === 'completed';
        if (values.isCompleted !== currentlyCompleted) {
          toggleTodoStatus(editingTodo.id);
        }
      }

      setEditingTodo(null);
      setModalMode(null);
    } else {
      addTodo({
        title: values.title,
        description: values.description,
        deadlineDate: values.deadlineDate,
        category: values.category,
      });
      setModalMode(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setModalMode(null);
  };

  const ensureAuthedOrPrompt = async (): Promise<boolean> => {
    if (isAuthed) {
      return true;
    }
    const result = await authenticate();
    if (result.success) {
      setIsAuthed(true);
      return true;
    }
    Alert.alert('Authentication required', 'Please authenticate to modify your tasks.');
    return false;
  };

  const handleToggleStatus = async (id: string) => {
    const ok = await ensureAuthedOrPrompt();
    if (!ok) return;
    toggleTodoStatus(id);
  };

  const handleEdit = (item: TodoItem) => {
    if (!isAuthed) {
      // Ask the user to log in first.
      ensureAuthedOrPrompt().then((ok) => {
        if (!ok) return;
        setEditingTodo(item);
        setModalMode('edit');
      });
      return;
    }
    setEditingTodo(item);
    setModalMode('edit');
  };

  const handleDelete = async (id: string) => {
    const ok = await ensureAuthedOrPrompt();
    if (!ok) return;

    Alert.alert('Delete task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTodo(id);
          if (editingTodo?.id === id) {
            setEditingTodo(null);
          }
        },
      },
    ]);
  };

  const handleStartCreate = () => {
    // For safety, still ensure auth; if already authed this is instant.
    ensureAuthedOrPrompt().then((ok) => {
      if (!ok) return;
      setModalMode('create');
      setEditingTodo(null);
    });
  };

  const handleLogin = () => {
    // Only perform authentication; do not open the Add popup.
    ensureAuthedOrPrompt();
  };

  const handleLogout = () => {
    resetLocalAuthSession();
    setIsAuthed(false);
    setEditingTodo(null);
    setModalMode(null);
    setIsHeaderMenuOpen(false);
  };

  return (
    <ScreenContainer style={styles.screenBackground}>
      <View style={styles.root}>
        <View style={styles.header}>
          <View>
            <Body style={styles.date}>{todayLabel}</Body>
            <Title style={styles.title}>Todoist</Title>
          </View>
          {isAuthed && (
            <View>
              <Pressable
                hitSlop={8}
                onPress={() => setIsHeaderMenuOpen((open) => !open)}>
                <Text style={styles.headerMenu}>⋯</Text>
              </Pressable>
              {isHeaderMenuOpen && (
                <View style={styles.headerMenuDropdown}>
                  <Pressable style={styles.headerMenuItem} onPress={handleLogout}>
                    <Text style={styles.headerMenuItemText}>Logout</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.filterRow}>
            {(['all', 'completed', 'pending'] as FilterValue[]).map((value) => (
              <Pressable
                key={value}
                onPress={() => setFilter(value)}
                style={[
                  styles.filterChip,
                  filter === value && styles.filterChipActive,
                ]}>
                <Text
                  style={[
                    styles.filterLabel,
                    filter === value && styles.filterLabelActive,
                  ]}>
                  {value === 'all'
                    ? 'All'
                    : value === 'completed'
                    ? 'Completed'
                    : 'Pending'}
                </Text>
              </Pressable>
            ))}
          </View>

          <TodoList
            items={filteredTodos}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {!editingTodo &&
            (isAuthed ? (
              <Pressable style={styles.fab} onPress={handleStartCreate}>
                <Text style={styles.fabLabel}>+</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.loginFab} onPress={handleLogin}>
                <IconSymbol name="lock.fill" size={20} color="#ffffff" />
              </Pressable>
            ))}

          {modalMode && (
            <AddTaskModal
              mode={modalMode}
              initialValues={
                modalMode === 'edit' && editingTodo
                  ? {
                      title: editingTodo.title,
                      description: editingTodo.description,
                      deadlineDate: editingTodo.deadlineDate,
                      category: editingTodo.category,
                      isCompleted: editingTodo.status === 'completed',
                    }
                  : undefined
              }
              onSubmit={handleSubmit}
              onClose={handleCancelEdit}
            />
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
    position: 'relative',
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
  headerMenuDropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
    zIndex: 10,
  },
  headerMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerMenuItemText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
  subtitle: {
    marginTop: 4,
    color: '#6b7280',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  filterChipActive: {
    backgroundColor: '#6362F9',
    borderColor: '#6362F9',
  },
  filterLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  filterLabelActive: {
    color: '#ffffff',
    fontWeight: '600',
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
  loginFab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#6362F9',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  loginFabLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});



