import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

function mockFetch(body: unknown, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 401,
    json: () => Promise.resolve(body),
  })
}

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('starts unauthenticated when no token in storage', () => {
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.loginError).toBeNull()
  })

  it('starts authenticated when a token is already in localStorage', () => {
    localStorage.setItem('access_token', 'existing-token')
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(true)
  })

  it('authenticates and stores JWT on successful login', async () => {
    vi.stubGlobal('fetch', mockFetch({ access_token: 'jwt-token' }))
    const auth = useAuthStore()
    const result = await auth.login('admin', 'admin123')
    expect(result).toBe(true)
    expect(auth.isAuthenticated).toBe(true)
    expect(localStorage.getItem('access_token')).toBe('jwt-token')
    expect(auth.loginError).toBeNull()
  })

  it('sets loginError and stays unauthenticated on failed login', async () => {
    vi.stubGlobal('fetch', mockFetch({ message: 'Unauthorized' }, false))
    const auth = useAuthStore()
    const result = await auth.login('admin', 'wrong')
    expect(result).toBe(false)
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.loginError).toBe('Invalid username or password.')
  })

  it('clears error on next successful login', async () => {
    vi.stubGlobal('fetch', mockFetch({ message: 'Unauthorized' }, false))
    const auth = useAuthStore()
    await auth.login('admin', 'wrong')
    expect(auth.loginError).not.toBeNull()

    vi.stubGlobal('fetch', mockFetch({ access_token: 'jwt-token' }))
    await auth.login('admin', 'admin123')
    expect(auth.loginError).toBeNull()
  })

  it('logs out, removes token, and resets state', async () => {
    vi.stubGlobal('fetch', mockFetch({ access_token: 'jwt-token' }))
    const auth = useAuthStore()
    await auth.login('admin', 'admin123')
    expect(auth.isAuthenticated).toBe(true)

    auth.logout()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.loginError).toBeNull()
    expect(localStorage.getItem('access_token')).toBeNull()
  })
})
