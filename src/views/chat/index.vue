<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
</script>

<template>
  <div>Chat</div>
  <div>窗口大小：</div>
  <div>{{ width }}, {{ height }}</div>
</template>

<style scoped></style>
