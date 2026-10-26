import { useEffect, useState } from "react";

import { ApiError } from "@/shared/api/http-client";

import { fetchPost } from "../services/posts.api";
import type { Post } from "../types";

type Status = "loading" | "success" | "error" | "not-found";

type Result =
  | { status: "success"; post: Post }
  | { status: "error"; error: string }
  | { status: "not-found" };

/** Detalhe de um post (GET /posts/:id). `id` vem da URL, então pode não ser numérico. */
export function usePost(id: string | undefined) {
  const postId = Number(id);
  const isValidId = Number.isInteger(postId) && postId > 0;

  const [reloadKey, setReloadKey] = useState(0);
  // Guarda a qual requisição (id + tentativa) o resultado pertence; enquanto não bater
  // com a atual, a tela está carregando.
  const [result, setResult] = useState<(Result & { key: string }) | null>(null);
  const requestKey = `${postId}:${reloadKey}`;

  useEffect(() => {
    if (!isValidId) return;

    // Descarta a resposta se o id mudar ou a tela desmontar antes dela chegar.
    let cancelled = false;

    async function load() {
      let next: Result;
      try {
        next = { status: "success", post: await fetchPost(postId) };
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) {
          next = { status: "not-found" };
        } else {
          next = {
            status: "error",
            error: e instanceof ApiError ? e.message : "Erro inesperado ao carregar o post.",
          };
        }
      }
      if (!cancelled) setResult({ ...next, key: requestKey });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [postId, isValidId, requestKey]);

  function retry() {
    setReloadKey((key) => key + 1);
  }

  const current = result?.key === requestKey ? result : null;
  const status: Status = !isValidId ? "not-found" : (current?.status ?? "loading");

  return {
    post: current?.status === "success" ? current.post : null,
    status,
    error: current?.status === "error" ? current.error : null,
    retry,
  };
}
