<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () =>
  queryCollection('blog').where('slug', '=', route.params.slug as string).first()
)

if (!post.value) throw createError({ statusCode: 404, message: 'Post not found' })

useSeoMeta({ title: `${post.value.title} — Splitr`, description: post.value.description })

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
</script>

<template>
  <div class="max-w-2xl mx-auto px-6 py-16">
    <NuxtLink to="/blog" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">← All posts</NuxtLink>

    <article class="mt-8">
      <header class="mb-8">
        <p class="text-xs text-gray-400 mb-2">{{ formatDate(post!.date) }} · {{ post!.author }}</p>
        <h1 class="text-3xl font-bold text-gray-900 leading-tight">{{ post!.title }}</h1>
        <p class="text-gray-500 mt-3 text-lg leading-relaxed">{{ post!.description }}</p>
      </header>

      <div class="prose prose-gray prose-sm max-w-none">
        <ContentRenderer :value="post!" />
      </div>
    </article>
  </div>
</template>
