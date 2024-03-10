<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import { NPopover, useMessage } from 'naive-ui'
import dayjs from 'dayjs'
import { chatRole } from '../../../../store/modules/chat/helper'
import AvatarComponent from './avatar-chat.vue'
import TextComponent from './text-chat.vue'
import ImageComponent from './image-chat.vue'
import { copyToClip } from '@/utils/copy'
import { SvgIcon } from '@/components/common'

interface Props {
  dateTime?: string
  content?: any[]
  role?: chatRole
  error?: boolean
  loading?: boolean
  isStart: boolean
  questionToken: number
  promptToken: number
  completionToken: number
  contextMessageCount: number
  credit: string
}

interface Emit {
  (ev: 'regenerate'): void
  (ev: 'delete'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const { questionToken, promptToken, completionToken, contextMessageCount, credit } = toRefs(props)

const message = useMessage()

const textRef = ref<HTMLElement>()

const asRawText = ref(false)

const messageRef = ref<HTMLElement>()

const charges = computed(() => [
  {
    title: '本轮提示长度',
    value: questionToken.value,
    unit: 'tokens',
    icon: 'solar:pen-new-square-linear',
  },
  {
    title: '提问总长度（包含历史）',
    value: promptToken.value,
    unit: 'tokens',
    icon: 'ph:chat-circle',
  },
  {
    title: '本轮回答长度',
    value: completionToken.value,
    unit: 'tokens',
    icon: 'ph:swap',
  },
  {
    title: '包含历史对话',
    value: contextMessageCount.value,
    unit: '轮',
    icon: 'solar:inbox-archive-linear',
  },
  {
    title: '本次消耗',
    value: credit.value,
    unit: '积分',
    icon: 'solar:wallet-2-linear',
  },
])

const options = computed(() => {
  const common = [
    {
      label: '复制',
      key: 'copyText',
      icon: 'solar:copy-linear',
    },
  ]

  if (props.role === chatRole.assistant) {
    common.unshift({
      label: asRawText.value ? '预览' : '显示原文',
      key: 'toggleRenderType',
      icon: asRawText.value ? 'ic:outline-code-off' : 'ic:outline-code',
    })
  }

  return common
})

const inversion = computed(() => props.role === chatRole.user)

const text = computed(() => {
  const value = props.content ?? []

  let str = ''

  for (const item of value) {
    if (item.type === 'text') {
      str += item.text
    }
  }

  return str
})

const images = computed(() => {
  const value = props.content ?? []

  const images: string[] = []

  for (const item of value) {
    if (item.type === 'image_url') {
      images.push(item.image_url)
    }
  }

  return images
})

function handleSelect(key: 'copyText' | 'delete' | 'toggleRenderType') {
  switch (key) {
    case 'copyText':
      handleCopy()
      return
    case 'toggleRenderType':
      asRawText.value = !asRawText.value
      return
    case 'delete':
      emit('delete')
  }
}

async function handleCopy() {
  try {
    await copyToClip(text.value || '')
    message.success('复制成功')
  } catch {
    message.error('复制失败')
  }
}

// 日期时间
const dateTime = computed(() => {
  const value = props.dateTime ?? ''

  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
})
</script>

<template>
  <div ref="messageRef" class="flex w-full mb-6 overflow-hidden" :class="[{ 'flex-row-reverse': inversion }]">
    <div
      class="flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8"
      :class="[inversion ? 'ml-2' : 'mr-2']"
    >
      <AvatarComponent :image="inversion" />
    </div>
    <div class="flex-1 overflow-hidden text-sm" :class="[inversion ? 'items-end' : 'items-start']">
      <p class="text-xs text-[#b4bbc4]" :class="[inversion ? 'text-right' : 'text-left']">
        {{ dateTime }}
      </p>
      <div
        class="flex flex-col gap-2 mt-2"
        :class="[inversion ? 'flex-row-reverse items-end' : 'flex-row items-start']"
      >
        <template v-if="inversion">
          <div class="flex flex-col items-end flex-1 w-full gap-2">
            <TextComponent
              ref="textRef"
              :inversion="inversion"
              :error="error"
              :text="text"
              :loading="loading"
              :as-raw-text="asRawText"
            />
            <ImageComponent v-if="images.length" :images="images" />
          </div>
        </template>

        <template v-else>
          <div class="w-full">
            <TextComponent
              ref="textRef"
              :inversion="inversion"
              :error="error"
              :text="text"
              :loading="loading"
              :as-raw-text="asRawText"
            />
          </div>
        </template>

        <div class="flex justify-start gap-2">
          <template v-for="item of options" :key="item.key">
            <button
              class="flex items-center gap-1 px-2 mb-2 text-xs transition border rounded-full shadow-sm text-slate-400 hover:text-neutral-800 dark:hover:text-neutral-300"
              @click="handleSelect(item.key as any)"
            >
              <SvgIcon :icon="item.icon" />
              <span>{{ item.label }}</span>
            </button>
          </template>
          <div v-if="!inversion">
            <!-- Popover -->
            <NPopover trigger="click">
              <template #trigger>
                <button
                  class="flex items-center gap-1 px-2 mb-2 text-xs transition border rounded-full shadow-sm text-slate-400 hover:text-neutral-800 dark:hover:text-neutral-300"
                >
                  <SvgIcon icon="ph:lightning-a" class="w-4 h-4 text-slate-400" />
                  <span>本次计费</span>
                </button>
              </template>
              <div>
                <template v-for="charge of charges" :key="charge.value">
                  <div class="flex items-center gap-2 py-1 text-slate-500">
                    <div class="w-4 h-4">
                      <SvgIcon :icon="charge.icon" class="w-full h-full text-slate-500" />
                    </div>
                    <span
                      >{{ charge.title }}: <span class="font-semibold text-slate-600">{{ charge.value }}</span>
                      {{ charge.unit }}</span
                    >
                  </div>
                </template>
              </div>
            </NPopover>

            <!-- End Popover -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isStart" class="">
    <div class="relative">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-gray-300" />
      </div>
      <div class="relative flex justify-center">
        <span class="px-2 text-sm text-gray-500 bg-white">开始新的语境</span>
      </div>
    </div>
  </div>
</template>
