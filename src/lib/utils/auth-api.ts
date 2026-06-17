import { apiClient } from "@/lib/utils/api-client";

export async function login(email: string, password: string) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data;
}

export async function getMe() {
  const { data } = await apiClient.get("/auth/me");
  return data;
}

export type { SafeUser, LoginResponse } from "@brindicis/api-client";
