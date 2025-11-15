import { act, renderHook } from '@testing-library/react-native';

import { useTodoStore } from '@/features/todo/state/todoStore';

describe('todo selectors (via useTodoStore)', () => {
  it('can derive completed and pending todos', () => {
    const { result } = renderHook(() => useTodoStore());

    act(() => {
      result.current.addTodo({ title: 'Pending item' });
      result.current.addTodo({ title: 'Completed item' });
    });

    const [first, second] = result.current.todos;

    act(() => {
      result.current.toggleTodoStatus(second.id);
    });

    const pending = result.current.todos.filter((t) => t.status === 'pending');
    const completed = result.current.todos.filter((t) => t.status === 'completed');

    expect(pending).toHaveLength(1);
    expect(pending[0].id).toBe(first.id);
    expect(completed).toHaveLength(1);
    expect(completed[0].id).toBe(second.id);
  });
});



