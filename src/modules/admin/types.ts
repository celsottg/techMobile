// POST /professores (só PROFESSOR). A senha tem no mínimo 6 caracteres.
export type CreateProfessorInput = {
  nome: string;
  email: string;
  senha: string;
};

// A senha nunca é devolvida pelo backend.
export type Professor = {
  id: number;
  nome: string;
  email: string;
};
