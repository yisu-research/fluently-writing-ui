<script setup lang="ts">
import { computed } from 'vue'
import HeroSvg from '@/assets/svg/hero.svg'
import { SvgIcon } from '@/components/common'
import { useAppStore, useUserStoreWithOut } from '@/store'
import { router } from '@/router'
import HeroBg from '@/assets/images/background-newsletter.488a0204.jpg'

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
const start = '立刻体验'

// const isLogin = computed(() => userStore.getUsername)

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
      class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl backdrop-blur-3xl bg-white/20 sm:top-[-15rem]"
    >
      <img
        :src="HeroBg"
        alt=""
        class="w-full h-full scale-105 opacity-30 sm:object-cover sm:scale-150 sm:translate-y-72 -hue-rotate-[120deg] blur-xl"
      />
    </div>
    <div class="absolute top-0 left-0 right-0 h-screen bg-white -z-10 opacity-20 blur-3xl"></div>
    <div
      class="px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-28 lg:h-[calc(100vh)]"
    >
      <div class="flex flex-col items-center max-w-2xl mx-auto sm:-mt-32 lg:items-start lg:mx-0 lg:flex-auto">
        <!-- 渐变色标题 -->
        <h1
          class="max-w-lg mt-8 text-4xl font-bold tracking-tight text-transparent font-jinbu bg-clip-text bg-gradient-to-r from-primary-2 to-primary sm:text-5xl xl:text-6xl"
        >
          {{ title }}
        </h1>

        <div>
          <p class="mt-6 font-medium sm:leading-8 text-md sm:text-lg text-hight-class-gray-1 dark:text-slate-300">
            {{ slogan }}
          </p>
        </div>
        <div class="flex items-center mt-10 gap-x-6">
          <button
            type="button"
            class="inline-flex items-center gap-x-2 rounded-lg bg-primary-2/10 px-3.5 py-2.5 text-sm font-semibold text-primary border border-primary/60 hover:bg-primary/80 hover:scale-95 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            @click="clickStart"
          >
            <SvgIcon icon="hugeicons:atomic-power" class="-ml-0.5 h-5 w-5" />
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
