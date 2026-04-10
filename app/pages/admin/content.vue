<script setup lang="ts">
definePageMeta({ layout: false, ssr: false, middleware: 'admin' })

const supabase = useSupabaseClient()

const { data: files, pending: loadingFiles, error: filesError, refresh: refreshFiles } = await useFetch('/api/admin/content')

const selected = ref<{ path: string; name: string } | null>(null)
const editorContent = ref('')
const fileSha = ref('')
const loadingFile = ref(false)
const saving = ref(false)
const saveMsg = ref('')

async function selectFile(file: { path: string; name: string }) {
  selected.value = file
  loadingFile.value = true
  saveMsg.value = ''
  try {
    const data = await $fetch<{ content: string; sha: string }>('/api/admin/content/file', {
      query: { path: file.path },
    })
    editorContent.value = data.content
    fileSha.value = data.sha
  } finally {
    loadingFile.value = false
  }
}

async function save() {
  if (!selected.value) return
  saving.value = true
  saveMsg.value = ''
  try {
    await $fetch('/api/admin/content/file', {
      method: 'PUT',
      body: {
        path: selected.value.path,
        content: editorContent.value,
        sha: fileSha.value,
      },
    })
    saveMsg.value = 'Saved — Netlify deploy triggered'
    // Refresh sha after save
    const updated = await $fetch<{ content: string; sha: string }>('/api/admin/content/file', {
      query: { path: selected.value.path },
    })
    fileSha.value = updated.sha
  } catch (e: any) {
    saveMsg.value = `Error: ${e?.data?.message ?? 'Failed to save'}`
  } finally {
    saving.value = false
  }
}

async function signOut() {
  await supabase.auth.signOut()
  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shrink-0">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/admin" class="text-sm font-semibold text-gray-900 tracking-tight hover:text-blue-600 transition-colors">Splitr Admin</NuxtLink>
          <span class="text-gray-300">/</span>
          <span class="text-sm text-gray-500">Content</span>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/admin" class="text-sm text-gray-500 hover:text-gray-800 transition-colors">Workspaces</NuxtLink>
          <button class="text-sm text-gray-500 hover:text-gray-800 transition-colors" @click="signOut">Sign out</button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full px-6 py-6 gap-6">
      <!-- File tree -->
      <aside class="w-56 shrink-0">
        <div v-if="loadingFiles" class="text-sm text-gray-400">Loading...</div>
        <div v-else-if="filesError" class="text-sm text-red-500">{{ filesError.message }}</div>
        <template v-else-if="files">
          <!-- Blog -->
          <div class="mb-6">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Blog</p>
            <ul class="space-y-0.5">
              <li v-for="file in files.blog" :key="file.path">
                <button
                  class="w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors truncate"
                  :class="selected?.path === file.path ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'"
                  @click="selectFile(file)"
                >
                  {{ file.name }}
                </button>
              </li>
              <li v-if="!files.blog.length" class="text-xs text-gray-400 px-3 py-1">No files</li>
            </ul>
          </div>

          <!-- Docs -->
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Docs</p>
            <ul class="space-y-0.5">
              <li v-for="file in files.docs" :key="file.path">
                <button
                  class="w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors truncate"
                  :class="selected?.path === file.path ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'"
                  @click="selectFile(file)"
                >
                  {{ file.name }}
                </button>
              </li>
              <li v-if="!files.docs.length" class="text-xs text-gray-400 px-3 py-1">No files</li>
            </ul>
          </div>
        </template>
      </aside>

      <!-- Editor -->
      <main class="flex-1 flex flex-col min-w-0">
        <div v-if="!selected" class="flex-1 flex items-center justify-center text-sm text-gray-400">
          Select a file to edit
        </div>

        <template v-else>
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-700 truncate">{{ selected.path }}</p>
            <div class="flex items-center gap-3 shrink-0">
              <span v-if="saveMsg" class="text-xs" :class="saveMsg.startsWith('Error') ? 'text-red-500' : 'text-green-600'">
                {{ saveMsg }}
              </span>
              <button
                :disabled="saving || loadingFile"
                class="text-sm font-medium px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                @click="save"
              >
                <svg v-if="saving" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ saving ? 'Saving...' : 'Save & Deploy' }}
              </button>
            </div>
          </div>

          <div v-if="loadingFile" class="flex-1 flex items-center justify-center text-sm text-gray-400">
            Loading file...
          </div>
          <textarea
            v-else
            v-model="editorContent"
            class="flex-1 w-full font-mono text-sm bg-white border border-gray-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed"
            spellcheck="false"
          />
        </template>
      </main>
    </div>
  </div>
</template>
