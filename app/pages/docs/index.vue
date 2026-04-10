<script setup lang="ts">
definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Docs — Splitr', description: 'Documentation for Splitr — edge-based A/B testing.' })

const { data: pages } = await useAsyncData('docs', () =>
  queryCollection('docs').order('order', 'ASC').all()
)

const grouped = computed(() => {
  const map: Record<string, typeof pages.value> = {}
  for (const page of pages.value ?? []) {
    const section = page.section ?? 'General'
    if (!map[section]) map[section] = []
    map[section]!.push(page)
  }
  return map
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-16 flex gap-12">
    <!-- Sidebar -->
    <aside class="w-48 shrink-0 hidden md:block">
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Documentation</p>
      <div v-for="(pages, section) in grouped" :key="section" class="mb-6">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{{ section }}</p>
        <ul class="space-y-1">
          <li v-for="page in pages" :key="page.slug">
            <NuxtLink
              :to="`/docs/${page.slug}`"
              class="text-sm text-gray-600 hover:text-gray-900 transition-colors block py-0.5"
              active-class="text-blue-600 font-medium"
            >
              {{ page.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 min-w-0">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Documentation</h1>
      <p class="text-gray-500 mb-10">Everything you need to run A/B experiments with Splitr.</p>

      <div v-for="(pages, section) in grouped" :key="section" class="mb-10">
        <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{{ section }}</h2>
        <div class="space-y-3">
          <NuxtLink
            v-for="page in pages"
            :key="page.slug"
            :to="`/docs/${page.slug}`"
            class="block p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors group"
          >
            <p class="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{{ page.title }}</p>
            <p class="text-sm text-gray-500 mt-0.5">{{ page.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>
