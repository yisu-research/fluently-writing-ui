<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useInfiniteScroll, useWindowSize } from '@vueuse/core'
import { modelType } from '../../store/modules/chat/helper'
import ButtonPersonalCenter from '@/layout/button-personal-center/index.vue'
import ButtonNewChat from '@/layout/button-new-chat/index.vue'
import { IconLogo } from '@/components/icons'
import { SvgIcon } from '@/components/common'
import { useChatStoreWithOut } from '@/store'
import EditConversion from '@/layout/edit-conversion/index.vue'
import { router } from '@/router'
import christmasImg from '@/assets/svg/christmas.svg'

const props = defineProps({
  sidebarOpen: Boolean,
})

const emit = defineEmits(['update:sidebarOpen'])

const { height } = useWindowSize()

const chatStore = useChatStoreWithOut()

// 移动端侧边栏对话列表高度
const heightClass = computed(() => {
  if (height.value > 800) {
    return 'h-[36rem]'
  } else if (height.value > 720) {
    return 'h-[30rem]'
  } else if (height.value > 640) {
    return 'h-[24rem]'
  } else if (height.value > 560) {
    return 'h-[20rem]'
  } else {
    return 'h-[18rem]'
  }
})

const mobileList = ref<HTMLElement | null>(null)

const desktopList = ref<HTMLElement | null>(null)

const { sidebarOpen } = toRefs(props)

const navigation = computed(() => chatStore.conversations)

function toggleSidebar() {
  emit('update:sidebarOpen', false)
}

const loading = ref(false)

onMounted(() => {
  initData()
  setSideInfiniteScroll()
})

const conversationLoading = async () => {
  if (loading.value) {
    return
  }
  // load more
  loading.value = true
  await chatStore.fetchConversation()
  loading.value = false
}

function setSideInfiniteScroll() {
  useInfiniteScroll(desktopList, conversationLoading, { distance: 10 })
  useInfiniteScroll(mobileList, conversationLoading, { distance: 10 })
}

function modelIconStr(model: modelType) {
  const iconMap = {
    [modelType.GPT3_5]: 'solar:chat-line-linear',
    [modelType.GPT4]: 'solar:chat-round-line-linear',
    [modelType.GPT4_VISION]: 'solar:eye-scan-linear',
  }

  return iconMap[model]
}

function handleClickConversion(id: number, model: string, pattern: string) {
  router.push({ path: `/chat/${id}`, query: { model, pattern } })
}

async function initData() {
  // 对话列表
  await chatStore.fetchConversation()
}
</script>

<template>
  <TransitionRoot as="template" :show="sidebarOpen">
    <Dialog as="div" class="relative z-50 lg:hidden" @close="toggleSidebar">
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-900/80" />
      </TransitionChild>

      <div class="fixed inset-0 flex">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <DialogPanel class="relative flex flex-1 w-full max-w-xs mr-16">
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="absolute top-0 flex justify-center w-16 pt-5 left-full">
                <button type="button" class="-m-2.5 p-2.5" @click="toggleSidebar">
                  <span class="sr-only">Close sidebar</span>
                  <XMarkIcon class="w-6 h-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </TransitionChild>
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div
              class="flex flex-col px-6 pb-4 bg-white border-r border-gray-200 dark:border-gray-600 dark:bg-gray-900 grow gap-y-2"
            >
              <div class="flex items-center h-16 gap-2 -mx-1 shrink-0">
                <IconLogo class="w-auto h-8 text-teal-600 sm:h-8 sm:w-8" />
                <p
                  class="text-lg font-black text-transparent sm:text-xl bg-gradient-to-r from-teal-600 to-emerald-400 bg-clip-text"
                >
                  一粟创作助手
                </p>
              </div>
              <nav class="flex flex-col flex-1">
                <ButtonNewChat />

                <ul class="flex flex-col flex-1 mt-4 -mx-2">
                  <li>
                    <ul ref="mobileList" :class="heightClass" role="list" class="space-y-1 overflow-y-scroll">
                      <li v-for="item in navigation" :key="item.name">
                        <a
                          href=""
                          class="flex items-center justify-between p-2 text-sm font-semibold leading-6 rounded-md group gap-x-3"
                          :class="[
                            item.id === chatStore.getCurrent
                              ? 'bg-slate-300/30 dark:bg-gray-700 text-teal-600'
                              : 'text-gray-700  dark:text-white',
                          ]"
                        >
                          <div class="flex items-center gap-2">
                            <SvgIcon :icon="modelIconStr(item.model)" class="w-5 h-5 shrink-0" />
                            <p>{{ item.name }}</p>
                          </div>
                          <EditConversion :id="item.id" />
                        </a>
                      </li>
                      <li v-show="loading" ref="loadBox" class="flex items-center justify-center w-full">
                        <SvgIcon icon="svg-spinners:bars-scale-fade" class="w-5 h-5 text-teal-500 shrink-0" />
                      </li>
                      <!-- no more -->
                      <li
                        v-if="!chatStore.hasMoreConversation"
                        class="flex items-center justify-center w-full gap-2 py-2"
                      >
                        <SvgIcon icon="solar:donut-line-duotone" class="w-4 h-4 text-gray-300 shrink-0" />
                        <p class="text-sm font-medium text-gray-300 dark:text-slate-50">没有更多了!</p>
                      </li>
                    </ul>
                  </li>
                  <li class="flex items-center mt-auto">
                    <ButtonPersonalCenter />
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Static sidebar for desktop -->
  <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    <div
      class="flex items-center justify-between h-16 gap-2 px-4 border-r bg-teal-400/5 shrink-0 backdrop-filter backdrop-blur-2x"
    >
      <div class="flex items-center">
        <IconLogo class="w-auto h-8 text-teal-600 sm:h-8 sm:w-8" />
        <p
          class="text-lg font-black text-transparent sm:text-xl bg-gradient-to-r from-teal-600 to-emerald-400 bg-clip-text"
        >
          一粟创作助手
        </p>
      </div>
      <img :src="christmasImg" alt="christmas" class="w-auto h-16 -mr-4" />
    </div>

    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div class="flex flex-col px-6 pb-4 bg-white border-r border-gray-200 grow gap-y-2 dark:bg-slate-900/90">
      <nav class="flex flex-col flex-1">
        <ButtonNewChat class="my-4" />

        <ul role="list" class="relative flex flex-col flex-1 -mx-2 border rounded-lg">
          <li class="absolute top-0 w-full h-10 p-2 font-medium text-teal-900 border-b bg-slate-100">会话列表</li>

          <li class="mt-10">
            <ul
              ref="desktopList"
              role="list"
              class="overflow-y-auto h-[calc(100vh-17rem)] divide-y divide-slate-100 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-teal-600/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-teal-600/20 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500"
            >
              <li v-for="item in navigation" :key="item.name" class="">
                <button
                  class="flex items-center justify-between w-full p-2 text-sm font-semibold gap-x-3"
                  :class="[
                    item.id === chatStore.getCurrent
                      ? 'bg-teal-600/10 dark:bg-gray-700 text-teal-600'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white dark:hover:text-teal-600',
                  ]"
                  @click="handleClickConversion(item.id, item.model, item.pattern)"
                >
                  <div class="flex items-center gap-2">
                    <SvgIcon :icon="modelIconStr(item.model)" class="w-5 h-5 shrink-0" />
                    <p>{{ item.name }}</p>
                  </div>
                  <EditConversion :id="item.id" />
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
          <li class="flex items-center mt-auto">
            <ButtonPersonalCenter />
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
