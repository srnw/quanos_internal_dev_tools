<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLinksStore } from '@/stores/links'
import { CATEGORIES } from '@/types'
import LinkCard from '@/components/LinkCard.vue'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/vue/24/outline'

const linksStore = useLinksStore()

onMounted(() => linksStore.fetchLinks())

const search = ref('')
const activeCategory = ref<string>('All')

const filteredLinks = computed(() => {
  let result = linksStore.links

  if (activeCategory.value !== 'All') {
    result = result.filter((l) => l.category === activeCategory.value)
  }

  const q = search.value.trim().toLowerCase()
  if (q) {
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.description ?? '').toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q),
    )
  }

  return result
})

const availableCategories = computed(() => ['All', ...CATEGORIES])

function clearFilters() {
  search.value = ''
  activeCategory.value = 'All'
}
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Developer Tools</h1>
      <p class="mt-1 text-sm text-gray-500">
        Quick access to all internal tools and services used by the engineering team.
      </p>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- Search -->
      <div class="relative w-full max-w-xs">
        <MagnifyingGlassIcon
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        />
        <input
          v-model="search"
          type="search"
          aria-label="Search tools"
          placeholder="Search tools…"
          class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <!-- Category pills -->
      <div class="flex flex-wrap items-center gap-1.5">
        <FunnelIcon class="h-4 w-4 text-gray-400" />
        <button
          v-for="cat in availableCategories"
          :key="cat"
          type="button"
          class="rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          :class="
            activeCategory === cat
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          "
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="linksStore.isLoading" class="flex justify-center py-24">
      <span
        class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
      />
    </div>

    <!-- Error state -->
    <div
      v-else-if="linksStore.error"
      class="flex flex-col items-center justify-center py-24 text-center"
    >
      <p class="text-sm font-medium text-red-500">Failed to load tools</p>
      <p class="mt-1 text-xs text-gray-400">{{ linksStore.error }}</p>
      <button
        type="button"
        class="mt-4 text-xs text-indigo-600 underline hover:text-indigo-800"
        @click="linksStore.fetchLinks()"
      >
        Retry
      </button>
    </div>

    <!-- Cards grid -->
    <div
      v-else-if="filteredLinks.length > 0"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <LinkCard v-for="link in filteredLinks" :key="link.id" :link="link" />
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-24 text-center">
      <MagnifyingGlassIcon class="mb-3 h-10 w-10 text-gray-300" />
      <p class="text-sm font-medium text-gray-500">No tools found</p>
      <p class="mt-1 text-xs text-gray-400">Try a different search term or category filter.</p>
      <button
        type="button"
        class="mt-4 text-xs text-indigo-600 underline hover:text-indigo-800"
        @click="clearFilters"
      >
        Clear filters
      </button>
    </div>
  </main>
</template>
