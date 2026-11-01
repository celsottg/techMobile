// Sinal de que os alunos mudaram no backend (cadastro, edição e exclusão).
// A lista montada observa a versão e recarrega quando ela muda, sem refetch a cada foco.
let version = 0;
const listeners = new Set<() => void>();

export function subscribeAlunosChanges(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAlunosVersion() {
  return version;
}

export function notifyAlunosChanged() {
  version += 1;
  listeners.forEach((listener) => listener());
}
