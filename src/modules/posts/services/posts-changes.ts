// Sinal de que os posts mudaram no backend (criação, e futuramente edição e remoção).
// As listas montadas observam a versão e recarregam quando ela muda, sem refetch a cada foco.
let version = 0;
const listeners = new Set<() => void>();

export function subscribePostsChanges(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPostsVersion() {
  return version;
}

export function notifyPostsChanged() {
  version += 1;
  listeners.forEach((listener) => listener());
}
