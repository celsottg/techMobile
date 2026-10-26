import { httpPost } from "@/shared/api/http-client";

import type { LoginRequest, LoginResponse } from "../types";

export function login(credentials: LoginRequest) {
  return httpPost<LoginResponse>("/login", credentials, { authenticated: false });
}
