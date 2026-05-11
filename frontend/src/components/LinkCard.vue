<script setup lang="ts">
import type { Link } from '@/types'
import AppIcon from './AppIcon.vue'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

const CATEGORY_COLORS: Record<string, string> = {
  Monitoring: 'bg-violet-100 text-violet-700',
  'CI/CD': 'bg-blue-100 text-blue-700',
  'Source Control': 'bg-orange-100 text-orange-700',
  Infrastructure: 'bg-slate-100 text-slate-700',
  Communication: 'bg-green-100 text-green-700',
  Documentation: 'bg-yellow-100 text-yellow-700',
  Other: 'bg-gray-100 text-gray-600',
}

defineProps<{ link: Link }>()

function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-600'
}
</script>

<template>
  <a
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
  >
    <div class="flex items-start justify-between gap-2">
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100"
      >
        <AppIcon :name="link.icon" class="h-5 w-5" />
      </div>
      <ArrowTopRightOnSquareIcon
        class="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-indigo-500"
      />
    </div>

    <div class="flex flex-col gap-1">
      <h3 class="text-sm font-semibold text-gray-900 group-hover:text-indigo-700">
        {{ link.title }}
      </h3>
      <p v-if="link.description" class="line-clamp-2 text-xs text-gray-500">
        {{ link.description }}
      </p>
    </div>

    <div class="mt-auto pt-1">
      <span
        class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
        :class="categoryColor(link.category)"
      >
        {{ link.category }}
      </span>
    </div>
  </a>
</template>
