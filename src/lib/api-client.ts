import { configureClient, apiClient, Routes } from '@brindicis/api-client'
import { useAuthStore } from '@/stores/auth-store'

configureClient({
  tokenProvider: () => useAuthStore.getState().accessToken,
})

export { apiClient, Routes }
