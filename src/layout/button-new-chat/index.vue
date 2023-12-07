<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { SvgIcon } from '@/components/common'
</script>

<template>
  <div class="w-full text-right">
    <Menu as="div" class="relative inline-block w-full text-left">
      <div class="flex">
        <MenuButton
          class="inline-flex items-center flex-1 w-full gap-2 p-2 -mx-2 text-sm font-medium rounded-lg shadow-sm hover:text-teal-600 group text-slate-800 bg-slate-50 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          <SvgIcon
            icon="solar:sticker-smile-square-linear"
            class="w-6 h-6 text-gray-400 shrink-0 group-hover:text-teal-600"
          />
          <span>创建新对话</span>
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
          class="absolute right-0 w-64 mt-2 -mx-2 origin-top-right divide-y divide-gray-100 rounded-lg shadow-md bg-slate-400/10 backdrop-blur-md focus:outline-none"
        >
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }">
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                :class="[active ? 'bg-white/60 text-teal-600' : 'text-gray-900']"
              >
                <SvgIcon
                  icon="solar:chat-line-outline"
                  :class="[active ? ' text-teal-600' : 'text-slate-500']"
                  class="w-5 h-5 mr-2"
                  aria-hidden="true"
                />
                ChatGPT
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                :class="[active ? 'bg-white/60 text-teal-600' : 'text-gray-900']"
              >
                <SvgIcon
                  icon="solar:chat-round-call-outline"
                  :class="[active ? ' text-teal-600' : 'text-slate-500']"
                  class="w-5 h-5 mr-2"
                  aria-hidden="true"
                />
                GPT4
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                :class="[active ? 'bg-white/60 text-teal-600' : 'text-gray-900']"
              >
                <SvgIcon
                  icon="solar:gallery-outline"
                  :class="[active ? ' text-teal-600' : 'text-slate-500']"
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
