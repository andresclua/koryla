<script setup lang="ts">
definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Blog — Splitr', description: 'Articles about A/B testing, experimentation and product growth.' })

const { data: posts } = await useAsyncData('blog', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
</script>

<template>
  <div class="max-w-2xl mx-auto px-6 py-16">
    <div class="mb-12">
      <NuxtLink to="/" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">← Back to home</NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 mt-4">Blog</h1>
      <p class="text-gray-500 mt-2">Thoughts on A/B testing, experimentation and product growth.</p>
    </div>

    <div class="space-y-8">
      <article v-for="post in posts" :key="post.slug" class="group">
        <NuxtLink :to="`/blog/${post.slug}`" class="block">
          <p class="text-xs text-gray-400 mb-1">{{ formatDate(post.date) }}</p>
          <h2 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{{ post.title }}</h2>
          <p class="text-sm text-gray-500 mt-1 leading-relaxed">{{ post.description }}</p>
        </NuxtLink>
      </article>

      <p v-if="!posts?.length" class="text-sm text-gray-400">No posts yet.</p>
    </div>
  </div>
</template>
