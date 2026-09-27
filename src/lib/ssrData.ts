declare global {
  var __SSR_DATA__: unknown | undefined;
}

/**
 * Dados injetados no momento da pré-renderização (build) e reaproveitados
 * na primeira renderização do cliente, evitando um ecrã vazio antes do fetch.
 */
export function ssrData<T = unknown>(): T | undefined {
  return globalThis.__SSR_DATA__ as T | undefined;
}
