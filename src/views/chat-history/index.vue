<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useChatStoreWithOut } from '@/store'
import EditConversion from '@/layout/edit-conversion/index.vue'
import { SvgIcon } from '@/components/common'
import { router } from '@/router'
import { modelType } from '@/store/modules/chat/helper'

const chatStore = useChatStoreWithOut()
const chats = computed(() => chatStore.conversations)

function handleClickConversion(id: number, model: string) {
  router.push({ path: `/chat/${id}`, query: { model } })
}

function modelIconStr(model: modelType) {
  const iconMap = {
    [modelType.GPT3_5]: 'solar:chat-line-linear',
    [modelType.GPT4o]: 'solar:eye-scan-linear',
  }

  return iconMap[model]
}

function formatTime(time: string) {
  // 2024-06-21T01:31:49.583+08:00
  // 显示一周内的星期几，超过一周显示日期年月日
  const now = dayjs()
  const target = dayjs(time)
  const diff = now.diff(target, 'day')
  if (diff < 7) {
    return target.format('dddd')
  }
  return target.format('YYYY-MM-DD')
}
</script>

<template>
  <div class="mt-16 sm:mt-0">
    <nav class="flex flex-col flex-1">
      <ul role="list" class="relative flex flex-col flex-1 -mx-2">
        <li class="w-full h-10 p-2 px-4 font-bold text-center text-hight-class-gray">历史对话</li>

        <li class="mt-10">
          <ul
            ref="desktopList"
            role="list"
            class="overflow-y-auto h-[calc(100vh)] divide-y divide-slate-100 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-teal-600/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-teal-600/20 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500"
          >
            <li v-for="item in chats" :key="item.name" class="px-4">
              <button
                class="flex items-center justify-between w-full p-2 text-sm font-semibold gap-x-3"
                :class="[
                  item.id === chatStore.getCurrent
                    ? 'bg-teal-600/10 dark:bg-gray-700 text-teal-600'
                    : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white dark:hover:text-teal-600',
                ]"
                @click.stop="handleClickConversion(item.id, item.model)"
              >
                <div class="flex items-center gap-2">
                  <SvgIcon :icon="modelIconStr(item.model)" class="w-5 h-5 shrink-0" />
                  <p>{{ item.name }}</p>
                </div>
                <div class="flex items-center">
                  <p class="text-xs font-light text-hight-class-gray">{{ formatTime(item.updatedAt) }}</p>
                  <EditConversion :id="item.id" />
                </div>
              </button>
            </li>
            <li v-show="loading" ref="loadBox" class="flex items-center justify-center w-full">
              <SvgIcon icon="svg-spinners:bars-scale-fade" class="w-5 h-5 text-teal-500 shrink-0" />
            </li>
            <!-- no more -->
            <li v-if="!chatStore.hasMoreConversation" class="flex items-center justify-center w-full gap-2 py-2">
              <SvgIcon icon="solar:donut-line-duotone" class="w-5 h-5 text-gray-300 shrink-0" />
              <p class="text-sm font-light text-gray-300 dark:text-slate-50">没有更多了!</p>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>
