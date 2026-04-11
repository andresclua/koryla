<script setup lang="ts">
const props = defineProps<{ text: string; position?: 'top' | 'bottom' }>()

const show = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const tooltipStyle = ref<Record<string, string>>({})

const updatePosition = () => {
  const el = triggerRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const above = props.position !== 'bottom'
  tooltipStyle.value = {
    position: 'fixed',
    left: `${r.left + r.width / 2}px`,
    ...(above
      ? { bottom: `${window.innerHeight - r.top + 8}px`, top: 'auto' }
      : { top: `${r.bottom + 8}px`, bottom: 'auto' }),
    transform: 'translateX(-50%)',
    zIndex: '9999',
  }
}

const onEnter = () => {
  updatePosition()
  show.value = true
}
</script>

<template>
  <span ref="triggerRef" class="inline-flex items-center" @mouseenter="onEnter" @mouseleave="show = false">
    <slot>
      <svg
        class="w-3.5 h-3.5 text-gray-300 hover:text-gray-400 cursor-default transition-colors shrink-0"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4M12 8h.01" />
      </svg>
    </slot>
  </span>

  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <span
        v-if="show"
        :style="tooltipStyle"
        class="pointer-events-none w-max max-w-[200px] rounded-lg bg-gray-900 px-2.5 py-1.5 text-[11px] leading-relaxed text-white shadow-lg text-center whitespace-normal"
      >
        {{ text }}
      </span>
    </Transition>
  </Teleport>
</template>
