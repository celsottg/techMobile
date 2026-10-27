import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { ApiError } from "@/shared/api/http-client";

import { getPostsVersion, subscribePostsChanges } from "../services/posts-changes";
import { fetchPosts, searchPosts } from "../services/posts.api";
import type { Post } from "../types";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

type Status = "loading" | "success" | "error";

function errorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : "Erro inesperado ao carregar os posts.";
}

/**
 * Listagem de posts: paginação incremental (GET /posts) quando não há busca,
 * e busca por palavra-chave (GET /posts/search, sem paginação) com debounce.
 */
export function usePosts() {
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  // Muda quando um post é criado em outra tela, para recarregar a lista com ele.
  const postsVersion = useSyncExternalStore(subscribePostsChanges, getPostsVersion, getPostsVersion);

  const [posts, setPosts] = useState<Post[]>([]);
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
    const timeout = setTimeout(() => setTerm(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const current = ++generation.current;

    if (refreshRequested.current) {
      refreshRequested.current = false;
    } else {
      setStatus("loading");
    }

    async function loadFirstPage() {
      try {
        if (term) {
          const result = await searchPosts(term);
          if (current !== generation.current) return;
          setPosts(result.posts);
          setTotal(result.posts.length);
          setPage(1);
        } else {
          const result = await fetchPosts(1, PAGE_SIZE);
          if (current !== generation.current) return;
          setPosts(result.posts);
          setTotal(result.total);
          setPage(result.page);
        }
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
  }, [term, reloadKey, postsVersion]);

  function retry() {
    setReloadKey((key) => key + 1);
  }

  function refresh() {
    refreshRequested.current = true;
    setIsRefreshing(true);
    setReloadKey((key) => key + 1);
  }

  async function loadMore() {
    const hasMore = !term && posts.length < total;
    if (!hasMore || isLoadingMore || isRefreshing || status !== "success") return;

    const current = generation.current;
    setIsLoadingMore(true);
    try {
      const result = await fetchPosts(page + 1, PAGE_SIZE);
      if (current !== generation.current) return;
      setPosts((previous) => {
        const known = new Set(previous.map((post) => post.id));
        return [...previous, ...result.posts.filter((post) => !known.has(post.id))];
      });
      setTotal(result.total);
      setPage(result.page);
    } catch {
      // Falha ao carregar mais não derruba a lista; o usuário pode rolar de novo.
    } finally {
      if (current === generation.current) setIsLoadingMore(false);
    }
  }

  return {
    posts,
    total,
    status,
    error,
    search,
    term,
    isRefreshing,
    isLoadingMore,
    setSearch,
    retry,
    refresh,
    loadMore,
  };
}
