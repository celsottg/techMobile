import { useState } from "react";

import { ApiError } from "@/shared/api/http-client";
import { confirmDestructive, showMessage } from "@/shared/ui/dialogs";

import { deleteProfessor } from "../services/professores.api";
import type { Professor } from "../types";

/** Exclusão de professor com confirmação (DELETE /professores/:id, só PROFESSOR). */
export function useDeleteProfessor() {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function remove(professor: Professor) {
    if (deletingId !== null) return;

    const confirmed = await confirmDestructive({
      title: "Excluir professor",
      message: `Tem certeza que deseja excluir "${professor.nome}"? Esta ação não pode ser desfeita.`,
      confirmLabel: "Excluir",
    });
    if (!confirmed) return;

    setDeletingId(professor.id);
    try {
      // A lista recarrega sozinha (deleteProfessor avisa que os professores mudaram).
      await deleteProfessor(professor.id);
    } catch (error) {
      // 404: o professor já não existe, então a lista recarregada resolve; os demais erros são avisados.
      if (!(error instanceof ApiError && error.status === 404)) {
        showMessage(
          "Não foi possível excluir",
          error instanceof ApiError ? error.message : "Erro inesperado ao excluir o professor.",
        );
      }
    } finally {
      setDeletingId(null);
    }
  }

  return { deletingId, remove };
}
