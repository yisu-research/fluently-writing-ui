<script setup lang="ts">
import { SvgIcon } from '@/components/common'
</script>

<template>
  <div class="bg-teal-100 bg-opacity-90 navbar backdrop-blur backdrop-filter firefox:bg-opacity-90">
    <div class="navbar-start">
      <SvgIcon class="mx-4 text-2xl" icon="uil:arrow-left" />
    </div>
    <div class="navbar-center">
      <a class="px-2 text-xl font-bold text-teal-500 normal-case">Pixel Art</a>
    </div>
    <div class="navbar-end lg:hidden">
      <SvgIcon class="mx-4 text-2xl" icon="uil:bars" />
    </div>
    <div class="hidden h-6 navbar-end lg:flex">
      <ul class="flex justify-start px-1">
        <li class="mr-8">主页</li>
        <li class="mr-4">像素画板</li>
      </ul>
    </div>
  </div>
</template>
