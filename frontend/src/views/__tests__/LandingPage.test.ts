import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useLinksStore } from '@/stores/links'
import LandingPage from '@/views/LandingPage.vue'

// Seed data counts used as expected values:
//   Total: 8  |  Monitoring: 3 (Grafana, Kibana, Sentry)
//   CI/CD: 1  |  Source Control: 1  |  Infrastructure: 1
//   Documentation: 1  |  Other: 1

describe('LandingPage', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  function mountPage() {
    return mount(LandingPage, {
      global: { plugins: [pinia] },
    })
  }

  function linkCards(wrapper: ReturnType<typeof mountPage>) {
    // LinkCard renders an <a target="_blank"> for each link
    return wrapper.findAll('a[target="_blank"]')
  }

  describe('default state', () => {
    it('shows all seed links when no filter or search is active', () => {
      const wrapper = mountPage()
      const store = useLinksStore()
      expect(linkCards(wrapper).length).toBe(store.links.length)
    })

    it('the "All" category pill is active by default', () => {
      const wrapper = mountPage()
      const allBtn = wrapper.findAll('button').find((b) => b.text() === 'All')
      expect(allBtn?.classes()).toContain('bg-indigo-600')
    })
  })

  describe('category filter', () => {
    it('shows only Monitoring links when Monitoring is selected', async () => {
      const wrapper = mountPage()
      await wrapper
        .findAll('button')
        .find((b) => b.text() === 'Monitoring')
        ?.trigger('click')
      expect(linkCards(wrapper).length).toBe(3)
    })

    it('shows only CI/CD links when CI/CD is selected', async () => {
      const wrapper = mountPage()
      await wrapper
        .findAll('button')
        .find((b) => b.text() === 'CI/CD')
        ?.trigger('click')
      expect(linkCards(wrapper).length).toBe(1)
    })

    it('shows all links again when All is clicked after a filter', async () => {
      const wrapper = mountPage()
      const store = useLinksStore()
      await wrapper
        .findAll('button')
        .find((b) => b.text() === 'Monitoring')
        ?.trigger('click')
      await wrapper
        .findAll('button')
        .find((b) => b.text() === 'All')
        ?.trigger('click')
      expect(linkCards(wrapper).length).toBe(store.links.length)
    })
  })

  describe('search filter', () => {
    it('filters by title (case-insensitive)', async () => {
      const wrapper = mountPage()
      await wrapper.find('input[type="search"]').setValue('grafana')
      expect(linkCards(wrapper).length).toBe(1)
    })

    it('filters by description', async () => {
      // Kibana description: "Log aggregation and search powered by Elasticsearch."
      const wrapper = mountPage()
      await wrapper.find('input[type="search"]').setValue('log aggregation')
      expect(linkCards(wrapper).length).toBe(1)
    })

    it('filters by category text', async () => {
      // "monitoring" matches the category field of Grafana, Kibana, and Sentry
      const wrapper = mountPage()
      await wrapper.find('input[type="search"]').setValue('monitoring')
      expect(linkCards(wrapper).length).toBe(3)
    })

    it('trims whitespace in the search query', async () => {
      const wrapper = mountPage()
      await wrapper.find('input[type="search"]').setValue('  grafana  ')
      expect(linkCards(wrapper).length).toBe(1)
    })
  })

  describe('combined filters', () => {
    it('applies both category and search simultaneously', async () => {
      const wrapper = mountPage()
      await wrapper
        .findAll('button')
        .find((b) => b.text() === 'Monitoring')
        ?.trigger('click')
      await wrapper.find('input[type="search"]').setValue('grafana')
      expect(linkCards(wrapper).length).toBe(1)
    })

    it('returns no results when category and search do not overlap', async () => {
      const wrapper = mountPage()
      await wrapper
        .findAll('button')
        .find((b) => b.text() === 'CI/CD')
        ?.trigger('click')
      await wrapper.find('input[type="search"]').setValue('grafana')
      expect(linkCards(wrapper).length).toBe(0)
    })
  })

  describe('empty state', () => {
    it('shows the "No tools found" message when nothing matches', async () => {
      const wrapper = mountPage()
      await wrapper.find('input[type="search"]').setValue('zzz-no-match')
      expect(wrapper.html()).toContain('No tools found')
      expect(linkCards(wrapper).length).toBe(0)
    })

    it('"Clear filters" button resets search and restores all links', async () => {
      const wrapper = mountPage()
      const store = useLinksStore()
      await wrapper.find('input[type="search"]').setValue('zzz-no-match')
      const clearBtn = wrapper.findAll('button').find((b) => b.text() === 'Clear filters')
      await clearBtn?.trigger('click')
      expect(linkCards(wrapper).length).toBe(store.links.length)
    })
  })
})
