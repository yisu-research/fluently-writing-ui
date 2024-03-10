<script setup lang="ts">
import { NButton } from 'naive-ui'
import { computed } from 'vue'
import HeroSvg from '@/assets/svg/hero.svg'
import { SvgIcon } from '@/components/common'
import { useAppStore, useUserStoreWithOut } from '@/store'
import { router } from '@/router'

// app
const appStore = useAppStore()

// user
const userStore = useUserStoreWithOut()

// isDark
const isDark = computed(() => appStore.isDarkTheme)

// title
const title = '一粟创作助手'

// slogan
const slogan = '激发灵感，提高效率'

// 现在开始
const start = '现在开始'

const isLogin = computed(() => userStore.getUsername)

// footnote
const footnote = 'Powered by'

function clickStart() {
  if (userStore.getUsername) {
    router.push('/chat')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <div class="relative overflow-hidden bg-white isolate dark:bg-gray-900">
    <div v-show="isDark" class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-900"></div>
    <svg
      class="absolute inset-0 -z-10 h-full w-full stroke-gray-200 dark:stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
          width="200"
          height="200"
          x="50%"
          y="-1"
          patternUnits="userSpaceOnUse"
        >
          <path d="M100 200V.5M.5 .5H200" fill="none" />
        </pattern>
      </defs>
      <svg x="50%" y="-1" class="overflow-visible fill-gray-50 dark:fill-slate-800/20">
        <path
          d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
          stroke-width="0"
        />
      </svg>
      <rect width="100%" height="100%" stroke-width="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
    </svg>

    <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
      <svg
        class="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/3 rotate-[20deg] sm:left-[calc(50%-20rem)] sm:h-[62.375rem]"
        viewBox="0 0 1155 678"
      >
        <path
          fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
          fill-opacity=".3"
          d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
        />
        <defs>
          <linearGradient
            id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
            x1="1155.49"
            x2="-78.208"
            y1=".177"
            y2="474.645"
            gradientUnits="userSpaceOnUse"
          >
            <stop :stop-color="isDark ? '#05EF99' : '#2DD4BF'" />
            <stop offset="1" :stop-color="isDark ? '#993FF8' : '#CDF973'" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div class="px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
      <div class="flex flex-col items-center max-w-2xl mx-auto lg:items-start lg:mx-0 lg:flex-auto">
        <!-- 渐变色标题 -->
        <h1
          class="max-w-lg mt-10 text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-300 sm:text-6xl xl:text-7xl"
        >
          {{ title }}
        </h1>

        <div>
          <p class="mt-6 text-2xl leading-8 text-slate-600 dark:text-slate-300">{{ slogan }}</p>
          <p class="text-lg text-gray-600 leading-2 dark:text-gray-400">
            {{ footnote }}
            <a href="https://chat.openai.com" class="text-teal-500 hover:text-teal-400">ChatGPT</a>
          </p>
        </div>
        <div class="flex items-center mt-10 gap-x-6">
          <NButton type="primary" size="large" class="hover:ring-2 hover:ring-green-200" @click="clickStart">
            <SvgIcon icon="solar:ufo-3-line-duotone" class="mr-2 text-lg text-teal-50" />
            <span class="font-bold text-teal-50">{{ start }}</span>
          </NButton>
        </div>
      </div>

      <div class="mx-auto mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
        <img :src="HeroSvg" alt="" class="mx-auto w-[45rem] max-w-full drop-shadow-xl" />
      </div>
    </div>
  </div>
</template>
