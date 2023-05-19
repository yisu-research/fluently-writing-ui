import { SvgIcon } from '@/components/common';
<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { SvgIcon } from '@/components/common'
import { useAppStore } from '@/store/modules'

interface Props {
  content: {
    title: string
    subTitle: string
    image: string
    items: {
      name: string
      description: string
      icon: string
    }[]
  }
  position: 'left' | 'right'
}

const props = defineProps<Props>()

const { content, position } = toRefs(props)

const appStore = useAppStore()

const isLight = computed(() => !appStore.isDarkTheme)
</script>

<template>
  <div
    :class="{ 'bg-white': isLight, 'bg-gray-900': !isLight, 'bg-emerald-400/[0.15]': position === 'right' && isLight }"
    class="relative py-16 overflow-hidden isolate sm:py-32"
  >
    <div class="mx-auto max-w-7xl md:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:grid-cols-7 lg:items-center">
        <div class="col-span-3 px-6 lg:px-0 lg:pr-4" :class="{ 'justify-end flex': position === 'left' }">
          <div class="max-w-2xl mx-auto lg:mx-0 lg:max-w-lg">
            <p
              :class="{
                'text-teal-500': isLight,
                'text-transparent sm:text-4xl bg-clip-text bg-gradient-to-r from-teal-500 via-indigo-500 to-sky-500':
                  !isLight,
              }"
              class="text-3xl font-bold tracking-tight max-w-fit"
            >
              {{ content.title }}
            </p>
            <p
              :class="{
                'text-slate-700': isLight,
                'text-gray-300': !isLight,
              }"
              class="mt-6 text-lg leading-8"
            >
              {{ content.subTitle }}
            </p>
            <dl class="max-w-xl mt-10 space-y-8 text-base leading-7 text-slate-500 lg:max-w-none">
              <div v-for="feature in content.items" :key="feature.name" class="relative pl-9">
                <dt
                  :class="{
                    'text-slate-700': isLight,
                    'text-slate-50': !isLight,
                  }"
                  class="inline font-semibold"
                >
                  <SvgIcon
                    :icon="feature.icon"
                    class="absolute w-5 h-5 text-teal-500 top-1 left-1"
                    aria-hidden="true"
                  />
                  {{ feature.name }}
                </dt>
                <dd class="inline">{{ feature.description }}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div :class="{ 'lg:order-first': position === 'left' }" class="col-span-4 px-6 lg:px-0">
          <div class="max-w-2xl mx-auto sm:mx-0 sm:max-w-none">
            <img
              :src="content.image"
              alt="Product screenshot"
              class="bg-gray-300 rounded-lg sm:rounded-3xl ring-8 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-show="!isLight" class="absolute inset-x-0 top-0 h-20 bg-gradient-to-b sm:from-gray-900"></div>
    <div v-show="!isLight" class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t sm:from-gray-900"></div>
    <svg
      v-show="!isLight"
      class="pointer-events-none absolute top-1/2 left-12 -z-10 h-[42.375rem] -translate-y-1/2 transform-gpu blur-3xl lg:top-auto lg:bottom-[-12rem] lg:translate-y-0"
      viewBox="0 0 1155 678"
      fill="none"
    >
      <path
        fill="url(#c0458c57-1330-459f-9d5c-f0d75c210466)"
        fill-opacity=".25"
        d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
      />
      <defs>
        <linearGradient
          id="c0458c57-1330-459f-9d5c-f0d75c210466"
          x1="1155.49"
          x2="-78.208"
          y1=".177"
          y2="474.645"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#21D3FF" />
          <stop offset="1" stop-color="#10FFF3" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>
