<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LockClosedIcon } from '@heroicons/vue/24/solid'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  if (!username.value || !password.value) return
  isLoading.value = true
  const ok = await authStore.login(username.value, password.value)
  isLoading.value = false
  if (ok) {
    router.push({ name: 'admin' })
  }
}
</script>

<template>
  <div class="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="mb-6 flex flex-col items-center gap-2 text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
          <LockClosedIcon class="h-6 w-6 text-indigo-600" />
        </div>
        <h1 class="text-xl font-bold text-gray-900">Admin Login</h1>
        <p class="text-sm text-gray-500">Sign in to manage developer tool links.</p>
      </div>

      <form
        class="rounded-xl border border-gray-200 bg-white px-6 py-8 shadow-sm"
        @submit.prevent="handleSubmit"
      >
        <!-- Error -->
        <div
          v-if="authStore.loginError"
          class="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          <ExclamationCircleIcon class="h-4 w-4 shrink-0" />
          {{ authStore.loginError }}
        </div>

        <div class="flex flex-col gap-4">
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-700" for="username">
              Username
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              autocomplete="username"
              required
              class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="admin"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-gray-700" for="password">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading || !username || !password"
            class="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              v-if="isLoading"
              class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
            {{ isLoading ? 'Signing in…' : 'Sign in' }}
          </button>
        </div>

        <p class="mt-4 text-center text-[11px] text-gray-400">
          Demo credentials: <span class="font-mono font-medium">admin / admin123</span>
        </p>
      </form>
    </div>
  </div>
</template>
