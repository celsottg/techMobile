import { useEffect, useRef, useState } from "react";

import { ApiError } from "@/shared/api/http-client";

import { fetchAlunos } from "../services/alunos.api";
import type { Aluno } from "../types";

const PAGE_SIZE = 10;

type Status = "loading" | "success" | "error";

function errorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : "Erro inesperado ao carregar os alunos.";
}

/** Listagem paginada de alunos (GET /alunos, só PROFESSOR), com rolagem infinita. */
export function useAlunos() {
  const [reloadKey, setReloadKey] = useState(0);

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Incrementado a cada nova carga da primeira página; respostas de cargas antigas são descartadas.
  const generation = useRef(0);
  // Pull-to-refresh mantém a lista visível em vez de trocar para o estado de loading.
  const refreshRequested = useRef(false);

  useEffect(() => {
    const current = ++generation.current;

    if (refreshRequested.current) {
      refreshRequested.current = false;
    } else {
      setStatus("loading");
    }

    async function loadFirstPage() {
      try {
        const result = await fetchAlunos(1, PAGE_SIZE);
        if (current !== generation.current) return;
        setAlunos(result.alunos);
        setTotal(result.total);
        setPage(result.page);
        setError(null);
        setStatus("success");
      } catch (e) {
        if (current !== generation.current) return;
        setError(errorMessage(e));
        setStatus("error");
      } finally {
        if (current === generation.current) {
          setIsRefreshing(false);
          setIsLoadingMore(false);
        }
      }
    }

    loadFirstPage();
  }, [reloadKey]);

  function retry() {
    setReloadKey((key) => key + 1);
  }

  function refresh() {
    refreshRequested.current = true;
    setIsRefreshing(true);
    setReloadKey((key) => key + 1);
  }

  async function loadMore() {
    const hasMore = alunos.length < total;
    if (!hasMore || isLoadingMore || isRefreshing || status !== "success") return;

    const current = generation.current;
    setIsLoadingMore(true);
    try {
      const result = await fetchAlunos(page + 1, PAGE_SIZE);
      if (current !== generation.current) return;
      setAlunos((previous) => {
        const known = new Set(previous.map((aluno) => aluno.id));
        return [...previous, ...result.alunos.filter((aluno) => !known.has(aluno.id))];
      });
      setTotal(result.total);
      setPage(result.page);
    } catch {
      // Falha ao carregar mais não derruba a lista; o usuário pode rolar de novo.
    } finally {
      if (current === generation.current) setIsLoadingMore(false);
    }
  }

  return { alunos, total, status, error, isRefreshing, isLoadingMore, retry, refresh, loadMore };
}
