<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const { data: page } = await useAsyncData(`docs-${route.params.slug}`, () =>
  queryCollection('docs').where('slug', '=', route.params.slug as string).first()
)

if (!page.value) throw createError({ statusCode: 404, message: 'Page not found' })

useSeoMeta({ title: `${page.value.title} — Splitr Docs`, description: page.value.description })

const { data: allPages } = await useAsyncData('docs-nav', () =>
  queryCollection('docs').order('order', 'ASC').all()
)

const grouped = computed(() => {
  const map: Record<string, typeof allPages.value> = {}
  for (const p of allPages.value ?? []) {
    const section = p.section ?? 'General'
    if (!map[section]) map[section] = []
    map[section]!.push(p)
  }
  return map
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-16 flex gap-12">
    <!-- Sidebar -->
    <aside class="w-48 shrink-0 hidden md:block">
      <NuxtLink to="/docs" class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 block hover:text-gray-600 transition-colors">Documentation</NuxtLink>
      <div v-for="(pages, section) in grouped" :key="section" class="mb-6">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{{ section }}</p>
        <ul class="space-y-1">
          <li v-for="p in pages" :key="p.slug">
            <NuxtLink
              :to="`/docs/${p.slug}`"
              class="text-sm text-gray-600 hover:text-gray-900 transition-colors block py-0.5"
              active-class="text-blue-600 font-medium"
            >
              {{ p.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 min-w-0">
      <div class="prose prose-gray max-w-none">
        <ContentRenderer :value="page!" />
      </div>

      <!-- Prev/Next nav -->
      <div class="mt-12 pt-6 border-t border-gray-100 flex justify-between">
        <div />
        <NuxtLink to="/docs" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">← All docs</NuxtLink>
      </div>
    </main>
  </div>
</template>
