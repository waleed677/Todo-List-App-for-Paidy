import { useCallback } from 'react';

import { useLocalAuth } from '@/features/auth/hooks/useLocalAuth';

// Hook for encapsulating TODO mutations (add, update, delete, toggle, etc.).
// At this stage, it focuses on enforcing authentication before any mutation.

export function useTodoActions() {
  const { authenticate } = useLocalAuth();

  /**
   * Higher-order helper that wraps any TODO mutation in an authentication check.
   * Usage (once the store is implemented):
   *
   * const addTodo = useCallback(
   *   (input: AddTodoInput) =>
   *     withAuth(() => todoStore.addTodo(input)),
   *   [withAuth, todoStore],
   * );
   */
  const withAuth = useCallback(
    async <T>(action: () => Promise<T> | T): Promise<T | null> => {
      const result = await authenticate();
      if (!result.success) {
        return null;
      }
      return action();
    },
    [authenticate],
  );

  return {
    withAuth,
  };
}



