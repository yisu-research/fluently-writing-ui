<script setup lang="ts">
import logoSvg from '@/assets/svg/logo.svg'
import ButtonNewChat from '@/layout/button-new-chat/index.vue'
</script>

<template>
  <div class="py-28 lg:py-48">
    <img :src="logoSvg" class="h-auto mx-auto w-28" />
    <div class="max-w-4xl p-4 mx-auto mt-4 text-center sm:mt-8 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold font-jinbu text-slate-800 sm:text-4xl dark:text-white">欢迎使用一粟AI科研平台</h1>
      <p class="mt-2 text-slate-500 dark:text-gray-400">⼀粟科研，你的科研好帮⼿</p>
    </div>

    <div class="flex justify-center w-full mt-8">
      <div class="w-48">
        <ButtonNewChat />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
