import { defineStore } from 'pinia'
import { ref } from 'vue'

const MOCK_USERNAME = 'admin'
const MOCK_PASSWORD = 'admin123'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const loginError = ref<string | null>(null)

  function login(username: string, password: string): boolean {
    loginError.value = null
    if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
      isAuthenticated.value = true
      return true
    }
    loginError.value = 'Invalid username or password.'
    return false
  }

  function logout(): void {
    isAuthenticated.value = false
    loginError.value = null
  }

  return { isAuthenticated, loginError, login, logout }
})
