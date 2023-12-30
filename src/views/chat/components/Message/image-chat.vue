<script setup lang="ts">
interface Props {
  images: any[]
}

const props = defineProps<Props>()
</script>

<template>
  <ul role="list" class="grid w-full grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-2 xl:gap-x-8">
    <li v-for="file in props.images" :key="file.url" class="relative sm:col-start-2">
      <div
        class="block w-full overflow-hidden bg-gray-100 rounded-lg group aspect-h-7 aspect-w-10 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
      >
        <img :src="file.url" alt="" class="object-cover pointer-events-none group-hover:opacity-75" />
      </div>
    </li>
  </ul>
</template>
