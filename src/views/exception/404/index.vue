<script setup lang="ts">
import NotFoundSvg from '@/assets/svg/404-page-not-found.svg'
</script>

<template>
  <main class="min-h-screen isolate bg-slate-50">
    <div class="px-6 py-32 mx-auto text-center max-w-7xl sm:py-40 lg:px-8">
      <div class="w-full"><img class="block mx-auto w-96" :src="NotFoundSvg" alt="not found" /></div>
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-teal-400 sm:text-5xl">没有发现页面</h1>
      <div class="flex justify-center mt-10">
        <RouterLink class="text-sm font-semibold leading-7 text-slate-900" to="/"
          ><span aria-hidden="true">&larr;</span>返回首页</RouterLink
        >
      </div>
    </div>
  </main>
</template>
