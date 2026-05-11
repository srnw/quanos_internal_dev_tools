import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// The router is a module-level singleton; we reset navigation and auth state
// in beforeEach so each test starts from a clean position.
describe('router auth guard', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
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
    const auth = useAuthStore()
    auth.login('admin', 'admin123')
    await router.push('/admin')
    expect(router.currentRoute.value.name).toBe('admin')
  })

  it('re-blocks access to /admin after logout', async () => {
    const auth = useAuthStore()
    auth.login('admin', 'admin123')
    await router.push('/admin')
    expect(router.currentRoute.value.name).toBe('admin')

    auth.logout()
    // Navigate away first; Vue Router treats push to the current route as a no-op
    // and would not re-run guards if we pushed '/admin' while already there.
    await router.push('/')
    await router.push('/admin')
    expect(router.currentRoute.value.name).toBe('admin-login')
  })
})
