<script setup lang="ts">
import { SvgIcon } from '@/components/common'

defineProps({
  sidebarOpen: Boolean,
})
const emit = defineEmits(['update:sidebarOpen'])

function toggleSidebar() {
  emit('update:sidebarOpen', true)
}
</script>

<template>
  <div class="absolute top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8 w-full">
    <div
      class="flex items-center h-16 px-4 shadow-sm bg-primary lg:h-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none"
    >
      <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="toggleSidebar">
        <span class="sr-only">Open sidebar</span>
        <SvgIcon icon="heroicons-solid:menu-alt-2" class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
