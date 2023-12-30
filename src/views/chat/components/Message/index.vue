<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { chatRole } from '../../../../store/modules/chat/helper'
import AvatarComponent from './avatar-chat.vue'
import TextComponent from './text-chat.vue'
import ImageComponent from './image-chat.vue'
import { useIconRender } from '@/hooks/useIconRender'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { copyToClip } from '@/utils/copy'
import { SvgIcon } from '@/components/common'

interface Props {
  dateTime?: string
  content?: any[]
  role?: chatRole
  error?: boolean
  loading?: boolean
}

interface Emit {
  (ev: 'regenerate'): void
  (ev: 'delete'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const { isMobile } = useBasicLayout()

const { iconRender } = useIconRender()

const message = useMessage()

const textRef = ref<HTMLElement>()

const asRawText = ref(false)

const messageRef = ref<HTMLElement>()

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

  console.log(value)

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
        </div>
      </div>
    </div>
  </div>
</template>
