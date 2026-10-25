import { httpGet } from "@/shared/api/http-client";

import type { PaginatedPosts, SearchPostsResponse } from "../types";

export function fetchPosts(page: number, limit: number) {
  return httpGet<PaginatedPosts>("/posts", { page, limit });
}

export function searchPosts(search: string) {
  return httpGet<SearchPostsResponse>("/posts/search", { search });
}
