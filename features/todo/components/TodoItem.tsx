import React from 'react';
import { View } from 'react-native';

import type { TodoItem as TodoItemType } from '@/features/todo/types';

// Single TODO item row component.
// Implementation will be filled in when we wire up interactions.

export interface TodoItemProps {
  item: TodoItemType;
}

export function TodoItem(_props: TodoItemProps) {
  return (
    <View>
      {/* TODO: Render a single todo item with title, status, and actions */}
    </View>
  );
}


