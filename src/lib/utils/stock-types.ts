export interface StockCategory {
  id: number;
  name: string;
  status: number | null;
}

export interface StockFamily {
  id: number;
  name: string;
  status: number;
}

export interface StockImage {
  id: number;
  url: string;
  color: string;
}

export interface StockVariantFull {
  id: number;
  productId: number;
  color: string;
  size: string | null;
  quantity: number;
  reserved: number;
  cx: string;
  drawer: string | null;
  product?: { ref: string };
}

export interface StockProductFull {
  id: number;
  type: string;
  ref: string;
  quantity: number;
  description: string | null;
  reserved: number;
  drawer: string;
  cx: string;
  pvp: number;
  pc: number;
  name: string;
  number: number | null;
  status: number;
  active: number;
  categoryId: number;
  familyId: number;
  createdAt: string | null;
  updatedAt: string | null;
  category: StockCategory | null;
  family: StockFamily | null;
  images: StockImage[];
  variants: StockVariantFull[];
  sizes: Array<{ size: string }>;
  colors: Array<{ name: string }>;
  drawers: string[];
}

export interface StockReservationFull {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  message: string;
  status: number;
  viewed: number;
  quoteId: number | null;
  variantId: number;
  createdAt: string | null;
  updatedAt: string | null;
  product?: StockProductFull;
  variant?: StockVariantFull;
  user?: { id: number; name: string; image_path: string | null };
  quote?: { id: number; reference: string };
  image?: string | null;
  ref?: string;
}

export type ProductStock = StockProductFull;
export type StockReservation = StockReservationFull;
export type ProductVariantStock = StockVariantFull;

export const RESERVATION_STATUS = {
  Pending: 0,
  Confirmed: 1,
  Cancelled: 2,
} as const;

export type ReservationStatusValue = (typeof RESERVATION_STATUS)[keyof typeof RESERVATION_STATUS];

export function reservationStatusInfo(status: number): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
} {
  if (status === RESERVATION_STATUS.Pending) return { label: "Pendente", variant: "warning" };
  if (status === RESERVATION_STATUS.Confirmed) return { label: "Confirmada", variant: "success" };
  return { label: "Cancelada", variant: "destructive" };
}

export function reservationStatusLabel(status: number): string {
  return reservationStatusInfo(status).label;
}
