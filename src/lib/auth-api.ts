import { apiClient } from "./api-client";

export type SafeUser = {
  id: number;
  image_path: string | null;
  name: string;
  email: string;
  role: { id: number; code: string; name: string };
  permissions: string[];
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
};

type LoginResponse = {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function getMe(): Promise<SafeUser> {
  const { data } = await apiClient.get<SafeUser>("/auth/me");
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}
