// Sinal de que os professores mudaram no backend (cadastro).
// A lista montada observa a versão e recarrega quando ela muda, sem refetch a cada foco.
let version = 0;
const listeners = new Set<() => void>();

export function subscribeProfessoresChanges(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getProfessoresVersion() {
  return version;
}

export function notifyProfessoresChanged() {
  version += 1;
  listeners.forEach((listener) => listener());
}
