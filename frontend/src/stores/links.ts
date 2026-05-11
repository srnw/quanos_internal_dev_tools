import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Link, LinkFormData } from '@/types'

const SEED_LINKS: Link[] = [
  {
    id: '5fe0d841-d082-4d36-9b61-a44c386974af',
    title: 'Grafana',
    url: 'https://grafana.example.com',
    description: 'Metrics dashboards and observability platform.',
    icon: 'chart-bar',
    category: 'Monitoring',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'd53bdec4-8025-45f3-bedb-6fbfcef1e932',
    title: 'Kibana',
    url: 'https://kibana.example.com',
    description: 'Log aggregation and search powered by Elasticsearch.',
    icon: 'magnifying-glass',
    category: 'Monitoring',
    createdAt: new Date('2024-01-11'),
  },
  {
    id: '5be0641a-90ce-4587-be93-7a2a2abe84d1',
    title: 'Sentry',
    url: 'https://sentry.example.com',
    description: 'Error tracking and performance monitoring.',
    icon: 'bug-ant',
    category: 'Monitoring',
    createdAt: new Date('2024-01-12'),
  },
  {
    id: 'c7127266-fd17-4887-92f5-45757de5a615',
    title: 'ArgoCD',
    url: 'https://argocd.example.com',
    description: 'GitOps continuous delivery for Kubernetes.',
    icon: 'arrow-path',
    category: 'CI/CD',
    createdAt: new Date('2024-01-13'),
  },
  {
    id: '575944df-1388-4915-84d2-1e5637785490',
    title: 'GitHub',
    url: 'https://github.com/example-org',
    description: 'Source code repositories and pull requests.',
    icon: 'code-bracket',
    category: 'Source Control',
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '2bd725ad-683e-44b3-95b9-b6ac1052e010',
    title: 'Harbor',
    url: 'https://harbor.example.com',
    description: 'Container registry for storing and distributing images.',
    icon: 'archive-box',
    category: 'Infrastructure',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '8c5c8208-bf71-409e-a012-68a91a304983',
    title: 'Confluence',
    url: 'https://wiki.example.com',
    description: 'Team documentation and knowledge base.',
    icon: 'document-text',
    category: 'Documentation',
    createdAt: new Date('2024-01-16'),
  },
  {
    id: '8ce2af3f-7205-4f06-bbe0-d00bebe93030',
    title: 'Jira',
    url: 'https://jira.example.com',
    description: 'Project tracking, sprints, and issue management.',
    icon: 'clipboard-document-list',
    category: 'Other',
    createdAt: new Date('2024-01-17'),
  },
]

export const useLinksStore = defineStore('links', () => {
  const links = ref<Link[]>([...SEED_LINKS])

  function addLink(data: LinkFormData): Link {
    const link: Link = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
    }
    links.value.push(link)
    return link
  }

  function updateLink(id: string, data: LinkFormData): boolean {
    const idx = links.value.findIndex((l) => l.id === id)
    const existing = links.value[idx]
    if (idx === -1 || !existing) return false
    links.value[idx] = {
      id: existing.id,
      createdAt: existing.createdAt,
      ...data,
    }
    return true
  }

  function deleteLink(id: string): boolean {
    const idx = links.value.findIndex((l) => l.id === id)
    if (idx === -1) return false
    links.value.splice(idx, 1)
    return true
  }

  function getLinkById(id: string): Link | undefined {
    return links.value.find((l) => l.id === id)
  }

  return { links, addLink, updateLink, deleteLink, getLinkById }
})
