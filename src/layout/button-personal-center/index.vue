<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { computed } from 'vue'
import { Gender } from '../../store/modules/app/helper'
import { useAppStoreWithOut, useUserStoreWithOut } from '@/store/modules'
import { SvgIcon } from '@/components/common'
import manImage from '@/assets/images/man.png'
import womanImage from '@/assets/images/woman.png'

const appStore = useAppStoreWithOut()

const userStore = useUserStoreWithOut()

const avatar = computed(() => (appStore.getGender === Gender.Man ? manImage : womanImage))

const userName = computed(() => {
  return userStore.getUsername || '未登录'
})

const email = computed(() => {
  return userStore.getEmail || '未设置邮箱'
})
</script>

<template>
  <div class="w-full text-right">
    <Menu as="div" class="relative inline-block w-full text-left">
      <div class="flex">
        <MenuButton
          class="inline-flex items-center flex-1 w-full gap-2 p-4 text-sm font-medium text-teal-600 rounded-lg shadow-sm dark:shadow-slate-500 bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-600 hover:bg-slate-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          <img
            class="flex-shrink-0 inline-block w-12 h-12 rounded-full shadow-md dark:shadow-teal-700"
            :src="avatar"
            alt="Image Description"
          />
          <div class="flex flex-col items-start justify-start">
            <h3 class="font-semibold text-gray-800 text-md dark:text-white">{{ userName }}</h3>
            <p class="text-sm font-medium text-gray-400">{{ email }}</p>
          </div>
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
          class="absolute right-0 origin-top-right -translate-y-full border divide-y divide-gray-100 rounded-lg shadow-sm dark:divide-gray-600 dark:border-slate-800 bg-white/10 dark:bg-slate-200/10 backdrop-blur-md w-72 lg:w-64 -top-2 focus:outline-none"
        >
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }">
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                :class="[active ? 'bg-slate-600 text-teal-600' : 'text-gray-900 dark:text-white']"
              >
                <SvgIcon
                  icon="ph:user-circle"
                  :class="[active ? ' text-teal-600' : 'text-slate-500 dark:text-white']"
                  class="w-5 h-5 mr-2"
                  aria-hidden="true"
                />
                个人信息
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                :class="[active ? 'bg-slate-600 text-teal-600' : 'text-gray-900 dark:text-white']"
              >
                <SvgIcon
                  icon="ph:storefront"
                  :class="[active ? ' text-teal-600' : 'text-slate-500 dark:text-white']"
                  class="w-5 h-5 mr-2"
                  aria-hidden="true"
                />
                费用中心
              </button>
            </MenuItem>
          </div>
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }">
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                :class="[active ? 'bg-slate-600 text-teal-600' : 'text-gray-900 dark:text-white']"
              >
                <SvgIcon
                  icon="ph:stack"
                  :class="[active ? ' text-teal-600' : 'text-slate-500 dark:text-white']"
                  class="w-5 h-5 mr-2"
                  aria-hidden="true"
                />
                模板中心
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                :class="[active ? 'bg-slate-600 text-teal-600' : 'text-gray-900 dark:text-white']"
              >
                <SvgIcon
                  icon="ph:handshake"
                  :class="[active ? ' text-teal-600' : 'text-slate-500 dark:text-white']"
                  class="w-5 h-5 mr-2"
                  aria-hidden="true"
                />
                邀请新用户
              </button>
            </MenuItem>
          </div>

          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }">
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                :class="[active ? 'bg-slate-600 text-teal-600' : 'text-gray-900 dark:text-white']"
              >
                <SvgIcon
                  icon="ph:sign-out"
                  :class="[active ? ' text-teal-600' : 'text-slate-500 dark:text-white']"
                  class="w-5 h-5 mr-2"
                  aria-hidden="true"
                />
                退出
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
