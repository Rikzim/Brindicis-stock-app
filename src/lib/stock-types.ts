export type StockCategory = {
  id: number;
  name: string;
  status: number | null;
};

export type StockFamily = {
  id: number;
  name: string;
  status: number;
};

export type StockImage = {
  id: number;
  url: string;
  color: string;
};

export type ProductVariantStock = {
  id: number;
  productId: number;
  color: string;
  size: string | null;
  quantity: number;
  reserved: number;
  cx: string;
  drawer: string | null;
};

export type ProductStock = {
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
  variants: ProductVariantStock[];
  sizes: { size: string }[];
  colors: { name: string }[];
  drawers: string[];
};

export type StockReservation = {
  id: number;
  name: string;
  productId: number;
  quantity: number;
  message: string;
  status: number;
  viewed: number;
  proposal: number;
  order: string | null;
  variantId: number;
  createdAt: string | null;
  updatedAt: string | null;
  product?: ProductStock;
  variant?: ProductVariantStock;
  image?: string | null;
  ref?: string;
};
