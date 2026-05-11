<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  confirmClass?: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('cancel')" />
        <div class="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
          <slot name="icon" />
          <div class="mt-1">
            <h3 class="text-sm font-semibold text-gray-900">{{ title }}</h3>
            <p class="mt-1 text-xs text-gray-500">{{ message }}</p>
          </div>
          <div class="mt-4 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              @click="emit('cancel')"
            >
              Cancel
            </button>
            <button
              type="button"
              class="rounded-lg px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2"
              :class="confirmClass ?? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-400'"
              @click="emit('confirm')"
            >
              {{ confirmLabel ?? 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
