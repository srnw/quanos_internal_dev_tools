import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useLinksStore } from '@/stores/links'
import LandingPage from '@/views/LandingPage.vue'

// Mirrors the backend seed — used for expected-count assertions.
// Total: 8  |  Monitoring: 3 (Grafana, Kibana, Sentry)
// CI/CD: 1  |  Source Control: 1  |  Infrastructure: 1
// Documentation: 1  |  Other: 1
const SEED_API_LINKS = [
  {
    _id: '1',
    title: 'Grafana',
    url: 'https://grafana.example.com',
    description: 'Metrics dashboards and observability platform.',
    icon: 'chart-bar',
    category: 'Monitoring',
    createdAt: '2024-01-10T00:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Kibana',
    url: 'https://kibana.example.com',
    description: 'Log aggregation and search powered by Elasticsearch.',
    icon: 'magnifying-glass',
    category: 'Monitoring',
    createdAt: '2024-01-11T00:00:00.000Z',
  },
  {
    _id: '3',
    title: 'Sentry',
    url: 'https://sentry.example.com',
    description: 'Error tracking and performance monitoring.',
    icon: 'bug-ant',
    category: 'Monitoring',
    createdAt: '2024-01-12T00:00:00.000Z',
  },
  {
    _id: '4',
    title: 'ArgoCD',
    url: 'https://argocd.example.com',
    description: 'GitOps continuous delivery for Kubernetes.',
    icon: 'arrow-path',
    category: 'CI/CD',
    createdAt: '2024-01-13T00:00:00.000Z',
  },
  {
    _id: '5',
    title: 'GitHub',
    url: 'https://github.com/example-org',
    description: 'Source code repositories and pull requests.',
    icon: 'code-bracket',
    category: 'Source Control',
    createdAt: '2024-01-14T00:00:00.000Z',
  },
  {
    _id: '6',
    title: 'Harbor',
    url: 'https://harbor.example.com',
    description: 'Container registry for storing and distributing images.',
    icon: 'archive-box',
    category: 'Infrastructure',
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    _id: '7',
    title: 'Confluence',
    url: 'https://wiki.example.com',
    description: 'Team documentation and knowledge base.',
    icon: 'document-text',
    category: 'Documentation',
    createdAt: '2024-01-16T00:00:00.000Z',
  },
  {
    _id: '8',
    title: 'Jira',
    url: 'https://jira.example.com',
    description: 'Project tracking, sprints, and issue management.',
    icon: 'clipboard-document-list',
    category: 'Other',
    createdAt: '2024-01-17T00:00:00.000Z',
  },
]

function mockFetchLinks() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(SEED_API_LINKS),
    }),
  )
}

describe('LandingPage', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
    vi.restoreAllMocks()
    mockFetchLinks()
  })

  async function mountPage() {
    const wrapper = mount(LandingPage, {
      global: { plugins: [pinia] },
    })
    await flushPromises()
    return wrapper
  }

  function linkCards(wrapper: Awaited<ReturnType<typeof mountPage>>) {
    return wrapper.findAll('a[target="_blank"]')
  }

  describe('default state', () => {
    it('shows all seed links when no filter or search is active', async () => {
      const wrapper = await mountPage()
      const store = useLinksStore()
      expect(linkCards(wrapper).length).toBe(store.links.length)
    })

    it('the "All" category pill is active by default', async () => {
      const wrapper = await mountPage()
      const allBtn = wrapper.findAll('button').find((b) => b.text() === 'All')
      expect(allBtn?.classes()).toContain('bg-indigo-600')
    })
  })

  describe('category filter', () => {
    it('shows only Monitoring links when Monitoring is selected', async () => {
      const wrapper = await mountPage()
      await wrapper
        .findAll('button')
        .find((b) => b.text() === 'Monitoring')
        ?.trigger('click')
      expect(linkCards(wrapper).length).toBe(3)
    })

    it('shows only CI/CD links when CI/CD is selected', async () => {
      const wrapper = await mountPage()
      await wrapper
        .findAll('button')
        .find((b) => b.text() === 'CI/CD')
        ?.trigger('click')
      expect(linkCards(wrapper).length).toBe(1)
    })

    it('shows all links again when All is clicked after a filter', async () => {
      const wrapper = await mountPage()
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
      const wrapper = await mountPage()
      await wrapper.find('input[type="search"]').setValue('grafana')
      expect(linkCards(wrapper).length).toBe(1)
    })

    it('filters by description', async () => {
      // Kibana description: "Log aggregation and search powered by Elasticsearch."
      const wrapper = await mountPage()
      await wrapper.find('input[type="search"]').setValue('log aggregation')
      expect(linkCards(wrapper).length).toBe(1)
    })

    it('filters by category text', async () => {
      // "monitoring" matches the category field of Grafana, Kibana, and Sentry
      const wrapper = await mountPage()
      await wrapper.find('input[type="search"]').setValue('monitoring')
      expect(linkCards(wrapper).length).toBe(3)
    })

    it('trims whitespace in the search query', async () => {
      const wrapper = await mountPage()
      await wrapper.find('input[type="search"]').setValue('  grafana  ')
      expect(linkCards(wrapper).length).toBe(1)
    })
  })

  describe('combined filters', () => {
    it('applies both category and search simultaneously', async () => {
      const wrapper = await mountPage()
      await wrapper
        .findAll('button')
        .find((b) => b.text() === 'Monitoring')
        ?.trigger('click')
      await wrapper.find('input[type="search"]').setValue('grafana')
      expect(linkCards(wrapper).length).toBe(1)
    })

    it('returns no results when category and search do not overlap', async () => {
      const wrapper = await mountPage()
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
      const wrapper = await mountPage()
      await wrapper.find('input[type="search"]').setValue('zzz-no-match')
      expect(wrapper.html()).toContain('No tools found')
      expect(linkCards(wrapper).length).toBe(0)
    })

    it('"Clear filters" button resets search and restores all links', async () => {
      const wrapper = await mountPage()
      const store = useLinksStore()
      await wrapper.find('input[type="search"]').setValue('zzz-no-match')
      const clearBtn = wrapper.findAll('button').find((b) => b.text() === 'Clear filters')
      await clearBtn?.trigger('click')
      expect(linkCards(wrapper).length).toBe(store.links.length)
    })
  })
})
