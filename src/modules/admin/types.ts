// POST /professores (só PROFESSOR). A senha tem no mínimo 6 caracteres.
export type CreateProfessorInput = {
  nome: string;
  email: string;
  senha: string;
};

// PUT /professores/:id (só PROFESSOR). Sem `senha`, o backend mantém a atual.
export type UpdateProfessorInput = {
  nome: string;
  email: string;
  senha?: string;
};

// A senha nunca é devolvida pelo backend.
export type Professor = {
  id: number;
  nome: string;
  email: string;
};

// GET /professores?page&limit
export type PaginatedProfessores = {
  professores: Professor[];
  page: number;
  limit: number;
  total: number;
};

// PUT /alunos/:id (só PROFESSOR). Sem `senha`, o backend mantém a atual.
export type UpdateAlunoInput = {
  nome: string;
  email: string;
  senha?: string;
};

// A senha nunca é devolvida pelo backend.
export type Aluno = {
  id: number;
  nome: string;
  email: string;
};

// GET /alunos?page&limit
export type PaginatedAlunos = {
  alunos: Aluno[];
  page: number;
  limit: number;
  total: number;
};
