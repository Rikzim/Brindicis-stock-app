import { apiClient, Routes } from "@/lib/utils/api-client";
import type { ProductStock, StockFamily, StockReservation } from "./stock-types";

export async function getProducts(): Promise<ProductStock[]> {
  const { data } = await apiClient.get<{ products: ProductStock[] }>(
    Routes.stock.products
  );
  return data.products;
}

export async function getFamilies(): Promise<StockFamily[]> {
  const { data } = await apiClient.get<{ families: StockFamily[] }>(
    Routes.stock.families
  );
  return data.families;
}

export async function createFamily(data: {
  name: string;
  status?: number;
}) {
  return apiClient.post(Routes.stock.families, data);
}

export async function updateFamily(
  id: number,
  data: { name?: string; status?: number }
) {
  return apiClient.patch(Routes.stock.familyDetail(id), data);
}

export async function deleteFamily(id: number) {
  return apiClient.delete(Routes.stock.familyDetail(id));
}

type GetReservationsParams = {
  recent?: boolean | string;
  productId?: number;
  unviewed?: boolean | string;
  count?: number;
};

export async function getReservations(
  params?: GetReservationsParams
): Promise<StockReservation[]> {
  const { data } = await apiClient.get<any>(Routes.stock.reservations, {
    params,
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
  const { data } = await apiClient.post<any>(Routes.stock.reservations, payload);
  return data;
}

export async function getUsers(): Promise<any[]> {
  const { data } = await apiClient.get<any[]>(Routes.users.list);
  return data;
}

export async function deleteReservation(id: number): Promise<void> {
  await apiClient.delete(Routes.stock.reservationDetail(id));
}

export async function createProduct(formData: FormData): Promise<any> {
  const { data } = await apiClient.post<any>(
    Routes.stock.productCreate,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}
