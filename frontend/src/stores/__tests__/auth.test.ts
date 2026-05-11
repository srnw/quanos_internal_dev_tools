import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts unauthenticated', () => {
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.loginError).toBeNull()
  })

  it('authenticates with correct credentials', () => {
    const auth = useAuthStore()
    const result = auth.login('admin', 'admin123')
    expect(result).toBe(true)
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.loginError).toBeNull()
  })

  it('rejects incorrect credentials', () => {
    const auth = useAuthStore()
    const result = auth.login('admin', 'wrong')
    expect(result).toBe(false)
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.loginError).toBe('Invalid username or password.')
  })

  it('clears error on next login attempt', () => {
    const auth = useAuthStore()
    auth.login('admin', 'wrong')
    expect(auth.loginError).not.toBeNull()
    auth.login('admin', 'admin123')
    expect(auth.loginError).toBeNull()
  })

  it('logs out and resets state', () => {
    const auth = useAuthStore()
    auth.login('admin', 'admin123')
    expect(auth.isAuthenticated).toBe(true)
    auth.logout()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.loginError).toBeNull()
  })
})
