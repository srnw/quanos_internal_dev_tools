import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmModal from '@/components/ConfirmModal.vue'

const GLOBAL_STUBS = {
  Teleport: { template: '<div><slot /></div>' },
}

function mountModal(props: Record<string, unknown> = {}) {
  return mount(ConfirmModal, {
    props: {
      open: true,
      title: 'Delete item?',
      message: 'This action cannot be undone.',
      ...props,
    },
    global: { stubs: GLOBAL_STUBS },
    attachTo: document.body,
  })
}

describe('ConfirmModal', () => {
  describe('visibility', () => {
    it('does not render modal content when open is false', () => {
      const wrapper = mountModal({ open: false })
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    })

    it('renders modal content when open is true', () => {
      const wrapper = mountModal()
      expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    })
  })

  describe('content', () => {
    it('renders the title', () => {
      const wrapper = mountModal({ title: 'Really delete?' })
      expect(wrapper.find('h3').text()).toBe('Really delete?')
    })

    it('renders the message', () => {
      const wrapper = mountModal({ message: 'You cannot undo this.' })
      expect(wrapper.find('p').text()).toBe('You cannot undo this.')
    })

    it('displays the default "Confirm" label when confirmLabel is not provided', () => {
      const wrapper = mountModal()
      const buttonTexts = wrapper.findAll('button').map((b) => b.text())
      expect(buttonTexts).toContain('Confirm')
    })

    it('displays a custom confirmLabel when provided', () => {
      const wrapper = mountModal({ confirmLabel: 'Delete' })
      const buttonTexts = wrapper.findAll('button').map((b) => b.text())
      expect(buttonTexts).toContain('Delete')
      expect(buttonTexts).not.toContain('Confirm')
    })
  })

  describe('emits', () => {
    it('emits confirm when the confirm button is clicked', async () => {
      const wrapper = mountModal()
      const confirmBtn = wrapper.findAll('button').find((b) => b.text() === 'Confirm')
      await confirmBtn?.trigger('click')
      expect(wrapper.emitted('confirm')).toHaveLength(1)
    })

    it('emits cancel when the Cancel button is clicked', async () => {
      const wrapper = mountModal()
      const cancelBtn = wrapper.findAll('button').find((b) => b.text() === 'Cancel')
      await cancelBtn?.trigger('click')
      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    it('emits cancel when the backdrop is clicked', async () => {
      const wrapper = mountModal()
      await wrapper.find('.backdrop-blur-sm').trigger('click')
      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    it('does not emit confirm when cancel is clicked', async () => {
      const wrapper = mountModal()
      const cancelBtn = wrapper.findAll('button').find((b) => b.text() === 'Cancel')
      await cancelBtn?.trigger('click')
      expect(wrapper.emitted('confirm')).toBeUndefined()
    })
  })
})
