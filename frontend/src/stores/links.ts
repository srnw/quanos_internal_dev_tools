import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api/client'
import type { Link, LinkFormData } from '@/types'

interface ApiLink extends Omit<Link, 'id' | 'createdAt'> {
  _id: string
  createdAt: string
}

function normalise(raw: ApiLink): Link {
  return {
    id: raw._id,
    title: raw.title,
    url: raw.url,
    description: raw.description,
    icon: raw.icon,
    category: raw.category,
    createdAt: new Date(raw.createdAt),
  }
}

export const useLinksStore = defineStore('links', () => {
  const links = ref<Link[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLinks(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const data = await api.get<ApiLink[]>('/links')
      links.value = data.map(normalise)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load links'
    } finally {
      isLoading.value = false
    }
  }

  async function addLink(data: LinkFormData): Promise<Link | null> {
    try {
      const raw = await api.post<ApiLink>('/links', data)
      const link = normalise(raw)
      links.value.push(link)
      return link
    } catch {
      return null
    }
  }

  async function updateLink(id: string, data: LinkFormData): Promise<boolean> {
    try {
      const raw = await api.patch<ApiLink>(`/links/${id}`, data)
      const updated = normalise(raw)
      const idx = links.value.findIndex((l) => l.id === id)
      if (idx !== -1) links.value[idx] = updated
      return true
    } catch {
      return false
    }
  }

  async function deleteLink(id: string): Promise<boolean> {
    try {
      await api.delete(`/links/${id}`)
      links.value = links.value.filter((l) => l.id !== id)
      return true
    } catch {
      return false
    }
  }

  function getLinkById(id: string): Link | undefined {
    return links.value.find((l) => l.id === id)
  }

  return { links, isLoading, error, fetchLinks, addLink, updateLink, deleteLink, getLinkById }
})
