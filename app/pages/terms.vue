<script setup lang="ts">
definePageMeta({ layout: false })

const { data: page } = await useAsyncData('terms', () =>
  queryCollection('legal').where('slug', '=', 'terms').first()
)

if (!page.value) throw createError({ statusCode: 404 })
useSeoMeta({ title: 'Terms of Service — Koryla', description: 'Koryla terms of service and usage policy.' })
</script>

<template>
  <LegalPage :page="page!" />
</template>
