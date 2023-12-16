<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { SvgIcon } from '@/components/common'
</script>

<template>
  <div class="w-full text-right">
    <Menu v-slot="{ open }" as="div" class="relative inline-block w-full text-left">
      <div class="flex">
        <MenuButton
          class="inline-flex items-center justify-between flex-1 w-full p-2 -mx-2 font-bold text-teal-50 rounded-lg shadow-sm shadow-teal-900/30 bg-gradient-to-r from-teal-600 from-10% to-teal-500/60 to-90% text-[1rem] hover:text-white hover:shadow-md dark:hover:text-teal-600 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          <div class="flex items-center gap-2">
            <SvgIcon icon="solar:sticker-smile-square-linear" class="w-6 h-6 shrink-0" />
            <span>创建新对话</span>
          </div>
          <SvgIcon
            icon="solar:alt-arrow-down-linear"
            :class="open ? 'transform rotate-180' : ''"
            class="w-6 h-6 shrink-0"
          />
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="absolute right-0 z-10 mt-2 -mx-2 origin-top-right border divide-y divide-gray-100 rounded-lg shadow-lg bg-teal-100/20 border-teal-700/10 shadow-teal-800/10 dark:shadow-slate-900/30 backdrop-blur-lg lg:w-64 w-72 dark:bg-white/20 focus:outline-none"
        >
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }">
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                :class="[active ? 'bg-white/60 text-teal-600' : 'text-gray-900 dark:text-slate-50']"
              >
                <SvgIcon
                  icon="solar:chat-line-outline"
                  :class="[active ? 'bg-white/60 text-teal-600' : 'text-slate-500 dark:text-slate-50']"
                  class="w-5 h-5 mr-2"
                  aria-hidden="true"
                />
                ChatGPT
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                :class="[active ? 'bg-white/60 text-teal-600' : 'text-gray-900 dark:text-slate-50']"
              >
                <SvgIcon
                  icon="solar:chat-round-call-outline"
                  :class="[active ? ' text-teal-600' : 'text-slate-500 dark:text-slate-50']"
                  class="w-5 h-5 mr-2"
                  aria-hidden="true"
                />
                GPT4
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                :class="[active ? 'bg-white/60 text-teal-600' : 'text-gray-900 dark:text-slate-50']"
              >
                <SvgIcon
                  icon="solar:eye-scan-linear"
                  :class="[active ? ' text-teal-600' : 'text-slate-500 dark:text-slate-50']"
                  class="w-5 h-5 mr-2"
                  aria-hidden="true"
                />
                GPT4-Vision
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
