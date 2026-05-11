<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  WrenchScrewdriverIcon,
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
    <div
      class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
    >
      <!-- Logo / brand -->
      <RouterLink
        to="/"
        class="flex items-center gap-2 font-semibold text-gray-900 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <WrenchScrewdriverIcon class="h-5 w-5 text-indigo-600" />
        <span class="text-sm">DevTools Hub</span>
      </RouterLink>

      <!-- Nav actions -->
      <nav class="flex items-center gap-2">
        <template v-if="authStore.isAuthenticated">
          <RouterLink
            to="/admin"
            class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            active-class="bg-indigo-50 text-indigo-700"
          >
            Admin
          </RouterLink>
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            @click="logout"
          >
            <ArrowRightStartOnRectangleIcon class="h-4 w-4" />
            Logout
          </button>
        </template>
        <template v-else>
          <RouterLink
            to="/admin/login"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <ArrowRightEndOnRectangleIcon class="h-4 w-4" />
            Admin
          </RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>
