import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AdminLinkForm from '@/components/AdminLinkForm.vue'
import type { Link, LinkFormData } from '@/types'

// Stub Teleport so modal content renders inline and is queryable via wrapper.find()
const GLOBAL_STUBS = {
  Teleport: { template: '<div><slot /></div>' },
}

const SAMPLE_LINK: Link = {
  id: 'abc-123',
  title: 'My Tool',
  url: 'https://tool.example.com',
  description: 'A handy tool.',
  icon: 'server',
  category: 'Infrastructure',
  createdAt: new Date('2024-01-01'),
}

function mountForm(props: Record<string, unknown> = {}) {
  return mount(AdminLinkForm, {
    props: { open: false, ...props },
    global: { stubs: GLOBAL_STUBS },
    attachTo: document.body,
  })
}

describe('AdminLinkForm', () => {
  let cleanup: () => void

  beforeEach(() => {
    cleanup = () => {}
  })

  afterEach(() => {
    cleanup()
  })

  describe('visibility', () => {
    it('does not render modal content when open is false', () => {
      const wrapper = mountForm({ open: false })
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    })

    it('renders modal content when open is true', () => {
      const wrapper = mountForm({ open: true })
      expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    })
  })

  describe('mode labels', () => {
    it('shows "Add new link" heading when no link prop is provided', () => {
      const wrapper = mountForm({ open: true })
      expect(wrapper.find('h2').text()).toBe('Add new link')
    })

    it('shows "Edit link" heading when a link prop is provided', async () => {
      const wrapper = mountForm({ open: false, link: SAMPLE_LINK })
      await wrapper.setProps({ open: true })
      expect(wrapper.find('h2').text()).toBe('Edit link')
    })
  })

  describe('form prefill', () => {
    it('starts with empty fields when opened without a link', async () => {
      const wrapper = mountForm({ open: false })
      await wrapper.setProps({ open: true })
      expect((wrapper.find('#form-title').element as HTMLInputElement).value).toBe('')
      expect((wrapper.find('#form-url').element as HTMLInputElement).value).toBe('')
    })

    it('prefills title and url when opened with a link', async () => {
      const wrapper = mountForm({ open: false, link: SAMPLE_LINK })
      await wrapper.setProps({ open: true })
      expect((wrapper.find('#form-title').element as HTMLInputElement).value).toBe(
        SAMPLE_LINK.title,
      )
      expect((wrapper.find('#form-url').element as HTMLInputElement).value).toBe(SAMPLE_LINK.url)
    })

    it('resets to empty fields when reopened without a link after editing', async () => {
      const wrapper = mountForm({ open: true, link: SAMPLE_LINK })
      await wrapper.setProps({ open: false, link: null })
      await wrapper.setProps({ open: true })
      expect((wrapper.find('#form-title').element as HTMLInputElement).value).toBe('')
    })
  })

  describe('validation', () => {
    it('shows title error and does not emit save when title is empty', async () => {
      const wrapper = mountForm({ open: true })
      await wrapper.find('#form-url').setValue('https://example.com')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.emitted('save')).toBeUndefined()
      expect(wrapper.html()).toContain('Title is required.')
    })

    it('shows url error and does not emit save when url is empty', async () => {
      const wrapper = mountForm({ open: true })
      await wrapper.find('#form-title').setValue('My Tool')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.emitted('save')).toBeUndefined()
      expect(wrapper.html()).toContain('URL is required.')
    })

    it('shows url error and does not emit save for a syntactically invalid URL', async () => {
      const wrapper = mountForm({ open: true })
      await wrapper.find('#form-title').setValue('My Tool')
      await wrapper.find('#form-url').setValue('not-a-url')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.emitted('save')).toBeUndefined()
      expect(wrapper.html()).toContain('Must be a valid URL')
    })
  })

  describe('successful submission', () => {
    it('emits save with correct LinkFormData when form is valid', async () => {
      const wrapper = mountForm({ open: true })
      await wrapper.find('#form-title').setValue('New Tool')
      await wrapper.find('#form-url').setValue('https://new-tool.example.com')
      await wrapper.find('form').trigger('submit')

      const emitted = wrapper.emitted('save') as [LinkFormData][]
      expect(emitted).toHaveLength(1)
      expect(emitted[0][0].title).toBe('New Tool')
      expect(emitted[0][0].url).toBe('https://new-tool.example.com')
    })
  })

  describe('close interactions', () => {
    it('emits close when Cancel button is clicked', async () => {
      const wrapper = mountForm({ open: true })
      const cancelBtn = wrapper.findAll('button').find((b) => b.text() === 'Cancel')
      await cancelBtn?.trigger('click')
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('emits close when the backdrop is clicked', async () => {
      const wrapper = mountForm({ open: true })
      await wrapper.find('.backdrop-blur-sm').trigger('click')
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('emits close when the X button in the header is clicked', async () => {
      const wrapper = mountForm({ open: true })
      // X button is in the header (type="button", no text, first button rendered)
      const headerCloseBtn = wrapper.find('button[type="button"]')
      await headerCloseBtn.trigger('click')
      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })
})
