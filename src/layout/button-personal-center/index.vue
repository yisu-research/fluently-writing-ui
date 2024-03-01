<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { computed } from 'vue'
import { Gender } from '../../store/modules/user/helper'
import { useUserStoreWithOut } from '@/store/modules'
import { SvgIcon } from '@/components/common'
import manImage from '@/assets/images/man.png'
import womanImage from '@/assets/images/woman.png'
import { router } from '@/router'

const userStore = useUserStoreWithOut()

const avatar = computed(() => (userStore.getGender === Gender.Man ? manImage : womanImage))

const userName = computed(() => {
  return userStore.getUsername || '未登录'
})

const email = computed(() => {
  return userStore.getEmail || '未设置邮箱'
})

const options = [
  {
    name: '个人中心',
    key: 'grzx',
    icon: 'ph:user-circle',
    path: '/user-center',
  },
  {
    name: '消费中心',
    key: 'xfzx',
    icon: 'ph:storefront',
    path: '/cost-center',
  },
  {
    name: '模版中心',
    key: 'mbzx',
    icon: 'ph:stack',
    path: '/example-center',
  },
  {
    name: '邀请朋友',
    key: 'yqpy',
    icon: 'ph:handshake',
    path: '/invite-user',
  },
]

function handleClickOption(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="w-full text-right">
    <Menu as="div" class="relative inline-block w-full text-left">
      <div class="flex">
        <MenuButton
          class="inline-flex items-center justify-between flex-1 w-full p-4 text-sm font-medium text-teal-600 rounded-lg shadow-sm dark:shadow-slate-500 bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-600 hover:bg-slate-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          <div class="inline-flex items-center gap-2">
            <img
              class="flex-shrink-0 inline-block w-12 h-12 rounded-full shadow-md dark:shadow-teal-700"
              :src="avatar"
              alt="Image Description"
            />
            <div class="flex flex-col items-start justify-start">
              <h3 class="font-semibold text-gray-800 text-md dark:text-white">{{ userName }}</h3>
              <p class="text-sm font-medium text-gray-400">{{ email }}</p>
            </div>
          </div>
          <SvgIcon
            icon="solar:moon-fog-outline"
            class="w-6 h-6 text-slate-500 dark:text-white hover:text-teal-600/80"
            aria-hidden="true"
          />
          <!-- <SvgIcon
            icon="solar:sun-fog-linear"
            class="w-6 h-6 mr-2 text-slate-500 dark:text-white"
            aria-hidden="true"
          /> -->
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
          class="absolute right-0 z-10 w-full origin-top-right -translate-y-full border divide-y rounded-lg shadow-md divide-slate-200 shadow-teal-900/10 dark:divide-gray-600 dark:border-slate-800 bg-teal-100/10 dark:bg-slate-200/10 backdrop-blur-md -top-2 focus:outline-none"
        >
          <div class="px-1 py-1">
            <template v-for="item of options" :key="item.key">
              <MenuItem v-slot="{ active }">
                <button
                  class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                  :class="[active ? 'bg-teal-600/10 text-teal-600' : 'text-gray-900 dark:text-white']"
                  @click="handleClickOption(item.path)"
                >
                  <SvgIcon
                    :icon="item.icon"
                    :class="[active ? ' text-teal-600' : 'text-slate-500 dark:text-white']"
                    class="w-5 h-5 mr-2"
                    aria-hidden="true"
                  />
                  {{ item.name }}
                </button>
              </MenuItem>
            </template>
          </div>
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }">
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                :class="[active ? 'bg-teal-600/10 text-teal-600' : 'text-gray-900 dark:text-white']"
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
