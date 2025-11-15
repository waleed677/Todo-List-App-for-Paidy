import { act, renderHook } from '@testing-library/react-native';

import { useTodoStore } from '@/features/todo/state/todoStore';

describe('useTodoStore', () => {
  it('adds a todo with trimmed fields', () => {
    const { result } = renderHook(() => useTodoStore());

    act(() => {
      result.current.addTodo({ title: '  Buy milk  ', description: '  2L bottle  ' });
    });

    const [first] = result.current.todos;
    expect(first.title).toBe('Buy milk');
    expect(first.description).toBe('2L bottle');
    expect(first.status).toBe('pending');
  });

  it('updates an existing todo', () => {
    const { result } = renderHook(() => useTodoStore());

    act(() => {
      result.current.addTodo({ title: 'Old title', description: 'Old desc' });
    });

    const original = result.current.todos[0];

    act(() => {
      result.current.updateTodo({
        id: original.id,
        title: 'New title',
        description: 'New desc',
      });
    });

    const updated = result.current.todos[0];
    expect(updated.id).toBe(original.id);
    expect(updated.title).toBe('New title');
    expect(updated.description).toBe('New desc');
    expect(updated.updatedAt).toBeGreaterThanOrEqual(original.updatedAt);
  });

  it('deletes a todo', () => {
    const { result } = renderHook(() => useTodoStore());

    act(() => {
      result.current.addTodo({ title: 'Item 1' });
      result.current.addTodo({ title: 'Item 2' });
    });

    const idToDelete = result.current.todos[0].id;

    act(() => {
      result.current.deleteTodo(idToDelete);
    });

    expect(result.current.todos.find((t) => t.id === idToDelete)).toBeUndefined();
  });

  it('toggles todo status between pending and completed', () => {
    const { result } = renderHook(() => useTodoStore());

    act(() => {
      result.current.addTodo({ title: 'Toggle me' });
    });

    const id = result.current.todos[0].id;
    expect(result.current.todos[0].status).toBe('pending');

    act(() => {
      result.current.toggleTodoStatus(id);
    });

    expect(result.current.todos[0].status).toBe('completed');

    act(() => {
      result.current.toggleTodoStatus(id);
    });

    expect(result.current.todos[0].status).toBe('pending');
  });
});



