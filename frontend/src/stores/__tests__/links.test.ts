import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLinksStore } from '@/stores/links'

const FORM_DATA = {
  title: 'Test Tool',
  url: 'https://test.example.com',
  description: 'A test tool.',
  icon: 'link',
  category: 'Other' as const,
}

const API_LINK = {
  _id: 'test-id-1',
  title: 'Test Tool',
  url: 'https://test.example.com',
  description: 'A test tool.',
  icon: 'link',
  category: 'Other',
  createdAt: '2024-01-01T00:00:00.000Z',
}

function mockFetch(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  })
}

describe('useLinksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    localStorage.clear()
  })

  describe('fetchLinks', () => {
    it('loads links from the API and normalises _id to id', async () => {
      vi.stubGlobal('fetch', mockFetch([API_LINK]))
      const store = useLinksStore()
      await store.fetchLinks()
      expect(store.links).toHaveLength(1)
      expect(store.links[0]?.id).toBe('test-id-1')
      expect(store.links[0]?.createdAt).toBeInstanceOf(Date)
    })

    it('sets error when fetch fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ message: 'Server error' }),
        }),
      )
      const store = useLinksStore()
      await store.fetchLinks()
      expect(store.error).toBeTruthy()
      expect(store.links).toHaveLength(0)
    })
  })

  describe('addLink', () => {
    it('posts to the API and adds the returned link to the store', async () => {
      vi.stubGlobal('fetch', mockFetch(API_LINK, 201))
      const store = useLinksStore()
      const link = await store.addLink(FORM_DATA)
      expect(link.id).toBe('test-id-1')
      expect(store.links).toHaveLength(1)
    })
  })

  describe('updateLink', () => {
    it('patches the API and updates the local link', async () => {
      const updated = { ...API_LINK, title: 'Updated Tool' }
      vi.stubGlobal('fetch', mockFetch(updated))
      const store = useLinksStore()
      store.links.push({ id: 'test-id-1', ...FORM_DATA, createdAt: new Date() })
      const result = await store.updateLink('test-id-1', { ...FORM_DATA, title: 'Updated Tool' })
      expect(result).toBe(true)
      expect(store.getLinkById('test-id-1')?.title).toBe('Updated Tool')
    })

    it('returns false when the API responds with an error', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ message: 'Not found' }),
        }),
      )
      const store = useLinksStore()
      const result = await store.updateLink('missing-id', FORM_DATA)
      expect(result).toBe(false)
    })
  })

  describe('deleteLink', () => {
    it('removes the link from the store after a successful API call', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: true, status: 204, json: () => Promise.resolve(null) }),
      )
      const store = useLinksStore()
      store.links.push({ id: 'test-id-1', ...FORM_DATA, createdAt: new Date() })
      const result = await store.deleteLink('test-id-1')
      expect(result).toBe(true)
      expect(store.getLinkById('test-id-1')).toBeUndefined()
    })

    it('returns false when the API responds with an error', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ message: 'Not found' }),
        }),
      )
      const store = useLinksStore()
      const result = await store.deleteLink('missing-id')
      expect(result).toBe(false)
    })
  })

  describe('getLinkById', () => {
    it('returns the correct link from local state', () => {
      const store = useLinksStore()
      const link = { id: 'test-id-1', ...FORM_DATA, createdAt: new Date() }
      store.links.push(link)
      expect(store.getLinkById('test-id-1')).toEqual(link)
    })

    it('returns undefined for unknown id', () => {
      const store = useLinksStore()
      expect(store.getLinkById('unknown')).toBeUndefined()
    })
  })
})
