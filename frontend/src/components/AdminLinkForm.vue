<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Link, LinkFormData } from '@/types'
import { CATEGORIES } from '@/types'
import { XMarkIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  open: boolean
  link?: Link | null
  error?: string | null
  loading?: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [data: LinkFormData]
}>()

const ICON_OPTIONS = [
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

const empty = (): LinkFormData => ({
  title: '',
  url: '',
  description: '',
  icon: 'link',
  category: 'Other',
})

const form = ref<LinkFormData>(empty())
const errors = ref<Partial<Record<keyof LinkFormData, string>>>({})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.value = props.link
        ? {
            title: props.link.title,
            url: props.link.url,
            description: props.link.description ?? '',
            icon: props.link.icon,
            category: props.link.category,
          }
        : empty()
      errors.value = {}
    }
  },
)

function validate(): boolean {
  errors.value = {}
  if (!form.value.title.trim()) errors.value.title = 'Title is required.'
  if (!form.value.url.trim()) {
    errors.value.url = 'URL is required.'
  } else {
    try {
      new URL(form.value.url)
    } catch {
      errors.value.url = 'Must be a valid URL (include https://).'
    }
  }
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('save', { ...form.value })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="link ? 'Edit link' : 'Add new link'"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')" />

        <!-- Panel -->
        <div class="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl">
          <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 class="text-base font-semibold text-gray-900">
              {{ link ? 'Edit link' : 'Add new link' }}
            </h2>
            <button
              type="button"
              class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              @click="emit('close')"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <form class="flex flex-col gap-4 px-6 py-5" @submit.prevent="handleSubmit">
            <!-- Save error -->
            <div
              v-if="props.error"
              class="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              <ExclamationCircleIcon class="h-4 w-4 shrink-0" />
              {{ props.error }}
            </div>

            <!-- Title -->
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-700" for="form-title">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                id="form-title"
                v-model="form.title"
                type="text"
                class="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                :class="
                  errors.title
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500'
                "
                placeholder="Grafana"
              />
              <p v-if="errors.title" class="mt-0.5 text-xs text-red-600">{{ errors.title }}</p>
            </div>

            <!-- URL -->
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-700" for="form-url">
                URL <span class="text-red-500">*</span>
              </label>
              <input
                id="form-url"
                v-model="form.url"
                type="url"
                class="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                :class="
                  errors.url
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500'
                "
                placeholder="https://grafana.example.com"
              />
              <p v-if="errors.url" class="mt-0.5 text-xs text-red-600">{{ errors.url }}</p>
            </div>

            <!-- Description -->
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-700" for="form-desc">
                Description
              </label>
              <textarea
                id="form-desc"
                v-model="form.description"
                rows="2"
                class="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Short description of the tool…"
              />
            </div>

            <!-- Icon + Category row -->
            <div class="flex gap-3">
              <div class="flex-1">
                <label class="mb-1 block text-xs font-medium text-gray-700" for="form-icon">
                  Icon
                </label>
                <select
                  id="form-icon"
                  v-model="form.icon"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option v-for="icon in ICON_OPTIONS" :key="icon" :value="icon">{{ icon }}</option>
                </select>
              </div>

              <div class="flex-1">
                <label class="mb-1 block text-xs font-medium text-gray-700" for="form-category">
                  Category
                </label>
                <select
                  id="form-category"
                  v-model="form.category"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-2 pt-1">
              <button
                type="button"
                :disabled="props.loading"
                class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                @click="emit('close')"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="props.loading"
                class="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span
                  v-if="props.loading"
                  class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                />
                {{ link ? 'Save changes' : 'Add link' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
