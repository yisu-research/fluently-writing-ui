<script setup lang="ts">
import logoSvg from '@/assets/svg/logo.svg'
import ButtonNewChat from '@/layout/button-new-chat/index.vue'
</script>

<template>
  <div class="py-28 lg:py-48">
    <img :src="logoSvg" class="h-auto mx-auto mb-4 w-28" />
    <div class="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-slate-800 sm:text-4xl dark:text-white">欢迎使用一粟创作助手</h1>
      <p class="mt-3 text-slate-500 dark:text-gray-400">灵感之源，助你成就创作梦想</p>
    </div>

    <div class="flex justify-center w-full mt-8">
      <div class="w-48">
        <ButtonNewChat />
      </div>
    </div>  
  </div>
</template>

<style scoped></style>
