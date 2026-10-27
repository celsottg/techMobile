import { useState } from "react";

import { deletePost, type Post } from "@/modules/posts";
import { ApiError } from "@/shared/api/http-client";
import { confirmDestructive, showMessage } from "@/shared/ui/dialogs";

/** Exclusão de post com confirmação (DELETE /posts/:id, só PROFESSOR). */
export function useDeletePost() {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function remove(post: Post) {
    if (deletingId !== null) return;

    const confirmed = await confirmDestructive({
      title: "Excluir post",
      message: `Tem certeza que deseja excluir "${post.titulo}"? Esta ação não pode ser desfeita.`,
      confirmLabel: "Excluir",
    });
    if (!confirmed) return;

    setDeletingId(post.id);
    try {
      // A lista recarrega sozinha (deletePost avisa que os posts mudaram).
      await deletePost(post.id);
    } catch (error) {
      // 404: o post já não existe, então a lista recarregada resolve; os demais erros são avisados.
      if (!(error instanceof ApiError && error.status === 404)) {
        showMessage(
          "Não foi possível excluir",
          error instanceof ApiError ? error.message : "Erro inesperado ao excluir o post.",
        );
      }
    } finally {
      setDeletingId(null);
    }
  }

  return { deletingId, remove };
}
