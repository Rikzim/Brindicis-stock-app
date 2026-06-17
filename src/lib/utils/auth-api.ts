import { apiClient } from "@/lib/utils/api-client";

export interface LoginResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}

export interface SafeUser {
  id: number;
  name: string;
  email: string;
  image_path: string | null;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  role: {
    id: number;
    code: string;
    name: string;
  };
  permissions?: string[];
}

export async function login(email: string, password: string) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data;
}

export async function getMe() {
  const { data } = await apiClient.get("/auth/me");
  return data;
}
