import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LinkCard from '@/components/LinkCard.vue'
import type { Link } from '@/types'

function makeLink(overrides: Partial<Link> = {}): Link {
  return {
    id: 'test-id',
    title: 'Grafana',
    url: 'https://grafana.example.com',
    description: 'Metrics dashboards.',
    icon: 'chart-bar',
    category: 'Monitoring',
    createdAt: new Date('2024-01-01'),
    ...overrides,
  }
}

describe('LinkCard', () => {
  describe('content rendering', () => {
    it('renders the link title', () => {
      const wrapper = mount(LinkCard, { props: { link: makeLink() } })
      expect(wrapper.find('h3').text()).toBe('Grafana')
    })

    it('sets the anchor href to link.url', () => {
      const wrapper = mount(LinkCard, { props: { link: makeLink() } })
      expect(wrapper.find('a').attributes('href')).toBe('https://grafana.example.com')
    })

    it('opens the link in a new tab', () => {
      const wrapper = mount(LinkCard, { props: { link: makeLink() } })
      expect(wrapper.find('a').attributes('target')).toBe('_blank')
    })

    it('renders the description when present', () => {
      const wrapper = mount(LinkCard, {
        props: { link: makeLink({ description: 'Some description' }) },
      })
      expect(wrapper.find('p').text()).toContain('Some description')
    })

    it('does not render the description paragraph when description is undefined', () => {
      const wrapper = mount(LinkCard, {
        props: { link: makeLink({ description: undefined }) },
      })
      expect(wrapper.find('p').exists()).toBe(false)
    })

    it('renders the category label in the badge', () => {
      const wrapper = mount(LinkCard, { props: { link: makeLink({ category: 'Monitoring' }) } })
      expect(wrapper.find('span').text()).toBe('Monitoring')
    })
  })

  describe('category color classes', () => {
    it('applies violet classes for Monitoring', () => {
      const wrapper = mount(LinkCard, { props: { link: makeLink({ category: 'Monitoring' }) } })
      const badge = wrapper.find('span')
      expect(badge.classes()).toContain('bg-violet-100')
      expect(badge.classes()).toContain('text-violet-700')
    })

    it('applies blue classes for CI/CD', () => {
      const wrapper = mount(LinkCard, { props: { link: makeLink({ category: 'CI/CD' }) } })
      const badge = wrapper.find('span')
      expect(badge.classes()).toContain('bg-blue-100')
      expect(badge.classes()).toContain('text-blue-700')
    })

    it('applies orange classes for Source Control', () => {
      const wrapper = mount(LinkCard, {
        props: { link: makeLink({ category: 'Source Control' }) },
      })
      const badge = wrapper.find('span')
      expect(badge.classes()).toContain('bg-orange-100')
      expect(badge.classes()).toContain('text-orange-700')
    })

    it('applies slate classes for Infrastructure', () => {
      const wrapper = mount(LinkCard, {
        props: { link: makeLink({ category: 'Infrastructure' }) },
      })
      const badge = wrapper.find('span')
      expect(badge.classes()).toContain('bg-slate-100')
      expect(badge.classes()).toContain('text-slate-700')
    })

    it('applies yellow classes for Documentation', () => {
      const wrapper = mount(LinkCard, {
        props: { link: makeLink({ category: 'Documentation' }) },
      })
      const badge = wrapper.find('span')
      expect(badge.classes()).toContain('bg-yellow-100')
      expect(badge.classes()).toContain('text-yellow-700')
    })

    it('applies gray classes for Other', () => {
      const wrapper = mount(LinkCard, { props: { link: makeLink({ category: 'Other' }) } })
      const badge = wrapper.find('span')
      expect(badge.classes()).toContain('bg-gray-100')
      expect(badge.classes()).toContain('text-gray-600')
    })

    it('falls back to gray classes for an unrecognised category', () => {
      const wrapper = mount(LinkCard, {
        props: { link: makeLink({ category: 'Unknown' as never }) },
      })
      const badge = wrapper.find('span')
      expect(badge.classes()).toContain('bg-gray-100')
      expect(badge.classes()).toContain('text-gray-600')
    })
  })
})
