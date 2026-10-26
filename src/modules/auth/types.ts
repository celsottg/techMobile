import type { Session } from "@/shared/session";

// POST /login
export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = Session;
