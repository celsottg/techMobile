export type Post = {
  id: number;
  titulo: string;
  conteudo: string;
  data_publicacao: string;
  data_atualizacao: string;
};

// GET /posts?page&limit
export type PaginatedPosts = {
  posts: Post[];
  page: number;
  limit: number;
  total: number;
};

// GET /posts/search?search
export type SearchPostsResponse = {
  posts: Post[];
};
