import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

function mockLoginFetch(ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 401,
      json: () => Promise.resolve(ok ? { access_token: 'jwt-token' } : { message: 'Unauthorized' }),
    }),
  )
}

describe('router auth guard', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.restoreAllMocks()
    await router.push('/')
    await router.isReady()
  })

  it('allows unauthenticated navigation to / (home)', async () => {
    await router.push('/')
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('allows unauthenticated navigation to /admin/login', async () => {
    await router.push('/admin/login')
    expect(router.currentRoute.value.name).toBe('admin-login')
  })

  it('redirects an unauthenticated user from /admin to /admin/login', async () => {
    await router.push('/admin')
    expect(router.currentRoute.value.name).toBe('admin-login')
  })

  it('allows an authenticated user to navigate to /admin', async () => {
    mockLoginFetch(true)
    const auth = useAuthStore()
    await auth.login('admin', 'admin123')
    await router.push('/admin')
    expect(router.currentRoute.value.name).toBe('admin')
  })

  it('re-blocks access to /admin after logout', async () => {
    mockLoginFetch(true)
    const auth = useAuthStore()
    await auth.login('admin', 'admin123')
    await router.push('/admin')
    expect(router.currentRoute.value.name).toBe('admin')

    auth.logout()
    await router.push('/')
    await router.push('/admin')
    expect(router.currentRoute.value.name).toBe('admin-login')
  })
})
