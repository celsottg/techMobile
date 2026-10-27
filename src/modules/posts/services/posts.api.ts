import { httpDelete, httpGet, httpPost, httpPut } from "@/shared/api/http-client";

import type {
  CreatePostInput,
  PaginatedPosts,
  Post,
  SearchPostsResponse,
  UpdatePostInput,
} from "../types";
import { notifyPostsChanged } from "./posts-changes";

export function fetchPosts(page: number, limit: number) {
  return httpGet<PaginatedPosts>("/posts", { page, limit });
}

export function searchPosts(search: string) {
  return httpGet<SearchPostsResponse>("/posts/search", { search });
}

export function fetchPost(id: number) {
  return httpGet<Post>(`/posts/${id}`);
}

// Só PROFESSOR (o backend responde 403 para ALUNO).
export async function createPost(input: CreatePostInput) {
  const post = await httpPost<Post>("/posts", input);
  notifyPostsChanged();
  return post;
}

export async function updatePost(id: number, input: UpdatePostInput) {
  const post = await httpPut<Post>(`/posts/${id}`, input);
  notifyPostsChanged();
  return post;
}

export async function deletePost(id: number) {
  await httpDelete(`/posts/${id}`);
  notifyPostsChanged();
}
