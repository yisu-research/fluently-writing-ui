<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, watch } from 'vue'
import { NButton, NUpload, NUploadTrigger } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useImageUpload } from './hooks/useImageUpload'
import { useChatView } from './hooks/useChatView'
import { Message } from './components'
import { useScroll } from '@/hooks/useScroll'
// import { useWindowSize } from '@vueuse/core'
import { SvgIcon } from '@/components/common'
import { useChatStoreWithOut } from '@/store/modules'

const { scrollRef, scrollToBottom } = useScroll()

const chatStore = useChatStoreWithOut()

// const { width, height } = useWindowSize()
const prompt = ref('')

// 获取页面路由参数
const route = useRoute()

const model = computed(() => route.query.model)

// 获取页面路由参数
const chatId = computed(() => route.params.id)

// modelMap 的类型定义
interface modelMapType {
  [key: string]: string
}
const modelMap: modelMapType = {
  'gpt-3.5-turbo': 'GPT3.5',
  'gpt-4-1106-preview': 'GPT4',
  'gpt-4-vision-preview': 'GPT4 Vision',
}

const modelText = computed(() => modelMap[model.value as string])

const x = useChatView()

onMounted(() => {
  // console.log(chatId.value)
  // console.log('chat mounted')
})

onUpdated(() => {
  // console.log(chatId.value)
  // console.log('chat updated')
})

const messages = computed(() => chatStore.getCurrentMessages)

// 监控 chatId 变化, 重新设置当前聊天窗口
watch(
  chatId,
  (id) => {
    if (!id) {
      chatStore.setCurrent(null)
      return
    }
    // 设置当前聊天窗口
    chatStore.setCurrent(Number(id))

    // 更新聊天记录
    updateChat()
  },
  {
    immediate: true,
  },
)

// 更新聊天记录
function updateChat() {
  // 当前聊天是否已经同步远端数据
  if (chatStore.getCurrentSync) {
    return
  }
  // 更新聊天记录
  chatStore.initConversationById(Number(chatId.value))
}

const {
  token,
  fileList,
  onFileListChange,
  customRequest,
  fileName,
  fileSize,
  imageSrc,
  imgLoadingPercent,
  loadingState,
  remoteImage,
  loadingColors,
  progressBarStyle,
} = useImageUpload()

const isFocus = ref(false)

const responding = ref(false)

function handleStop() {
  responding.value = false
}

function handleInputFocus() {
  isFocus.value = true
}
</script>

<template>
  <div class="relative w-full h-screen lg:ps-64">
    <div class="max-w-4xl min-h-[calc(100%-12rem)] p-3 mx-auto">
      <div>
        <Message
          v-for="(item, index) of messages"
          :key="index"
          :date-time="item.dateTime"
          :content="item.content"
          :role="item.role"
          :error="item.error"
          :loading="item.loading"
        />
        <div class="sticky bottom-0 left-0 flex justify-center">
          <NButton v-if="responding" type="warning" @click="handleStop">
            <template #icon>
              <SvgIcon icon="ri:stop-circle-line" />
            </template>
            终止
          </NButton>
        </div>
      </div>
    </div>

    <!-- 输入组件 -->
    <footer class="sticky bottom-0 z-10 max-w-4xl p-3 mx-auto sm:py-6">
      <!-- Input -->
      <div class="mb-2">
        <span
          class="inline-flex items-center gap-x-1.5 rounded-full bg-teal-600/10 px-3 py-1 text-sm font-medium text-teal-400/90 backdrop-blur-sm"
        >
          <svg class="h-1.5 w-1.5 fill-teal-400" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx="3" cy="3" r="3" />
          </svg>
          {{ modelText }}
        </span>
      </div>
      <div class="rounded-xl bg-slate-50/60 backdrop-blur-lg">
        <textarea
          ref="scrollRef"
          v-model="prompt"
          type="textarea"
          class="block w-full h-24 p-4 pb-2 text-sm overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-teal-600/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-teal-600/50 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 max-h-[12rem] bg-transparent border border-b-0 border-gray-200 rounded-b-none m shadow-in rounded-xl focus:ring-0 ring-transparent focus:border-teal-500 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
          placeholder="问点什么吧..."
          @keydown.enter="scrollToBottom"
          @focus="handleInputFocus"
          @blur="isFocus = false"
        ></textarea>

        <!-- Toolbar -->
        <div
          :class="[isFocus ? 'border-teal-500' : 'border-slate-200']"
          class="p-2 bg-transparent border border-t-0 rounded-b-xl h-fit bottom-px inset-x-px dark:bg-slate-800"
        >
          <div class="flex items-center justify-between">
            <!-- Button Group -->
            <div class="flex items-center">
              <!-- Start Upload image Button -->
              <NUpload
                v-model:file-list="fileList"
                abstract
                action="/api/attachments"
                :headers="{
                  Authorization: `Bearer ${token}`,
                }"
                :custom-request="customRequest"
                @update:file-list="onFileListChange"
              >
                <NUploadTrigger #="{ handleClick }" abstract>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-gray-500 rounded-lg hover:bg-teal-600/10 hover:scale-105 hover:text-teal-600 focus:z-10 dark:hover:text-teal-500"
                    @click="handleClick"
                  >
                    <SvgIcon icon="solar:gallery-add-linear" class="w-5 h-5" />
                  </button>
                </NUploadTrigger>
              </NUpload>
              <!-- End upload image Button -->
            </div>
            <!-- End Button Group -->

            <!-- Button Group -->
            <div class="flex items-center gap-x-1">
              <!-- Send Button -->
              <button
                type="button"
                class="inline-flex items-center justify-center flex-shrink-0 h-8 gap-2 px-2 text-teal-600 rounded-md shadow-sm bg-teal-600/20 hover:bg-teal-500/20"
              >
                <SvgIcon icon="solar:plain-3-outline" class="w-4 h-4" />
                <span>发送</span>
              </button>
              <!-- End Send Button -->
            </div>
            <!-- End Button Group -->
          </div>

          <!-- File Uploading Progress Form -->
          <div v-if="fileName !== ''" class="p-2 mt-2 border rounded-lg bg-slate-50">
            <!-- Uploading File Content -->
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-x-3">
                <span
                  class="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg dark:border-neutral-700"
                >
                  <img :src="imageSrc" alt="image" class="w-full h-full rounded-lg" />
                </span>
                <div>
                  <p class="text-sm font-medium text-gray-800 dark:text-white">{{ fileName }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">{{ fileSize }}</p>
                </div>
              </div>
              <div v-if="loadingState !== 'loading'" class="inline-flex items-center gap-x-2">
                <SvgIcon
                  v-if="loadingState === 'success'"
                  icon="solar:check-circle-bold"
                  class="flex-shrink-0 w-4 h-4 text-green-400"
                />
                <SvgIcon
                  v-else-if="loadingState === 'failed'"
                  icon="solar:close-circle-bold"
                  class="flex-shrink-0 w-4 h-4 text-red-400"
                />
                <button type="button" class="text-gray-500 hover:text-gray-800" @click="remoteImage">
                  <SvgIcon icon="solar:trash-bin-minimalistic-linear" class="flex-shrink-0 w-4 h-4" />
                </button>
              </div>
            </div>
            <!-- End Uploading File Content -->

            <!-- Progress Bar -->
            <div class="flex items-center gap-x-3 whitespace-nowrap">
              <div
                class="flex w-full h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700"
                role="progressbar"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  :class="[loadingColors[loadingState]]"
                  class="flex flex-col justify-center overflow-hidden text-xs text-center text-white transition duration-500 rounded-full whitespace-nowrap dark:bg-blue-500"
                  :style="progressBarStyle"
                ></div>
              </div>
              <div class="w-10 text-end">
                <span class="text-sm text-gray-800 dark:text-white">{{ (imgLoadingPercent * 100).toFixed(0) }}%</span>
              </div>
            </div>
            <!-- End Progress Bar -->
          </div>
          <!-- End File Uploading Progress Form -->
        </div>
        <!-- End Toolbar -->
      </div>
      <!-- End Input -->
    </footer>
    <!-- End Search -->
  </div>
  <!-- End Content -->
</template>

<style scoped></style>
