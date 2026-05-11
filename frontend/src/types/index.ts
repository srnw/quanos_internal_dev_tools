export const CATEGORIES = [
  'Monitoring',
  'CI/CD',
  'Source Control',
  'Infrastructure',
  'Communication',
  'Documentation',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]

export interface Link {
  id: string
  title: string
  url: string
  description?: string
  icon: string
  category: Category
  createdAt: Date
}

export type LinkFormData = Omit<Link, 'id' | 'createdAt'>
