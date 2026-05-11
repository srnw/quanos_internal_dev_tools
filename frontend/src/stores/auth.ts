import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import { api } from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const loginError = ref<string | null>(null)
  const isAuthenticated = ref(api.hasToken())

  async function login(username: string, password: string): Promise<boolean> {
    loginError.value = null
    try {
      const data = await api.post<{ access_token: string }>('/auth/login', {
        username,
        password,
      })
      api.setToken(data.access_token)
      isAuthenticated.value = true
      return true
    } catch {
      loginError.value = 'Invalid username or password.'
      isAuthenticated.value = false
      return false
    }
  }

  function logout(): void {
    api.clearToken()
    isAuthenticated.value = false
    loginError.value = null
  }

  return { isAuthenticated: readonly(isAuthenticated), loginError, login, logout }
})
