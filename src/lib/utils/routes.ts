export const Routes = {
  auth: {
    login: "/auth/login",
    me: "/auth/me",
  },

  stock: {
    products: "/stock/products",
    productFilters: "/stock/products/filters",
    productCreate: "/stock/products",
    productDetail: (id: number) => `/stock/products/${id}` as const,
    categories: "/stock/categories",
    families: "/stock/families",
    suppliers: "/stock/suppliers",
    familyDetail: (id: number) => `/stock/families/${id}` as const,
    supplierDetail: (name: string) => `/stock/suppliers/${encodeURIComponent(name)}` as const,
    reservations: "/stock/reservations",
    reservationDetail: (id: number) => `/stock/reservations/${id}` as const,
  },

  users: {
    list: "/users",
  },

  quotes: {
    list: "/quotes",
    detail: (id: number) => `/quotes/${id}` as const,
  },
};
