<script setup lang="ts">
import { SvgIcon } from '@/components/common'

defineProps({
  collapsed: Boolean,
})
const emit = defineEmits(['update:collapsed'])

function toggleSidebar() {
  emit('update:collapsed', false)
}
</script>

<template>
  <div
    class="absolute top-0 z-40 w-full bg-transparent lg:mx-auto lg:max-w-7xl lg:px-8 backdrop-filter backdrop-blur-md"
  >
    <div
      class="flex items-center h-16 px-4 shadow-sm bg-primary/5 lg:h-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none"
    >
      <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="toggleSidebar">
        <span class="sr-only">Open sidebar</span>
        <SvgIcon icon="hugeicons:menu-01" class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
