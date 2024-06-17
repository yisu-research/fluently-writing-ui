<script setup lang="ts">
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
const title = '一粟科研AI平台'

// slogan
const slogan =
  '一站式的科研AI平台服务平台，基于最先进的AI技术构建，覆盖科研全流程，包括：数据标注，数据分析，论文解读，论文润色，智能对话，智能绘图，科研智能体等。'

// 现在开始
const start = '马上开始'

// const isLogin = computed(() => userStore.getUsername)

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

    <div
      class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl backdrop-blur-3xl bg-white/90 sm:top-[-15rem]"
    >
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
            <stop :stop-color="isDark ? '#02EADA' : '#07D768'" />
            <stop offset="1" :stop-color="isDark ? '#7103E6' : '#ADFF0A'" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div class="px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-28">
      <div class="flex flex-col items-center max-w-2xl mx-auto lg:items-start lg:mx-0 lg:flex-auto">
        <!-- 渐变色标题 -->
        <h1
          class="max-w-lg mt-8 text-4xl font-bold tracking-tight text-transparent font-jinbu bg-clip-text bg-gradient-to-r from-primary-2 to-primary-3 sm:text-5xl xl:text-6xl"
        >
          {{ title }}
        </h1>

        <div>
          <p class="mt-6 text-xl font-medium leading-8 text-hight-class-gray-1 dark:text-slate-300">{{ slogan }}</p>
        </div>
        <div class="flex items-center mt-10 gap-x-6">
          <button
            type="button"
            class="inline-flex items-center gap-x-2 rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            @click="clickStart"
          >
            <SvgIcon icon="solar:ufo-3-line-duotone" class="-ml-0.5 h-5 w-5" />
            {{ start }}
          </button>
        </div>
      </div>

      <div class="mx-auto mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
        <img :src="HeroSvg" alt="" class="mx-auto w-[40rem] max-w-full drop-shadow-xl" />
      </div>
    </div>
  </div>
</template>
