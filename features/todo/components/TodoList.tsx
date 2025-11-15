import React from 'react';
import { View } from 'react-native';

import type { TodoItem } from '@/features/todo/types';

// TODO list component: responsible for rendering a collection of todo items.
// Implementation will follow once state management is defined.

export interface TodoListProps {
  items: TodoItem[];
}

export function TodoList(_props: TodoListProps) {
  return (
    <View>
      {/* TODO: Render list of TodoItem components */}
    </View>
  );
}


