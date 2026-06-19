export const Routes = {
  stock: {
    products: '/stock/products',
    productCreate: '/stock/products',
    productDetail: (id: number) => `/stock/products/${id}` as const,
    categories: '/stock/categories',
    families: '/stock/families',
    familyDetail: (id: number) => `/stock/families/${id}` as const,
    reservations: '/stock/reservations',
    reservationDetail: (id: number) => `/stock/reservations/${id}` as const,
  },

  users: {
    list: '/users',
  },
};
