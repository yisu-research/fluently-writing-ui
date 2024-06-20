<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// import { useUpgradeLog } from './hooks/useUpgradeLog'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { NLayout, NLayoutContent, NLayoutSider } from 'naive-ui'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import day from 'dayjs'
import LayoutMain from '@/layout/layout-main/index.vue'
import LayoutHeader from '@/layout/layout-header/index.vue'

import { modelType } from '@/store/modules/chat/helper'
import { useAppStoreWithOut, useChatStoreWithOut, useUserStoreWithOut } from '@/store'
import { Gender } from '@/store/modules/user/helper'
import manImage from '@/assets/images/man.png'
import womanImage from '@/assets/images/woman.png'
import { IconLogo } from '@/components/icons'
import logoSvg from '@/assets/svg/logo.svg'
import { router } from '@/router'
import { SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import api from '@/api'
import type { conversationType } from '@/store/modules/chat/helper'

// const sidebarOpen = ref(false)

const userStore = useUserStoreWithOut()

const chatStore = useChatStoreWithOut()

const { isMobile } = useBasicLayout()

// const { markAsRead, upgradeLogNotification } = useUpgradeLog()

const appStore = useAppStoreWithOut()

const avatar = computed(() => (userStore.getGender === Gender.Man ? manImage : womanImage))

const userName = computed(() => {
  return userStore.getUsername || '未登录'
})

const email = computed(() => {
  return userStore.getEmail || '未设置邮箱'
})

const markAsRead = computed(() => appStore.getGpt4oNotice)

const isOpen = ref(false)

async function initData() {
  // 用户数据
  await userStore.fetchProfile()

  // 用户性别
  const gender = userStore.getGender

  if (!userStore.getAvatar) {
    // 设置用户头像
    if (gender === Gender.Man) {
      userStore.setAvatar(manImage)
    } else {
      userStore.setAvatar(womanImage)
    }
  }

  // 对话列表
  await chatStore.fetchConversation()
}

// function closeModal() {
//   isOpen.value = false
// }

// function read() {
//   appStore.setGpt4oNotice(false)
//   isOpen.value = false
// }

// const navigation = ref([
//   { name: '个人中心', path: '/user-center', icon: 'ph:user-circle', current: true, type: 'path' },
//   { name: '消费中心', path: '/cost-center', icon: 'ph:storefront', current: false, type: 'path' },
//   { name: '历史对话', path: '/history', icon: 'ph:clock-clockwise-fill', current: false, type: 'history' },
// ])

onMounted(() => {
  initData()
  if (markAsRead.value) {
    // upgradeLogNotification()
    isOpen.value = true
  }
})

function goHome() {
  router.push('/')
}

const sidebarOpen = ref(false)

// const collapsed = ref(false)

const rightSidebarOpen = ref(false)

function handleClickOption(item: any) {
  if (item.type === 'path') {
    router.push(item.path)
    if (isMobile.value) {
      rightSidebarOpen.value = false
      sidebarOpen.value = false
    }
  } else {
    rightSidebarOpen.value = !rightSidebarOpen.value
    if (isMobile.value) {
      sidebarOpen.value = false
    }
  }
}

const chats = computed(() => chatStore.conversations)

function modelIconStr(model: modelType) {
  const iconMap = {
    [modelType.GPT3_5]: 'solar:chat-line-linear',
    [modelType.GPT4o]: 'solar:eye-scan-linear',
  }

  return iconMap[model]
}

function handleClickConversion(id: number, model: string) {
  router.push({ path: `/chat/${id}`, query: { model } })
  if (isMobile.value) {
    rightSidebarOpen.value = false
    sidebarOpen.value = false
  }
}

function clickLogout() {
  userStore.logout()
  router.push('/login')
}

// 是否展开
const collapsed = ref(true)

const navigation = ref([
  {
    name: 'AI 创作',
    icon: 'hugeicons:quill-write-02',
    current: false,
    expanded: true,
    children: [
      { name: '大模型（3.5）', key: 'gpt-3.5-turbo', type: 'key', icon: 'hugeicons:group-items', current: false },
      { name: '大模型（4.0）', key: 'gpt-4o', type: 'key', icon: 'hugeicons:group-layers', current: false },
      {
        name: '创作历史',
        path: '/history',
        type: 'path',
        icon: 'hugeicons:approximately-equal-square',
        current: false,
      },
      { name: '功能说明', path: '/funcdesc', type: 'path', icon: 'hugeicons:dashboard-square-02', current: false },
    ],
  },
  { name: '个人中心', path: '/user-center', type: 'path', icon: 'hugeicons:user', current: false },
  { name: '消费中心', path: '/cost-center', type: 'path', icon: 'hugeicons:store-02', current: false },
])

function clickDisclosureButton(item: any, open: boolean, level = 0) {
  if (level === 1) {
    // 清除所有的current
    navigation.value.forEach((nav) => {
      nav.current = false
      if (nav.children) {
        nav.children.forEach((child) => {
          child.current = false
        })
      }
    })
    item.current = true
  }
  if ('expanded' in item) {
    item.expanded = !open
  }

  // 功能
  if (item.children) {
    return 0
  }
  if (item.type === 'path') {
    router.push(item.path)
  }
}

function clickSubDisclosureButton(item: any) {
  // 状态
  navigation.value.forEach((nav) => {
    nav.current = false
    if (nav.children) {
      nav.children.forEach((child) => {
        child.current = false
      })
    }
  })
  item.current = true
  // item 的父级也要设置为 current
  const parent = navigation.value.find((nav) => nav.children?.includes(item))
  if (parent) {
    parent.current = true
  }

  // 功能
  if (item.type === 'key') {
    createChat(item.key)
  }

  if (item.type === 'path') {
    router.push(item.path)
  }
}

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
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
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
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="w-6 h-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="flex flex-col pb-2 overflow-y-auto bg-white grow gap-y-5">
                <div
                  class="flex items-center justify-between h-16 gap-2 border-r cursor-pointer bg-teal-400/5 shrink-0 backdrop-filter backdrop-blur-2x"
                  @click="goHome"
                >
                  <div class="flex items-center pl-4 gap-x-2">
                    <IconLogo class="z-30 w-8 h-8 text-teal-600 sm:h-8 sm:w-8" />
                    <p
                      class="text-lg font-black text-transparent font-jinbu sm:text-xl bg-gradient-to-r from-teal-600 to-emerald-400 bg-clip-text"
                    >
                      一粟科研AI平台
                    </p>
                  </div>
                  <!-- <img :src="goodSvg" alt="" class="w-16 h-16" /> -->
                </div>
                <nav class="flex flex-col flex-1 px-6">
                  <ul role="list" class="flex flex-col flex-1 gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <div
                            v-if="!item.children"
                            class="flex p-2 text-sm font-semibold leading-6 rounded-md cursor-pointer group gap-x-3"
                            :class="[
                              item.current
                                ? 'bg-gray-50 text-primary'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-primary-3',
                            ]"
                            @click="handleClickOption(item)"
                          >
                            <SvgIcon
                              :icon="item.icon"
                              :class="[item.current ? ' text-primary' : 'text-slate-500 group-hover:text-primary-3']"
                              class="w-6 h-6 shrink-0"
                              aria-hidden="true"
                            />

                            {{ item.name }}
                          </div>
                          <Disclosure v-else v-slot="{ open }" as="div">
                            <DisclosureButton
                              class="flex items-center w-full p-2 text-sm font-semibold leading-6 text-left text-gray-700 rounded-md gap-x-3"
                              :class="[item.current ? 'bg-gray-50' : 'hover:bg-gray-50']"
                            >
                              <SvgIcon
                                :icon="item.icon"
                                :class="[item.current ? ' text-primary' : 'text-slate-500 group-hover:text-primary-3']"
                                class="w-6 h-6 shrink-0"
                                aria-hidden="true"
                              />
                              {{ item.name }}
                              <ChevronRightIcon
                                class="w-5 h-5 ml-auto shrink-0"
                                :class="[open ? 'rotate-90 text-gray-500' : 'text-gray-400']"
                                aria-hidden="true"
                              />
                            </DisclosureButton>
                            <DisclosurePanel as="ul" class="px-2 mt-1">
                              <li v-for="subItem in item.children" :key="subItem.name">
                                <!-- 44px -->
                                <DisclosureButton
                                  as="div"
                                  class="block py-2 pr-2 text-sm leading-6 text-gray-700 rounded-md pl-9"
                                  :class="[subItem.current ? 'bg-gray-50' : 'hover:bg-gray-50']"
                                  @click="handleClickOption(subItem)"
                                  >{{ subItem.name }}</DisclosureButton
                                >
                              </li>
                            </DisclosurePanel>
                          </Disclosure>
                        </li>
                      </ul>
                    </li>
                    <li class="my-4 mt-auto -mx-6">
                      <div class="inline-flex items-center gap-2 px-4">
                        <img
                          class="flex-shrink-0 inline-block w-12 h-12 rounded-full shadow-md dark:shadow-teal-700"
                          :src="avatar"
                          alt="Image Description"
                        />
                        <div class="flex flex-col items-start justify-start">
                          <h3 class="font-semibold text-gray-800 text-md dark:text-white">{{ userName }}</h3>
                          <p class="text-sm font-medium text-gray-400">{{ email }}</p>
                        </div>
                        <button
                          class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
                          :class="[active ? 'bg-teal-600/10 text-teal-600' : 'text-gray-900 dark:text-white']"
                          @click="clickLogout"
                        >
                          <SvgIcon
                            icon="ph:sign-out"
                            :class="[active ? ' text-teal-600' : 'text-slate-500 dark:text-white']"
                            class="w-5 h-5 mr-2"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <NLayout has-sider class="h-screen">
      <NLayoutSider
        class="!z-50"
        collapse-mode="transform"
        :collapsed-width="80"
        :width="288"
        bordered
        position="absolute"
        show-trigger="bar"
        @update:collapsed="
          (value: boolean) => {
            console.log('update:collapsed', value)
            collapsed = !value
          }
        "
      >
        <div
          v-show="!collapsed"
          :class="{
            'lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:bg-white border-r border-hight-class-gray-1/5 shadow-sm shadow-hight-class-gray/5 lg:pb-4':
              !collapsed,
          }"
          class="hidden"
        >
          <div
            class="flex items-center justify-center h-16 gap-2 cursor-pointer shrink-0 backdrop-filter backdrop-blur-2x"
            @click="goHome"
          >
            <div class="flex items-center gap-x-2">
              <IconLogo class="w-auto h-8 text-teal-600 sm:h-8 sm:w-8" />
            </div>
          </div>

          <nav class="mt-8">
            <ul role="list" class="flex flex-col items-center space-y-1">
              <li v-for="item in navigation" :key="item.name">
                <div
                  v-if="!item.children"
                  class="flex p-3 text-sm font-semibold leading-6 rounded-xl group gap-x-3"
                  :class="[
                    item.current
                      ? 'bg-primary/10 text-primary'
                      : 'text-hight-class-gray hover:bg-primary/10 hover:text-hight-class-gray-1 hover:scale-95 transition duration-300 ease-in-out',
                  ]"
                  @click="clickDisclosureButton(item, false, 1)"
                >
                  <SvgIcon :icon="item.icon" class="w-6 h-6 shrink-0" aria-hidden="true" />
                  <span class="sr-only">{{ item.name }}</span>
                </div>
                <Popover v-if="item.children" v-slot="{ open }" class="relative z-50">
                  <PopoverButton
                    class="flex p-3 text-sm font-semibold leading-6 rounded-xl group gap-x-3 focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:ring-transparent"
                    :class="[
                      item.current
                        ? 'bg-primary/10 text-primary'
                        : 'text-hight-class-gray hover:bg-primary/10 hover:text-hight-class-gray-1 hover:scale-95 transition duration-300 ease-in-out',
                    ]"
                    @click="clickDisclosureButton(item, open)"
                  >
                    <SvgIcon :icon="item.icon" class="w-6 h-6 shrink-0" aria-hidden="true" />
                    <span class="sr-only">{{ item.name }}</span>
                  </PopoverButton>

                  <transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="translate-y-1 opacity-0"
                    enter-to-class="translate-y-0 opacity-100"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="translate-y-0 opacity-100"
                    leave-to-class="translate-y-1 opacity-0"
                  >
                    <PopoverPanel class="absolute z-50 max-w-sm w-48 px-4 mt-3 -top-1.5 left-20 sm:px-0">
                      <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                        <div class="relative grid gap-4 p-4 bg-white">
                          <div
                            v-for="subItem in item.children"
                            :key="subItem.name"
                            :class="[subItem.current ? ' text-primary bg-primary-3/10 ' : 'text-hight-class-gray']"
                            class="flex items-center -m-2 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none"
                            @click="clickSubDisclosureButton(subItem)"
                          >
                            <div class="flex items-center justify-center w-10 h-10 text-white shrink-0 sm:w-12">
                              <SvgIcon
                                :class="[subItem.current ? ' text-primary/60 ' : 'text-slate-500/60']"
                                :icon="subItem.icon"
                                class="w-6 h-6 shrink-0"
                                aria-hidden="true"
                              />
                            </div>
                            <div class="ml-2">
                              <p class="text-sm font-medium">
                                {{ subItem.name }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverPanel>
                  </transition>
                </Popover>
              </li>

              <li class="absolute bottom-0 left-0 w-full py-4">
                <div class="inline-flex items-center gap-2 px-4">
                  <button class="flex justify-end px-2 py-2 text-sm rounded-md group" @click="clickLogout">
                    <SvgIcon
                      icon="hugeicons:logout-03"
                      class="w-8 h-8 p-1.5 rounded-full bg-hight-class-gray-1/5 hover:bg-hight-class-gray-1/10 hover:text-primary hover:scale-95 transition duration-300 ease-in-out"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>

        <div v-show="collapsed" class="flex flex-col overflow-y-auto bg-white border-r border-gray-200 grow gap-y-5">
          <div
            class="flex items-center justify-between h-16 gap-2 cursor-pointer bg-primary/5 shrink-0"
            @click="goHome"
          >
            <div class="flex items-center pl-4 gap-x-2">
              <img :src="logoSvg" alt="" class="w-8 h-8" />
              <p
                class="text-sm font-black text-transparent font-jinbu sm:text-xl bg-gradient-to-r from-primary to-primary-2 bg-clip-text"
              >
                一粟科研AI平台
              </p>
            </div>
          </div>
          <nav class="flex flex-col flex-1 px-4">
            <ul role="list" class="flex flex-col flex-1 gap-y-7">
              <li>
                <ul role="list" class="-mx-2 space-y-1">
                  <li v-for="item in navigation" :key="item.name">
                    <div
                      v-if="!item.children"
                      class="flex p-2 text-sm font-semibold leading-6 rounded-md text-hight-class-gray-1 group gap-x-3"
                      :class="[item.current ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50']"
                      @click="clickDisclosureButton(item, false, 1)"
                    >
                      <SvgIcon
                        :icon="item.icon"
                        :class="[item.current ? ' text-primary/60' : 'text-hight-class-gray/60']"
                        class="w-6 h-6 shrink-0"
                        aria-hidden="true"
                      />
                      {{ item.name }}
                    </div>
                    <Disclosure v-else v-slot="{ open }" as="div">
                      <DisclosureButton
                        class="flex items-center w-full p-2 text-sm font-bold leading-6 text-left rounded-md gap-x-3 focus:outline-none focus:ring-0 focus:ring-transparent"
                        :class="[
                          item.current ? 'bg-primary/10 text-primary ' : 'hover:bg-gray-50 text-hight-class-gray-1',
                        ]"
                        @click="clickDisclosureButton(item, open)"
                      >
                        <SvgIcon
                          :class="[item.current ? ' text-primary/60 ' : 'text-hight-class-gray/60']"
                          :icon="item.icon"
                          class="w-6 h-6 shrink-0"
                          aria-hidden="true"
                        />
                        {{ item.name }}
                        <ChevronRightIcon
                          class="w-5 h-5 ml-auto shrink-0"
                          :class="[item.current ? 'rotate-90 text-gray-500' : 'text-gray-400']"
                          aria-hidden="true"
                        />
                      </DisclosureButton>
                      <TransitionRoot
                        appear
                        :show="item.expanded"
                        enter="transition-opacity duration-150 ease-in-out"
                        enter-from="opacity-80"
                        enter-to="opacity-100"
                        leave="transition-opacity duration-150 ease-in-out"
                        leave-from="opacity-100"
                        leave-to="opacity-80"
                      >
                        <DisclosurePanel as="ul" class="px-2 mt-1" static>
                          <li v-for="subItem in item.children" :key="subItem.name">
                            <!-- 44px -->
                            <DisclosureButton
                              as="div"
                              class="block py-2 pl-2 pr-2 ml-2 text-sm leading-6 text-gray-700 rounded-md"
                              :class="[subItem.current ? 'bg-gray-50 text-primary' : 'hover:bg-gray-50']"
                              @click="clickSubDisclosureButton(subItem)"
                            >
                              <div class="flex items-center font-medium gap-x-2">
                                <SvgIcon
                                  :icon="subItem.icon"
                                  :class="[
                                    subItem.current
                                      ? ' text-primary/80'
                                      : 'text-hight-class-gray/60 group-hover:text-primary-3',
                                  ]"
                                  class="w-5 h-5 shrink-0"
                                  aria-hidden="true"
                                />
                                <span>{{ subItem.name }}</span>
                              </div>
                            </DisclosureButton>
                          </li>
                        </DisclosurePanel>
                      </TransitionRoot>
                    </Disclosure>
                  </li>
                </ul>
              </li>
              <li class="absolute bottom-0 left-0 w-full py-4 border-t border-slate-100">
                <div class="inline-flex items-center gap-2 px-4">
                  <img
                    class="flex-shrink-0 inline-block w-10 h-10 rounded-full shadow-md dark:shadow-teal-700"
                    :src="avatar"
                    alt="Image Description"
                  />
                  <div class="flex flex-col items-start justify-start w-48">
                    <h3 class="font-semibold text-gray-800 text-md dark:text-white">{{ userName }}</h3>
                    <p class="text-sm text-gray-400">{{ email }}</p>
                  </div>
                  <button class="flex justify-end px-2 py-2 text-sm rounded-md group" @click="clickLogout">
                    <SvgIcon
                      icon="hugeicons:logout-03"
                      class="w-8 h-8 p-1.5 rounded-full bg-hight-class-gray-1/5 hover:bg-hight-class-gray-1/10 hover:text-primary hover:scale-95 transition duration-300 ease-in-out"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </NLayoutSider>
      <NLayoutContent>
        <main>
          <div
            :class="{
              'lg:ml-20': !collapsed,
              'lg:ml-72': collapsed,
            }"
            class="py-10 sm:px-6 lg:px-8 lg:py-6"
          >
            <LayoutHeader v-model:sidebar-open="sidebarOpen" />
            <LayoutMain :class="{ 'w-0 sm:w-auto': rightSidebarOpen }" />
          </div>
        </main>
      </NLayoutContent>
    </NLayout>
  </div>
</template>
