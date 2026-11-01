import { useState } from "react";

import { ApiError } from "@/shared/api/http-client";
import { confirmDestructive, showMessage } from "@/shared/ui/dialogs";

import { deleteAluno } from "../services/alunos.api";
import type { Aluno } from "../types";

/** Exclusão de aluno com confirmação (DELETE /alunos/:id, só PROFESSOR). */
export function useDeleteAluno() {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function remove(aluno: Aluno) {
    if (deletingId !== null) return;

    const confirmed = await confirmDestructive({
      title: "Excluir aluno",
      message: `Tem certeza que deseja excluir "${aluno.nome}"? Esta ação não pode ser desfeita.`,
      confirmLabel: "Excluir",
    });
    if (!confirmed) return;

    setDeletingId(aluno.id);
    try {
      // A lista recarrega sozinha (deleteAluno avisa que os alunos mudaram).
      await deleteAluno(aluno.id);
    } catch (error) {
      // 404: o aluno já não existe, então a lista recarregada resolve; os demais erros são avisados.
      if (!(error instanceof ApiError && error.status === 404)) {
        showMessage(
          "Não foi possível excluir",
          error instanceof ApiError ? error.message : "Erro inesperado ao excluir o aluno.",
        );
      }
    } finally {
      setDeletingId(null);
    }
  }

  return { deletingId, remove };
}
