// Types for the TODO feature.
// These are intentionally simple for now and can be refined as we implement behavior.

export type TodoId = string;

export type TodoStatus = 'pending' | 'completed';

export interface TodoItem {
  id: TodoId;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: number;
  updatedAt: number;
}


