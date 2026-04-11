<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { workspaces, fetchWorkspaces } = useWorkspace()
await fetchWorkspaces()

const first = workspaces.value.find(w => !w.is_demo) ?? workspaces.value[0]
if (first) {
  await navigateTo(`/dashboard/${first.slug}`, { replace: true })
} else {
  await navigateTo('/onboarding', { replace: true })
}
</script>

<template>
  <div />
</template>
