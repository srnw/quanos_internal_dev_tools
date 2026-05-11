import type { CreateLinkDto } from './dto/create-link.dto'

export const SEED_LINKS: CreateLinkDto[] = [
  {
    title: 'Grafana',
    url: 'https://grafana.com',
    description: 'Metrics dashboards and observability platform.',
    icon: 'chart-bar',
    category: 'Monitoring',
  },
  {
    title: 'Kibana',
    url: 'https://www.elastic.co/de/kibana',
    description: 'Log aggregation and search powered by Elasticsearch.',
    icon: 'magnifying-glass',
    category: 'Monitoring',
  },
  {
    title: 'Sentry',
    url: 'https://sentry.io',
    description: 'Error tracking and performance monitoring.',
    icon: 'bug-ant',
    category: 'Monitoring',
  },
  {
    title: 'ArgoCD',
    url: 'https://argoproj.github.io/cd/',
    description: 'GitOps continuous delivery for Kubernetes.',
    icon: 'arrow-path',
    category: 'CI/CD',
  },
  {
    title: 'GitHub',
    url: 'https://github.com',
    description: 'Source code repositories and pull requests.',
    icon: 'code-bracket',
    category: 'Source Control',
  },
  {
    title: 'Harbor',
    url: 'https://goharbor.io/',
    description: 'Container registry for storing and distributing images.',
    icon: 'archive-box',
    category: 'Infrastructure',
  },
  {
    title: 'Confluence',
    url: 'https://www.atlassian.com/de/software/confluence',
    description: 'Team documentation and knowledge base.',
    icon: 'document-text',
    category: 'Documentation',
  },
  {
    title: 'Jira',
    url: 'https://www.atlassian.com/de/software/jira',
    description: 'Project tracking, sprints, and issue management.',
    icon: 'clipboard-document-list',
    category: 'Other',
  },
]
