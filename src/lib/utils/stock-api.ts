import { apiClient, Routes } from "@/lib/utils/api-client";
import type { ProductStock, StockCategory, StockFamily, StockReservation } from "./stock-types";

export async function getProducts(): Promise<ProductStock[]> {
  const { data } = await apiClient.get<{ products: ProductStock[] }>(
    Routes.stock.products
  );
  return data.products;
}

export async function getProductById(id: number): Promise<ProductStock> {
  const { data } = await apiClient.get<ProductStock>(
    Routes.stock.productDetail(id)
  );
  return data;
}

export type ProductsQuery = {
  page: number;
  limit: number;
  search?: string;
  fornecedor?: string;
  familia?: string;
  disponibilidade?: string;
  estado?: string;
  caixa?: string;
  gaveta?: string;
  cor?: string;
  tamanho?: string;
};

export type PaginatedProducts = {
  products: ProductStock[];
  total: number;
  page: number;
  limit: number;
};

export async function getProductsPaginated(
  query: ProductsQuery
): Promise<PaginatedProducts> {
  const { data } = await apiClient.get<PaginatedProducts>(
    Routes.stock.products,
    { params: query }
  );
  return data;
}

export type ProductFilters = {
  colors: string[];
  sizes: string[];
};

export async function getProductsFilters(): Promise<ProductFilters> {
  const { data } = await apiClient.get<ProductFilters>(
    Routes.stock.productFilters
  );
  return data;
}

export async function getFamilies(): Promise<StockFamily[]> {
  const { data } = await apiClient.get<{ families: StockFamily[] }>(
    Routes.stock.families
  );
  return data.families;
}

export async function getCategories(): Promise<StockCategory[]> {
  const { data } = await apiClient.get<{ categories: StockCategory[] }>(
    Routes.stock.categories
  );
  return data.categories;
}

export type FamiliesQuery = {
  page: number;
  limit: number;
  search?: string;
};

export type PaginatedFamilies = {
  families: StockFamily[];
  total: number;
  page: number;
  limit: number;
};

export async function getFamiliesPaginated(
  query: FamiliesQuery
): Promise<PaginatedFamilies> {
  const { data } = await apiClient.get<PaginatedFamilies>(
    Routes.stock.families,
    { params: query }
  );
  return data;
}

export type ReservationsQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: string;
};

export type PaginatedReservations = {
  reservations: StockReservation[];
  total: number;
  page: number;
  limit: number;
};

export async function getReservationsPaginated(
  query: ReservationsQuery
): Promise<PaginatedReservations> {
  const { data } = await apiClient.get<PaginatedReservations>(
    Routes.stock.reservations,
    { params: query }
  );
  return data;
}

export async function getSuppliers(): Promise<string[]> {
  const { data } = await apiClient.get<{ suppliers: string[] }>(
    Routes.stock.suppliers
  );
  return data.suppliers;
}

export type PaginatedSuppliers = {
  suppliers: string[];
  total: number;
  page: number;
  limit: number;
};

export async function getSuppliersPaginated(
  page: number,
  limit: number
): Promise<PaginatedSuppliers> {
  const { data } = await apiClient.get<PaginatedSuppliers>(
    Routes.stock.suppliers,
    { params: { page, limit } }
  );
  return data;
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
  userId: number;
  id_product: number;
  quantity: number;
  message?: string;
  color: string;
  size?: string;
  quoteId?: number;
}): Promise<any> {
  const { data } = await apiClient.post<any>(Routes.stock.reservations, payload);
  return data;
}

export async function getUsers(): Promise<any[]> {
  const { data } = await apiClient.get<any[]>(Routes.users.list);
  return data;
}

export async function getQuotes(params?: { search?: string; limit?: number }): Promise<{ total: number; data: any[] }> {
  const { data } = await apiClient.get(Routes.quotes.list, { params });
  return data;
}

export async function getCommercialUsers(): Promise<{ id: number; name: string }[]> {
  const { data } = await apiClient.get(Routes.users.list, {
    params: { roleCode: 'COMMERCIAL', isActive: true }
  });
  return data;
}

export async function resetReservation(id: number): Promise<any> {
  const { data } = await apiClient.patch(`${Routes.stock.reservationDetail(id)}/reset`);
  return data;
}

export async function rejectReservation(id: number): Promise<any> {
  const { data } = await apiClient.patch(`${Routes.stock.reservationDetail(id)}/reject`);
  return data;
}

export async function restoreReservation(id: number): Promise<any> {
  const { data } = await apiClient.patch(`${Routes.stock.reservationDetail(id)}/restore`);
  return data;
}

export async function approveReservation(id: number): Promise<any> {
  const { data } = await apiClient.patch(`${Routes.stock.reservationDetail(id)}/approve`);
  return data;
}

export async function updateReservation(
  id: number,
  payload: {
    quantity?: number;
    message?: string;
    status?: number;
    quoteId?: number;
  }
): Promise<any> {
  const { data } = await apiClient.patch(Routes.stock.reservationDetail(id), payload);
  return data;
}

export async function deleteReservation(id: number): Promise<void> {
  await apiClient.delete(Routes.stock.reservationDetail(id));
}

export async function createProduct(formData: FormData): Promise<any> {
  const { data } = await apiClient.post<any>(
    Routes.stock.productCreate,
    formData,
  );
  return data;
}

export async function updateProduct(id: number, formData: FormData): Promise<any> {
  const { data } = await apiClient.patch<any>(
    Routes.stock.productDetail(id),
    formData,
  );
  return data;
}
