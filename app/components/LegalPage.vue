<script setup lang="ts">
defineProps<{ page: any }>()
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Nav -->
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: #C96A3F;">
            <span class="text-white font-black text-sm">K</span>
          </div>
          <span class="font-bold text-lg" style="color: #0F2235;">Koryla</span>
        </NuxtLink>
        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <NuxtLink to="/docs" class="hover:text-gray-900 transition-colors">Docs</NuxtLink>
          <NuxtLink to="/blog" class="hover:text-gray-900 transition-colors">Blog</NuxtLink>
        </div>
        <a href="/#waitlist" class="px-4 py-2 rounded-lg text-sm font-semibold text-white" style="background: #C96A3F;">Register</a>
      </div>
    </nav>

    <!-- Header -->
    <div class="texture-dots-sand border-b border-gray-100" style="background: linear-gradient(160deg, #F5EDE0 0%, #ffffff 60%);">
      <div class="max-w-3xl mx-auto px-6 py-14">
        <h1 class="text-4xl font-bold tracking-tight" style="color: #0F2235;">{{ page.title }}</h1>
        <p class="text-sm text-gray-400 mt-3">Last updated: {{ page.updatedAt }}</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-3xl mx-auto px-6 py-14">
      <div class="prose prose-gray prose-lg max-w-none
        prose-headings:font-semibold prose-headings:tracking-tight
        prose-h1:hidden
        prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
        prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
        prose-a:no-underline hover:prose-a:underline
        [&_a]:text-[#C96A3F]
        prose-table:text-sm prose-th:font-semibold prose-th:bg-gray-50
        prose-li:my-0.5">
        <ContentRenderer :value="page" />
      </div>
    </div>

    <!-- Footer -->
    <footer class="py-10 px-6 border-t border-gray-100">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-md flex items-center justify-center" style="background: #C96A3F;">
            <span class="text-white font-black text-xs">K</span>
          </div>
          <span class="font-bold text-sm" style="color: #0F2235;">Koryla</span>
        </div>
        <div class="flex items-center gap-6 text-sm text-gray-400">
          <NuxtLink to="/privacy" class="hover:text-gray-600 transition-colors">Privacy</NuxtLink>
          <NuxtLink to="/terms" class="hover:text-gray-600 transition-colors">Terms</NuxtLink>
        </div>
        <p class="text-sm text-gray-400">© 2026 Koryla. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
