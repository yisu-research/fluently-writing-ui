<script setup lang="ts">
import { computed } from 'vue'
import TemplateImg from '@/assets/images/template.png'
import { useAppStore } from '@/store/modules'
import { SvgIcon } from '@/components/common'

const appStore = useAppStore()

const isLight = computed(() => !appStore.isDarkTheme)

const content = {
  title: '海量模版',
  subTitle: '内置海量模版，帮助您快速开始',
  image: TemplateImg,
  items: [
    {
      name: '内置20+模版库',
      description: '',
      icon: 'solar:inbox-archive-bold-duotone',
    },
    {
      name: '持续解锁新玩法',
      description: '',
      icon: 'solar:planet-bold-duotone',
    },
    {
      name: '兼具趣味和实用',
      description: '',
      icon: 'solar:sticker-smile-square-bold-duotone',
    },
  ],
}
</script>

<template>
  <div
    :class="{
      'bg-white': isLight,
      'bg-gray-900': !isLight,
    }"
    class="py-16 overflow-hidden border-t sm:py-32 border-slate-200 dark:border-slate-600"
  >
    <div class="mx-auto max-w-7xl md:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
        <div class="px-6 lg:px-0 lg:pr-4">
          <div class="max-w-2xl mx-auto lg:mx-0 lg:max-w-lg">
            <p class="text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-50 sm:text-4xl">
              {{ content.title }}
            </p>
            <p class="mt-6 text-lg leading-8 text-slate-700 dark:text-slate-300">{{ content.subTitle }}</p>
            <dl class="max-w-xl mt-10 space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
              <div v-for="feature in content.items" :key="feature.name" class="relative pl-9">
                <dt class="inline font-semibold text-gray-900 dark:text-slate-50">
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
        <div class="px-6 lg:px-0">
          <div
            class="relative px-6 pt-8 overflow-hidden border-0 border-teal-400 bg-teal-400/50 sm:mx-auto sm:max-w-2xl rounded-xl sm:rounded-3xl sm:pt-16 sm:pl-16 sm:pr-0 lg:mx-0 lg:max-w-none ring-8 ring-teal-200/20"
          >
            <div class="max-w-2xl mx-auto sm:mx-0 sm:max-w-none">
              <img
                :src="TemplateImg"
                alt="Product screenshot"
                width="2432"
                height="1442"
                class="px-4 pt-4 bg-white dark:bg-slate-600 rounded-tl-xl ring-2 ring-white/10"
              />
            </div>
            <div class="absolute pointer-events-none ring-1 sm:rounded-3xl" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
