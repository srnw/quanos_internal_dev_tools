import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLinksStore } from '@/stores/links'

const FORM_DATA = {
  title: 'Test Tool',
  url: 'https://test.example.com',
  description: 'A test tool.',
  icon: 'link',
  category: 'Other' as const,
}

describe('useLinksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initialises with seed links', () => {
    const store = useLinksStore()
    expect(store.links.length).toBeGreaterThan(0)
  })

  describe('addLink', () => {
    it('adds a link and returns it with a generated id', () => {
      const store = useLinksStore()
      const before = store.links.length
      const link = store.addLink(FORM_DATA)
      expect(store.links.length).toBe(before + 1)
      expect(link.id).toBeTruthy()
      expect(link.title).toBe('Test Tool')
    })
  })

  describe('updateLink', () => {
    it('updates an existing link', () => {
      const store = useLinksStore()
      const link = store.addLink(FORM_DATA)
      const updated = store.updateLink(link.id, { ...FORM_DATA, title: 'Updated Tool' })
      expect(updated).toBe(true)
      expect(store.getLinkById(link.id)?.title).toBe('Updated Tool')
    })

    it('preserves original id and createdAt after update', () => {
      const store = useLinksStore()
      const link = store.addLink(FORM_DATA)
      store.updateLink(link.id, { ...FORM_DATA, title: 'Changed' })
      const found = store.getLinkById(link.id)
      expect(found?.id).toBe(link.id)
      expect(found?.createdAt).toEqual(link.createdAt)
    })

    it('returns false for a non-existent id', () => {
      const store = useLinksStore()
      expect(store.updateLink('non-existent', FORM_DATA)).toBe(false)
    })
  })

  describe('deleteLink', () => {
    it('removes the link from the store', () => {
      const store = useLinksStore()
      const link = store.addLink(FORM_DATA)
      const before = store.links.length
      const result = store.deleteLink(link.id)
      expect(result).toBe(true)
      expect(store.links.length).toBe(before - 1)
      expect(store.getLinkById(link.id)).toBeUndefined()
    })

    it('returns false for a non-existent id', () => {
      const store = useLinksStore()
      expect(store.deleteLink('non-existent')).toBe(false)
    })
  })

  describe('getLinkById', () => {
    it('returns the correct link', () => {
      const store = useLinksStore()
      const link = store.addLink(FORM_DATA)
      expect(store.getLinkById(link.id)).toEqual(link)
    })

    it('returns undefined for unknown id', () => {
      const store = useLinksStore()
      expect(store.getLinkById('unknown')).toBeUndefined()
    })
  })
})
