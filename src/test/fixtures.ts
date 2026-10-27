import type { Post } from "@/modules/posts";
import type { Session } from "@/shared/session";

export function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: 1,
    titulo: "Primeiro post",
    conteudo: "Conteúdo do primeiro post",
    data_publicacao: "2026-06-30T12:00:00.000Z",
    data_atualizacao: "2026-06-30T12:00:00.000Z",
    ...overrides,
  };
}

export const professorSession: Session = {
  token: "professor-token",
  role: "PROFESSOR",
  usuario: { id: 1, nome: "Carlos Mendes", email: "carlos.mendes@professor.fiap.br" },
};

export const alunoSession: Session = {
  token: "aluno-token",
  role: "ALUNO",
  usuario: { id: 2, nome: "Ana Beatriz", email: "ana.beatriz@aluno.fiap.br" },
};
