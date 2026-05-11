<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLinksStore } from '@/stores/links'
import type { Link, LinkFormData } from '@/types'
import AdminLinkForm from '@/components/AdminLinkForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import AppIcon from '@/components/AppIcon.vue'
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

const linksStore = useLinksStore()

onMounted(() => linksStore.fetchLinks())

const formOpen = ref(false)
const editingLink = ref<Link | null>(null)
const isSaving = ref(false)
const saveError = ref<string | null>(null)

const deleteTarget = ref<Link | null>(null)
const isDeleting = ref(false)
const deleteError = ref<string | null>(null)

function openCreate() {
  editingLink.value = null
  saveError.value = null
  formOpen.value = true
}

function openEdit(link: Link) {
  editingLink.value = link
  saveError.value = null
  formOpen.value = true
}

async function handleSave(data: LinkFormData) {
  isSaving.value = true
  saveError.value = null
  let ok: boolean
  if (editingLink.value) {
    ok = await linksStore.updateLink(editingLink.value.id, data)
  } else {
    const result = await linksStore.addLink(data)
    ok = result !== null
  }
  isSaving.value = false
  if (ok) {
    formOpen.value = false
    editingLink.value = null
  } else {
    saveError.value = 'Failed to save the link. Please try again.'
  }
}

function confirmDelete(link: Link) {
  deleteTarget.value = link
  deleteError.value = null
}

async function handleDelete() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  deleteError.value = null
  const ok = await linksStore.deleteLink(deleteTarget.value.id)
  isDeleting.value = false
  if (ok) {
    deleteTarget.value = null
  } else {
    deleteError.value = 'Failed to delete the link. Please try again.'
  }
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manage Links</h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ linksStore.links.length }} tool{{ linksStore.links.length !== 1 ? 's' : '' }}
          configured
        </p>
      </div>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        @click="openCreate"
      >
        <PlusIcon class="h-4 w-4" />
        Add link
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table class="min-w-full divide-y divide-gray-100">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="py-3 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:pl-6"
            >
              Tool
            </th>
            <th
              class="hidden px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 md:table-cell"
            >
              URL
            </th>
            <th
              class="hidden px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:table-cell"
            >
              Category
            </th>
            <th class="relative py-3 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="link in linksStore.links"
            :key="link.id"
            class="group transition-colors hover:bg-gray-50"
          >
            <td class="py-3 pl-4 pr-3 sm:pl-6">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"
                >
                  <AppIcon :name="link.icon" class="h-4 w-4" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ link.title }}</p>
                  <p
                    v-if="link.description"
                    class="hidden max-w-xs truncate text-xs text-gray-400 lg:block"
                  >
                    {{ link.description }}
                  </p>
                </div>
              </div>
            </td>
            <td class="hidden px-3 py-3 md:table-cell">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="max-w-[200px] truncate text-xs text-indigo-600 hover:underline"
              >
                {{ link.url }}
              </a>
            </td>
            <td class="hidden px-3 py-3 sm:table-cell">
              <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {{ link.category }}
              </span>
            </td>
            <td class="py-3 pl-3 pr-4 text-right sm:pr-6">
              <div class="flex items-center justify-end gap-1">
                <button
                  type="button"
                  class="rounded-md p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  title="Edit"
                  @click="openEdit(link)"
                >
                  <PencilSquareIcon class="h-4 w-4" />
                </button>
                <button
                  type="button"
                  class="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  title="Delete"
                  @click="confirmDelete(link)"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="linksStore.links.length === 0">
            <td colspan="4" class="py-16 text-center text-sm text-gray-400">
              No links yet. Click "Add link" to get started.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>

  <!-- Create / Edit modal -->
  <AdminLinkForm
    :open="formOpen"
    :link="editingLink"
    :error="saveError"
    :loading="isSaving"
    @close="formOpen = false"
    @save="handleSave"
  />

  <!-- Delete confirmation modal -->
  <ConfirmModal
    :open="!!deleteTarget"
    :title="`Delete &quot;${deleteTarget?.title}&quot;?`"
    message="This action cannot be undone. The link will be permanently removed."
    confirm-label="Delete"
    :error="deleteError"
    :loading="isDeleting"
    @confirm="handleDelete"
    @cancel="deleteTarget = null; deleteError = null"
  >
    <template #icon>
      <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-600" />
      </div>
    </template>
  </ConfirmModal>
</template>
