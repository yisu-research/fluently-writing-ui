<script setup lang="ts">
import { NButton } from 'naive-ui'
import { toRefs } from 'vue'
import { IconLogo } from '@/components/icons'

// const name = '一粟科研'
const props = defineProps<{
  name: string
}>()

const { name } = toRefs(props)
</script>

<template>
  <NButton text size="large" class="flex items-center justify-start">
    <div>
      <IconLogo class="mr-1 text-teal-500 h-7 w-7 sm:h-8 sm:w-8" />
    </div>
    <div>
      <p class="text-lg font-black text-transparent sm:text-xl bg-gradient-to-br from-primary to-teal-400 bg-clip-text">
        {{ name }}
      </p>
    </div>
  </NButton>
</template>

<style scoped></style>
