export type Role = "PROFESSOR" | "ALUNO";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
};

// Mesmo formato da resposta de POST /login.
export type Session = {
  token: string;
  role: Role;
  usuario: Usuario;
};
