// Simple logging helper to centralize logging behavior.
// This can be expanded to integrate with remote logging if needed.

export function logDebug(message: string, extra?: unknown) {
  // eslint-disable-next-line no-console
  console.debug(message, extra);
}

export function logError(message: string, extra?: unknown) {
  // eslint-disable-next-line no-console
  console.error(message, extra);
}


