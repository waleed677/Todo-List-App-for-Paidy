import { useCallback, useMemo, useState } from 'react';

import type { TodoItem, TodoStatus } from '@/features/todo/types';

// Simple, encapsulated TODO state hook.
// This keeps state logic in one place and makes it easy to unit test.

export interface CreateTodoInput {
  title: string;
  description?: string;
}

export interface UpdateTodoInput {
  id: string;
  title: string;
  description?: string;
}

export interface TodoStore {
  todos: TodoItem[];
  addTodo: (input: CreateTodoInput) => void;
  updateTodo: (input: UpdateTodoInput) => void;
  deleteTodo: (id: string) => void;
  toggleTodoStatus: (id: string) => void;
}

export function useTodoStore(initialTodos: TodoItem[] = []): TodoStore {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

  const addTodo = useCallback((input: CreateTodoInput) => {
    const timestamp = Date.now();
    const next: TodoItem = {
      id: `${timestamp}-${Math.random().toString(16).slice(2)}`,
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setTodos((current) => [next, ...current]);
  }, []);

  const updateTodo = useCallback((input: UpdateTodoInput) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === input.id
          ? {
              ...todo,
              title: input.title.trim(),
              description: input.description?.trim() || undefined,
              updatedAt: Date.now(),
            }
          : todo,
      ),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }, []);

  const toggleTodoStatus = useCallback((id: string) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status: toggleStatus(todo.status),
              updatedAt: Date.now(),
            }
          : todo,
      ),
    );
  }, []);

  return useMemo(
    () => ({
      todos,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodoStatus,
    }),
    [todos, addTodo, updateTodo, deleteTodo, toggleTodoStatus],
  );
}

function toggleStatus(status: TodoStatus): TodoStatus {
  return status === 'pending' ? 'completed' : 'pending';
}



