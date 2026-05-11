<script setup lang="ts">
import type { Component } from 'vue'
import {
  ChartBarIcon,
  MagnifyingGlassIcon,
  BugAntIcon,
  ArrowPathIcon,
  CodeBracketIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  LinkIcon,
  WrenchScrewdriverIcon,
  ServerIcon,
  ShieldCheckIcon,
  CloudIcon,
  CubeIcon,
  BeakerIcon,
} from '@heroicons/vue/24/outline'

const ICON_MAP: Record<string, Component> = {
  'chart-bar': ChartBarIcon,
  'magnifying-glass': MagnifyingGlassIcon,
  'bug-ant': BugAntIcon,
  'arrow-path': ArrowPathIcon,
  'code-bracket': CodeBracketIcon,
  'archive-box': ArchiveBoxIcon,
  'document-text': DocumentTextIcon,
  'clipboard-document-list': ClipboardDocumentListIcon,
  link: LinkIcon,
  'wrench-screwdriver': WrenchScrewdriverIcon,
  server: ServerIcon,
  'shield-check': ShieldCheckIcon,
  cloud: CloudIcon,
  cube: CubeIcon,
  beaker: BeakerIcon,
}

const props = withDefaults(
  defineProps<{
    name: string
    class?: string
  }>(),
  { class: 'w-6 h-6' },
)

const component = ICON_MAP[props.name] ?? LinkIcon
</script>

<template>
  <component :is="component" :class="props.class" />
</template>
