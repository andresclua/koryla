<script setup lang="ts">
definePageMeta({ layout: false })

const { data: page } = await useAsyncData('privacy', () =>
  queryCollection('legal').where('slug', '=', 'privacy').first()
)

if (!page.value) throw createError({ statusCode: 404 })
useSeoMeta({ title: 'Privacy Policy — Koryla', description: 'How Koryla collects and handles your data.' })
</script>

<template>
  <LegalPage :page="page!" />
</template>
