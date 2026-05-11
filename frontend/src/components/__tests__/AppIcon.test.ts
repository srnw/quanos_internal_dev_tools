import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppIcon from '@/components/AppIcon.vue'

describe('AppIcon', () => {
  it('renders without errors for a known icon name', () => {
    const wrapper = mount(AppIcon, { props: { name: 'chart-bar' } })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders without errors for every registered icon', () => {
    const knownIcons = [
      'chart-bar',
      'magnifying-glass',
      'bug-ant',
      'arrow-path',
      'code-bracket',
      'archive-box',
      'document-text',
      'clipboard-document-list',
      'link',
      'wrench-screwdriver',
      'server',
      'shield-check',
      'cloud',
      'cube',
      'beaker',
    ]
    for (const name of knownIcons) {
      const wrapper = mount(AppIcon, { props: { name } })
      expect(wrapper.find('svg').exists(), `Expected svg for icon "${name}"`).toBe(true)
    }
  })

  it('falls back to the link icon for an unknown name', () => {
    const knownWrapper = mount(AppIcon, { props: { name: 'link' } })
    const unknownWrapper = mount(AppIcon, { props: { name: 'totally-unknown-icon' } })
    expect(unknownWrapper.html()).toBe(knownWrapper.html())
  })

  it('applies a custom class via the class prop', () => {
    const wrapper = mount(AppIcon, { props: { name: 'link', class: 'h-10 w-10' } })
    expect(wrapper.find('svg').classes()).toContain('h-10')
    expect(wrapper.find('svg').classes()).toContain('w-10')
  })
})
