<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, watch } from 'vue'
import { NUpload, NUploadTrigger, useMessage } from 'naive-ui'
import { useRoute } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { EventStreamContentType, fetchEventSource } from '@fortaine/fetch-event-source'
import { useDebounceFn } from '@vueuse/core'
import { useImageUpload } from './hooks/useImageUpload'
import { useChatView } from './hooks/useChatView'
import { Message } from './components'
import { useScroll } from './hooks/useScroll'
import { SvgIcon } from '@/components/common'
import { useChatStoreWithOut } from '@/store/modules'
import { type ContentType, type MessageType, chatRole, type modelType } from '@/store/modules/chat/helper'
import { getToken } from '@/store/modules/auth/helper'
import { prettyObject } from '@/utils/format'
import api from '@/api'

const chatStore = useChatStoreWithOut()

const prompt = ref('')

const message = useMessage()

// 获取页面路由参数
const route = useRoute()

const model = computed(() => route.query.model)

const pattern = computed(() => route.query.pattern)

// 获取页面路由参数
const chatId = computed(() => route.params.id as string)

const { scrollToBottom, scrollRef } = useScroll()

const loading = ref(false)

// const { scrollToBottom, scrollRef } = useScrollA()

// modelMap 的类型定义
interface modelMapType {
  [key: string]: string
}
const modelMap: modelMapType = {
  'gpt-3.5-turbo': 'GPT3.5',
  'gpt-4-1106-preview': 'GPT4',
  'gpt-4-vision-preview': 'GPT4 Vision',
}

const REQUEST_TIMEOUT_MS = 60000

const modelText = computed(() => modelMap[model.value as string])

const { addMessage, updateMessage } = useChatView()

onMounted(() => {
  // setTimeout(() => {
  //   scrollToBottom()
  // }, 500)
})

// 将 currentConversation 设置为可赋值的 computed
const currentConversation = computed({
  get() {
    return chatStore.getCurrentConversation?.startMessageId
  },
  set(val) {
    chatStore.updateStartMessageId(val!)
  },
})

onUpdated(() => {
  scrollToBottom()
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
  fileList,
  onFileListChange,
  customRequest,
  fileName,
  fileSize,
  imageSrc,
  imageUrl,
  imgLoadingPercent,
  loadingState,
  remoteImage,
  loadingColors,
  progressBarStyle,
  beforeUpload,
} = useImageUpload()

const isFocus = ref(false)

function handleInputFocus() {
  isFocus.value = true
}

const cleanLoading = ref(false)

const onClean = useDebounceFn(async () => {
  if (chatStore.getCleaned) {
    message.warning('上下文清理过了')
    return
  }
  // todo: 添加二次确认提示
  cleanLoading.value = true
  try {
    await api.cleanChatApi(chatStore.getCurrent!)
    chatStore.setCleaned(true)
    message.success('上下文清理成功')
    currentConversation.value = chatStore.getLastMessage?.id as number
  } catch (err) {
    console.error(err)
    message.error('上下文清理失败')
  } finally {
    cleanLoading.value = false
  }
}, 300)

const onSend = useDebounceFn(() => {
  if (prompt.value === '') {
    message.warning('请输入问题')
    return
  }
  // 新问题的 uuid, 用于标识问题。请求返回时，根据 uuid 更新对应的问题
  const uuidUser = uuidv4()

  const contents: ContentType[] = [
    {
      type: 'text',
      text: prompt.value,
    },
  ]

  // 如果是 vision 模式，则需要判断是否有图片
  if (model.value === 'gpt-4-vision-preview' && fileList.value.length > 0) {
    contents.push({
      type: 'image_url',
      image_url: {
        url: imageUrl.value,
      },
    })
  }

  addMessage(
    uuidUser,
    chatStore.getCurrent!,
    model.value as modelType,
    pattern.value as string,
    chatRole.user,
    contents,
  )
  scrollToBottom()

  // 重置输入框
  loading.value = true
  prompt.value = ''

  // 助手 uuid
  const uuidAssistant = uuidv4()
  const contentsAssistant: ContentType[] = [
    {
      type: 'text',
      text: '正在思考中...',
    },
  ]
  addMessage(
    uuidAssistant,
    chatStore.getCurrent!,
    model.value as modelType,
    pattern.value as string,
    chatRole.assistant,
    contentsAssistant,
  )
  scrollToBottom()

  const controller = new AbortController()

  try {
    const chatPath = encodeURI(`/api/messages`)

    // make a fetch request
    const requestTimeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    let responseText = ''
    let remainText = ''
    let finished = false
    let tokenInfo = ''

    // 为了让响应看起来更平滑，我们需要对响应进行动画处理
    function animateResponseText() {
      if ((finished || controller.signal.aborted) && remainText.length === 0) {
        responseText += remainText
        // 更新聊天记录
        const tokenInfoJson: any = JSON.parse(tokenInfo.slice('[TOKEN_COUNTER] - '.length))
        const lastMessage: MessageType = {
          id: uuidAssistant,
          conversationId: chatStore.getCurrent!,
          model: model.value as modelType,
          pattern: pattern.value as string,
          role: chatRole.assistant,
          content: tokenInfoJson.content,
          dateTime: new Date().toISOString(),
          error: false,
          loading: false,
          spendCount: tokenInfoJson.spend_count,
          questionTokens: tokenInfoJson.question_tokens,
          promptTokens: tokenInfoJson.prompt_tokens,
          completionTokens: tokenInfoJson.completion_tokens,
          totalTokens: tokenInfoJson.total_tokens,
          contextMessagesCount: tokenInfoJson.context_messages_count,
          credit: tokenInfoJson.credit,
        }
        chatStore.updateChatByConversationId(chatStore.getCurrent!, lastMessage)
        scrollToBottom()
        return
      }

      if (remainText.length > 0) {
        const fetchCount = Math.max(1, Math.round(remainText.length / 60))
        const fetchText = remainText.slice(0, fetchCount)
        responseText += fetchText
        remainText = remainText.slice(fetchCount)

        updateMessage(
          uuidAssistant,
          chatStore.getCurrent!,
          model.value as modelType,
          pattern.value as string,
          chatRole.assistant,
          [
            {
              type: 'text',
              text: responseText,
            },
          ],
        )
        scrollToBottom()
      }

      requestAnimationFrame(animateResponseText)
    }

    // start animaion
    animateResponseText()

    const finish = () => {
      loading.value = false

      if (!finished) {
        finished = true
      }
    }

    controller.signal.onabort = finish

    fetchEventSource(chatPath, {
      method: 'POST',
      body: JSON.stringify({
        conversation_id: chatStore.getCurrent,
        content: contents,
      }),
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        withCredentials: 'true',
        'Content-Type': 'application/json',
      },
      async onopen(res) {
        clearTimeout(requestTimeoutId)
        const contentType = res.headers.get('content-type')

        if (contentType?.startsWith('text/plain')) {
          responseText = await res.clone().text()
          return finish()
        }

        if (!res.ok || !res.headers.get('content-type')?.startsWith(EventStreamContentType) || res.status !== 200) {
          const responseTexts = [responseText]
          let extraInfo = await res.clone().text()
          try {
            const resJson = await res.clone().json()
            extraInfo = prettyObject(resJson)
          } catch {}
          if (res.status === 401) {
            responseTexts.push('没有权限')
          }

          if (extraInfo) {
            responseTexts.push(extraInfo)
          }

          responseText = responseTexts.join('\n\n')

          return finish()
        }
      },
      onmessage: (msg: any) => {
        if (msg.data === '[DONE]' || finished) {
          chatStore.setCleaned(false)
          return finish()
        }

        if (msg.data.includes('[ERROR]')) {
          const updateContents: ContentType[] = [
            {
              type: 'text',
              text: msg.data.slice('[ERROR]'.length),
            },
          ]

          updateMessage(
            uuidAssistant,
            chatStore.getCurrent!,
            model.value as modelType,
            pattern.value as string,
            chatRole.assistant,
            updateContents,
          )
          scrollToBottom()
          return finish()
        }

        if (msg.data.includes('[TOKEN_COUNTER]')) {
          tokenInfo = msg.data
          return
        }

        const text = msg.data

        if (text === 'null') {
          return finish()
        }

        try {
          remainText += text
        } catch {
          console.error('[Request] parse error', text)
        }
      },
      onclose() {
        finish()
      },
      onerror: (err: any) => {
        console.error(err)
        throw err
      },
      // 这个参数是为了让浏览器在后台运行时，不要关闭连接
      openWhenHidden: true,
    })
  } catch (err) {
    console.error(err)
  }
}, 500)

function newline() {
  prompt.value += '\n'
}
</script>

<template>
  <div
    id="scrollRef"
    ref="scrollRef"
    class="relative w-full h-screen overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-teal-500/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-teal-600/80 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500"
  >
    <div class="max-w-4xl min-h-[calc(100%)] p-4 mx-auto w-full flex flex-col justify-between">
      <div class="pt-16">
        <Message
          v-for="(item, index) of messages"
          :key="index"
          :date-time="item.dateTime"
          :content="item.content"
          :role="item.role"
          :error="item.error"
          :loading="item.loading"
          :is-start="item.id === currentConversation"
          :question-token="item.questionTokens"
          :prompt-token="item.promptTokens"
          :completion-token="item.completionTokens"
          :total-token="item.totalTokens"
          :context-message-count="item.contextMessagesCount"
          :credit="item.credit"
        />
      </div>

      <!-- 输入组件 -->
      <footer class="sticky bottom-0 z-10 w-full max-w-4xl mx-auto -mb-4 sm:py-6">
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
            v-model="prompt"
            type="textarea"
            class="block w-full h-24 p-4 pb-2 text-sm overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-teal-600/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-teal-600/50 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 max-h-[12rem] bg-transparent border border-b-0 border-gray-200 rounded-b-none m shadow-in rounded-xl focus:ring-0 ring-transparent focus:border-teal-500 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
            placeholder="问点什么吧..."
            @keydown.enter.prevent.exact="onSend"
            @keydown.shift.enter="newline"
            @focus="handleInputFocus"
            @blur="isFocus = false"
            @input="onInput"
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
                    Authorization: `Bearer ${getToken()}`,
                  }"
                  :custom-request="customRequest"
                  @update:file-list="onFileListChange"
                  @before-upload="beforeUpload"
                >
                  <NUploadTrigger #="{ handleClick }" abstract>
                    <button
                      v-if="model === 'gpt-4-vision-preview'"
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
              <div class="flex items-center gap-x-4">
                <!-- Clear History Start -->
                <button
                  type="button"
                  :class="[
                    cleanLoading
                      ? 'text-teal-500/30 bg-teal-500/5'
                      : 'text-teal-500 border-teal-500/20 border hover:bg-teal-400/5',
                  ]"
                  class="inline-flex items-center justify-center flex-shrink-0 h-8 gap-2 px-2 rounded-md shadow-sm"
                  @click="cleanLoading ? '' : onClean()"
                >
                  <SvgIcon icon="carbon:clean" class="w-4 h-4" />
                  <span>清除历史</span>
                </button>
                <!-- End Clear History -->
                <!-- Send Button -->
                <button
                  type="button"
                  :class="[
                    loading || prompt === ''
                      ? 'text-teal-600/40 bg-teal-500/10'
                      : 'text-teal-600 bg-teal-600/20 hover:bg-teal-500/20',
                  ]"
                  class="inline-flex items-center justify-center flex-shrink-0 h-8 gap-2 px-2 rounded-md shadow-sm"
                  @click="loading || prompt === '' ? '' : onSend()"
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
  </div>

  <!-- End Content -->
</template>

<style scoped></style>
