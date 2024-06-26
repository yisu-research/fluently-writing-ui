<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useWindowSize } from '@vueuse/core'
import { NInfiniteScroll } from 'naive-ui'
import { useChatStoreWithOut } from '@/store'
import EditConversion from '@/layout/edit-conversion/index.vue'
import { SvgIcon } from '@/components/common'
import { router } from '@/router'
import { modelType } from '@/store/modules/chat/helper'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const { height } = useWindowSize()

const { isMobile, isDesktop } = useBasicLayout()

const minuendHeight = computed(() => {
  if (isMobile) {
    return 140
  }
  if (isDesktop) {
    return 120
  }
  return 100
})

const listHight = computed(() => `height: ${height.value - minuendHeight.value}px`)

const chatStore = useChatStoreWithOut()
const chats = computed(() => chatStore.conversations)
const total = computed(() => chatStore.total)
const loading = ref(false)
const noMore = computed(() => chats.value.length >= total.value)
function handleClickConversion(id: number, model: string) {
  router.push({ path: `/chat/${id}`, query: { model, type: 'history' } })
}

async function handleLoad() {
  if (loading.value || noMore.value) {
    return
  }
  loading.value = true
  await chatStore.fetchConversation()
  loading.value = false
}

function modelIconStr(model: modelType) {
  const iconMap = {
    [modelType.GPT3_5]: 'hugeicons:group-items',
    [modelType.GPT4o]: 'hugeicons:group-layers',
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
  <div class="h-screen bg-sky-200/10">
    <nav class="flex flex-col flex-1">
      <ul role="list" class="relative flex flex-col flex-1 -mx-2">
        <li
          class="flex items-center justify-center w-full px-4 mt-16 text-3xl font-bold transition-all duration-300 ease-in-out min-h-20 lg:mt-0 font-jinbu text-hight-class-gray"
        >
          <p class="relative flex items-center justify-center w-full max-w-3xl">
            <span>历史对话</span>
            <SvgIcon
              icon="hugeicons:cancel-01"
              class="absolute right-0 w-8 h-8 p-1 rounded-lg sm:mr-4 bg-hight-class-gray-1/10 hover:scale-95 text-hight-class-gray-1 hover:bg-hight-class-gray/10 top-1 shrink-0"
              @click="router.go(-1)"
            />
          </p>
        </li>
        <li>
          <NInfiniteScroll :style="listHight" :distance="2" @load="handleLoad">
            <ul role="list" class="max-w-3xl pb-6 mx-auto overflow-y-auto">
              <li v-for="item in chats" :key="item.name" class="px-4">
                <button
                  class="flex items-center justify-between w-full p-2 my-2 text-sm font-semibold bg-white border rounded-lg group border-slate-200/60 gap-x-3"
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
                  <p class="text-xs font-light group-hover:hidden text-hight-class-gray">
                    {{ formatTime(item.updatedAt) }}
                  </p>
                  <div class="items-center hidden group-hover:block">
                    <EditConversion :id="item.id" />
                  </div>
                </button>
              </li>
              <div v-if="loading" class="mt-4 text-center text">加载中...</div>
              <div v-if="noMore" class="mt-4 text-center text">没有更多了 🤪</div>
            </ul>
          </NInfiniteScroll>
        </li>
      </ul>
    </nav>
  </div>
</template>
