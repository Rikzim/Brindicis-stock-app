import { apiClient } from "$lib/utils/api-client";
import { Routes } from "./routes";

export type LoginResponse = {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(Routes.auth.login, {
    email,
    password,
  });
  return data;
}

export async function getMe<T = unknown>(): Promise<T> {
  const { data } = await apiClient.get<T>(Routes.auth.me);
  return data;
}
