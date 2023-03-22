<script setup lang="ts">
import { computed, h } from 'vue'
import { NDropdown } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import { useAppStore } from '@/store'
import type { Theme } from '@/store/modules/app/helper'

const appStore = useAppStore()

const renderIcon = (icon: string) => {
  return () => {
    return h(
      SvgIcon,
      { icon },
      {
        default: () => h(icon),
      },
    )
  }
}

const themeOptions: any[] = [
  {
    label: 'Auto',
    key: 'auto',
    icon: renderIcon('uil:swatchbook'),
    iconText: 'uil:swatchbook',
  },
  {
    label: 'Light',
    key: 'light',
    icon: renderIcon('uil:sunset'),
    iconText: 'uil:sunset',
  },
  {
    label: 'Dark',
    key: 'dark',
    icon: renderIcon('uil:moonset'),
    iconText: 'uil:moonset',
  },
]

const handleSelectTheme = (key: Theme) => {
  appStore.setTheme(key)
}

const themeIndex = computed(() => {
  return themeOptions.findIndex((item) => item.key === appStore.theme)
})
</script>

<template>
  <div class="bg-white navbar backdrop-blur backdrop-filter firefox:bg-opacity-90">
    <div class="flex-none lg:hidden">
      <div class="px-2 dropdown">
        <label tabindex="0" class="">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </label>
        <ul tabindex="0" class="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
          <li><a>主页</a></li>
          <li><a>像素画板</a></li>
        </ul>
      </div>
    </div>
    <div class="flex-1">
      <a class="px-2 text-xl font-bold text-teal-500 normal-case">Pixel Art</a>
    </div>
    <div class="flex-none hidden h-6 lg:flex lg:border-r lg:border-slate-900/15 lg:mr-2 lg:pr-2">
      <ul class="flex justify-start px-1">
        <li class="mr-8">主页</li>
        <li class="mr-4">像素画板</li>
      </ul>
    </div>
    <div class="flex-none text-xl">
      <NDropdown
        placement="bottom-start"
        trigger="click"
        size="large"
        :options="themeOptions"
        @select="handleSelectTheme"
      >
        <NButton quaternary class="px-4"><SvgIcon :icon="themeOptions[themeIndex].iconText" /></NButton>
      </NDropdown>
      <div class="px-4 dropdown dropdown-end">
        <label tabindex="0" class="text-xl"><SvgIcon icon="uil:english-to-chinese" /></label>
        <ul tabindex="0" class="p-2 mt-4 rounded-lg shadow menu dropdown-content bg-base-100 w-28">
          <li><a>中文</a></li>
          <li><a>English</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
