<script setup lang="ts">
import { useBasicLayout } from '@/hooks/useBasicLayout'

const { isMobile } = useBasicLayout()
</script>

<template>
  <footer :class="{ 'fixed bottom-0 left-0 right-0': !isMobile }" class="dark:bg-gray-900 dark:border-slate-800">
    <div class="flex items-center justify-center h-12 mx-auto overflow-hidden bg-transparent">
      <p class="text-xs leading-5 text-center text-grey-600">&copy; 2024 一粟科研, Inc. All rights reserved.</p>
    </div>
  </footer>
</template>
