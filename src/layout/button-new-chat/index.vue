<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import day from 'dayjs'
import { router } from '../../router/index'
import { SvgIcon } from '@/components/common'
import api from '@/api'
import type { conversationType } from '@/store/modules/chat/helper'
import { useChatStoreWithOut } from '@/store'

const chatStore = useChatStoreWithOut()

const options = [
  {
    name: 'GPT3.5',
    key: 'gpt-3.5-turbo',
    icon: 'solar:chat-line-outline',
    tips: '单次 ChatGPT4 对话将消耗 1 积分',
  },
  {
    name: 'GPT4o',
    key: 'gpt-4o',
    icon: 'solar:eye-scan-linear',
    tips: '单次 ChatGPT4 Vision 对话将消耗 5 积分',
  },
  // {
  //   name: 'GPT4',
  //   key: 'gpt-4-1106-preview',
  //   icon: 'solar:chat-round-call-outline',
  //   tips: '单次 ChatGPT4 对话将消耗 10 积分',
  // },
  // {
  //   name: 'GPT4 Vision',
  //   key: 'gpt-4-vision-preview',
  //   icon: 'solar:eye-scan-linear',
  //   tips: '单次 ChatGPT4 Vision 对话将消耗 15 积分',
  // },
]

// 创建对话
// 1. 发送创建请求
// 2. 在对话列表最前面插入新的对话模型
// 3. 导航到页面
async function createChat(model: string) {
  try {
    const uuid = day(Date.now()).format('YYMMDD-HH:mm:ss')
    const res: any = await api.createChatApi({ name: uuid, model })
    const conversation: conversationType = {
      id: res.id,
      name: res.name,
      model: res.model,
      // pattern: res.pattern,
      spendCount: res.spend_count,
      state: res.state,
      userId: res.user_id,
      startMessageId: res.start_message_id,
    }

    chatStore.insertConversation(conversation)

    // 导航到新创建的对话
    router.push({ path: `/chat/${res.id}`, query: { id: res.id, model: res.model } })
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="w-full text-right">
    <Menu v-slot="{ open }" as="div" class="relative inline-block w-full text-left">
      <div class="flex">
        <MenuButton
          class="inline-flex items-center justify-between flex-1 w-full p-2 font-bold text-teal-50 rounded-lg shadow-sm shadow-teal-900/30 bg-gradient-to-r from-teal-600 from-10% to-teal-500/60 to-90% text-[1rem] hover:text-white hover:shadow-md dark:hover:text-teal-600 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          <div class="flex items-center gap-2">
            <SvgIcon icon="solar:sticker-smile-square-linear" class="w-6 h-6 shrink-0" />
            <span>开始创作</span>
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
          class="absolute right-0 z-10 w-full mt-1 origin-top-right border divide-y divide-gray-100 rounded-lg shadow-lg bg-teal-50/20 border-teal-600/20 shadow-teal-800/10 dark:shadow-slate-900/30 backdrop-blur-lg dark:bg-white/20 focus:outline-none"
        >
          <div class="px-1 py-1">
            <template v-for="item of options" :key="item.key">
              <MenuItem v-slot="{ active }">
                <button
                  class="flex items-center justify-between w-full px-2 py-2 text-sm rounded-md group"
                  :class="[active ? 'bg-teal-600/10 text-teal-600' : 'text-gray-900 dark:text-slate-50']"
                  @click="createChat(item.key)"
                >
                  <span class="flex items-center font-bold">
                    <SvgIcon
                      :icon="item.icon"
                      :class="[active ? ' text-teal-600' : 'text-slate-600 dark:text-slate-50']"
                      class="w-5 h-5 mr-2"
                      aria-hidden="true"
                    />
                    <span>{{ item.name }}</span>
                  </span>

                  <!-- <NTooltip trigger="hover" :show-arrow="false">
                    <template #trigger>
                      <SvgIcon
                        icon="solar:info-circle-line-duotone"
                        class="w-5 h-5 text-slate-400 dark:text-slate-300"
                        aria-hidden="true"
                      />
                    </template>
                    {{ item.tips }}
                  </NTooltip> -->
                </button>
              </MenuItem>
            </template>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
