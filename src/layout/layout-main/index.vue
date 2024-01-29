import { RouterView } from 'vue-router';
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import { router } from '@/router'

// 保证每次路由变化时，RouterView 都会重新渲染
const key = computed(() => {
  return router.currentRoute.value.name
    ? router.currentRoute.value.name.toString() + new Date().toString()
    : router.currentRoute.value.path.toString() + new Date().toString()
})
</script>

<template>
  <main>
    <RouterView :key="key" />
  </main>
</template>

<style scoped></style>
