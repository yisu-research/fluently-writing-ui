<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// import { useUpgradeLog } from './hooks/useUpgradeLog'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import LayoutHeader from '@/layout/layout-header/index.vue'
import { modelType } from '@/store/modules/chat/helper'
import LayoutMain from '@/layout/layout-main/index.vue'
import { useAppStoreWithOut, useChatStoreWithOut, useUserStoreWithOut } from '@/store'
import { Gender } from '@/store/modules/user/helper'
import manImage from '@/assets/images/man.png'
import womanImage from '@/assets/images/woman.png'
import { IconLogo } from '@/components/icons'
import goodSvg from '@/assets/svg/good.svg'
import { router } from '@/router'
import { SvgIcon } from '@/components/common'
import EditConversion from '@/layout/edit-conversion/index.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'

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

function closeModal() {
  isOpen.value = false
}

function read() {
  appStore.setGpt4oNotice(false)
  isOpen.value = false
}

// const navigation = ref([
//   { name: '个人中心', path: '/user-center', icon: 'ph:user-circle', current: true, type: 'path' },
//   { name: '消费中心', path: '/cost-center', icon: 'ph:storefront', current: false, type: 'path' },
//   { name: '历史对话', path: '/history', icon: 'ph:clock-clockwise-fill', current: false, type: 'history' },
// ])

const navigation = ref([
  {
    name: 'AI 创作',
    icon: 'ph:note-pencil',
    current: false,
    children: [
      { name: '新的创作', path: '/chat', type: 'path' },
      { name: '创作历史', path: '/history', type: 'path' },
    ],
  },
  { name: '个人中心', path: '/user-center', icon: 'ph:user-circle', current: false, type: 'path' },
  { name: '消费中心', path: '/cost-center', icon: 'ph:storefront', current: false, type: 'path' },
])

// watch(
//   () => router.currentRoute.value.path,
//   (path) => {
//     navigation.value.forEach((item) => {
//       item.current = path === item.path
//     })
//   },
//   { immediate: true },
// )

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

// const teams = [
//   { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
//   { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
//   { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
// ]

const sidebarOpen = ref(false)

const collapsed = ref(false)

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
</script>

<template>
  <!-- <div class="">
    <LayoutSidebar v-model:sidebar-open="sidebarOpen" />
    <div class="h-screen lg:pl-72">
      <LayoutHeader v-model:sidebar-open="sidebarOpen" />
      <LayoutMain />
    </div>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex items-center justify-center min-h-full p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
              >
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  地表最强大模型 GPT-4o 重磅上线！🎉🎉🎉
                </DialogTitle>
                <div class="flex items-center justify-center p-4 my-4 rounded-xl bg-emerald-50">
                  <img :src="aiSvg" alt="" class="w-4/5" />
                </div>
                <div class="mt-2 gap-x-8">
                  <p class="text-sm text-gray-600">
                    探索前沿智能，开启智慧新章。GPT4o全新上线，带你体验尖端技术的魅力！以卓越的理解力和响应速度，GPT4o将成为你的贴身助手，助力学习、工作、生活的每一环节。今天，就让GPT4o成为你无可替代的智能伙伴，一起创造无限可能！
                  </p>
                  <p class="text-sm text-gray-800">
                    GPT-4o支持文字/图片的输入和文字的输出，同时价格只是GPT4的一半，欢迎体验!
                  </p>
                  <div>
                    <img src="" alt="" />
                  </div>
                </div>

                <div class="flex justify-center mt-4">
                  <button
                    type="button"
                    class="inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md bg-emerald-100 text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    @click="read"
                  >
                    立即体验
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div> -->
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
                  <img :src="goodSvg" alt="" class="w-16 h-16" />
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

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex flex-col overflow-y-auto bg-white border-r border-gray-200 grow gap-y-5">
        <div
          class="flex items-center justify-between h-16 gap-2 border-r cursor-pointer bg-teal-400/5 shrink-0 backdrop-filter backdrop-blur-2x"
          @click="goHome"
        >
          <div class="flex items-center pl-4 gap-x-2">
            <IconLogo class="w-auto h-8 text-teal-600 sm:h-8 sm:w-8" />
            <p
              class="text-lg font-black text-transparent font-jinbu sm:text-xl bg-gradient-to-r from-teal-600 to-emerald-400 bg-clip-text"
            >
              一粟科研AI平台
            </p>
          </div>
          <img :src="goodSvg" alt="" class="w-16 h-16" />
        </div>
        <nav class="flex flex-col flex-1 px-6">
          <!-- <ButtonNewChat class="mb-4" /> -->
          <ul role="list" class="flex flex-col flex-1 gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <div
                    v-if="!item.children"
                    class="flex p-2 text-sm font-semibold leading-6 rounded-md cursor-pointer group gap-x-3"
                    :class="[
                      item.current ? 'bg-gray-50 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-3',
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
    </div>

    <!-- <div class="sticky top-0 z-40 flex items-center px-4 py-4 bg-white shadow-sm gap-x-6 sm:px-6 lg:hidden">
      <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="w-6 h-6" aria-hidden="true" />
      </button>
      <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
      <a href="#">
        <span class="sr-only">Your profile</span>
        <img
          class="w-8 h-8 rounded-full bg-gray-50"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
      </a>
    </div> -->

    <main class="lg:pl-72">
      <div :class="{ 'xl:pr-96': rightSidebarOpen }">
        <div class="py-10 sm:px-6 lg:px-8 lg:py-6 w-">
          <LayoutHeader v-model:sidebar-open="sidebarOpen" />
          <LayoutMain :class="{ 'w-0 sm:w-auto': rightSidebarOpen }" />
        </div>
      </div>
    </main>

    <aside
      :class="{ 'xl:block mt-16 sm:mt-0': rightSidebarOpen, hidden: !rightSidebarOpen }"
      class="fixed inset-y-0 right-0 w-full overflow-y-auto border-l border-gray-200 sm:w-96"
    >
      <!-- Secondary column (hidden on smaller screens) -->
      <nav class="flex flex-col flex-1">
        <ul role="list" class="relative flex flex-col flex-1 -mx-2">
          <li class="absolute top-0 w-full h-10 p-2 px-4 font-medium text-teal-900 border-b bg-slate-100">历史对话</li>

          <li class="mt-10">
            <ul
              ref="desktopList"
              role="list"
              class="overflow-y-auto h-[calc(100vh-17rem)] divide-y divide-slate-100 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-teal-600/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-teal-600/20 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500"
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
    </aside>
  </div>
</template>
