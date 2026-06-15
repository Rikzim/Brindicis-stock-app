import { apiClient } from "./api-client";
import type { ProductStock, StockFamily, StockReservation } from "./stock-types";

export async function getProducts(): Promise<ProductStock[]> {
  const { data } = await apiClient.get<{ products: ProductStock[] }>("/stock/products");
  return data.products;
}

export async function getFamilies(): Promise<StockFamily[]> {
  const { data } = await apiClient.get<{ families: StockFamily[] }>("/stock/families");
  return data.families;
}

export async function createFamily(data: { name: string; status?: number }) {
  return apiClient.post("/stock/families", data);
}

export async function updateFamily(id: number, data: { name?: string; status?: number }) {
  return apiClient.patch(`/stock/families/${id}`, data);
}

export async function deleteFamily(id: number) {
  return apiClient.delete(`/stock/families/${id}`);
}

type GetReservationsParams = {
  recent?: boolean | string;
  productId?: number;
  unviewed?: boolean | string;
  count?: number;
};

export async function getReservations(params?: GetReservationsParams): Promise<StockReservation[]> {
  const { data } = await apiClient.get<any>("/stock/reservations", { params });
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.reservations)) return data.reservations;
  return [];
}

export async function createReservation(payload: {
  name: string;
  id_product: number;
  quantity: number;
  message?: string;
  color: string;
  size?: string;
  proposal?: number;
  order?: string;
}): Promise<any> {
  const { data } = await apiClient.post<any>("/stock/reservations", payload);
  return data;
}

export async function getUsers(): Promise<any[]> {
  const { data } = await apiClient.get<any[]>("/users");
  return data;
}

export async function deleteReservation(id: number): Promise<void> {
  await apiClient.delete(`/stock/reservations/${id}`);
}


