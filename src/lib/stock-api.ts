import { apiClient } from "./api-client";
import type { ProductStock, StockFamily, StockReservation } from "./stock-types";

export async function getProducts(): Promise<ProductStock[]> {
  const { data } = await apiClient.get<{ products: ProductStock[] }>("/api/getProducts");
  return data.products;
}

export async function getFamilies(): Promise<StockFamily[]> {
  const { data } = await apiClient.get<{ families: StockFamily[] }>("/api/getFamilies");
  return data.families;
}

export async function getReservations(): Promise<StockReservation[]> {
  const { data } = await apiClient.get<any>("/api/getReservations");
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.reservations)) return data.reservations;
  return [];
}

export async function getProductReservations(productId: number): Promise<StockReservation[]> {
  const { data } = await apiClient.get<any>("/api/getProductReservations", {
    params: { id: productId },
  });
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
  const { data } = await apiClient.post<any>("/api/make-reservation", payload);
  return data;
}

export async function getUsers(): Promise<any[]> {
  const { data } = await apiClient.get<any[]>("/users");
  return data;
}

export async function deleteReservation(id: number): Promise<void> {
  await apiClient.delete("/api/delete-reservation", {
    data: { id },
  });
}


