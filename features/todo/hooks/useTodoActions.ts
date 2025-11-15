// This hook previously wrapped TODO actions with authentication.
// The flow has been simplified so that the user authenticates once up front
// (via an explicit "Login" action) and all subsequent mutations are allowed
// without re-prompting. This hook is kept as a placeholder for future
// extensions, but it currently just executes actions directly.

export function useTodoActions() {
  async function withAuth<T>(action: () => Promise<T> | T): Promise<T | null> {
    return action();
  }

  return { withAuth };
}



