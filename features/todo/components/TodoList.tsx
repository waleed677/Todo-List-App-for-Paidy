import React from 'react';
import { FlatList } from 'react-native';

import type { TodoItem as TodoItemType } from '@/features/todo/types';

import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';

// TODO list component: responsible for rendering a collection of todo items.

export interface TodoListProps {
  items: TodoItemType[];
  onToggleStatus: (id: string) => void;
  onEdit: (item: TodoItemType) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ items, onToggleStatus, onEdit, onDelete }: TodoListProps) {
  if (!items.length) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TodoItem
          item={item}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  );
}

const styles = {};



