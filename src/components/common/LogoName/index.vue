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
      <IconLogo class="mr-2 text-teal-500 h-7 w-7 sm:h-8 sm:w-8" />
    </div>
    <div>
      <p
        class="text-lg font-bold text-transparent font-jinbu sm:text-2xl bg-gradient-to-br from-grey-700 to-grey-800 bg-clip-text"
      >
        {{ name }}
      </p>
    </div>
  </NButton>
</template>

<style scoped></style>
