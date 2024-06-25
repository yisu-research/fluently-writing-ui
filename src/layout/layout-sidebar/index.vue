<script setup lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { NLayoutSider } from 'naive-ui'
import { computed, ref, toRefs } from 'vue'
import day from 'dayjs'
import { IconLogo } from '@/components/icons'
import logoSvg from '@/assets/svg/logo.svg'
import { SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { router } from '@/router'
import type { conversationType } from '@/store/modules/chat/helper'
import api from '@/api'
import manImage from '@/assets/images/man.png'
import womanImage from '@/assets/images/woman.png'
import { useChatStoreWithOut, useUserStoreWithOut } from '@/store'
import { Gender } from '@/store/modules/user/helper'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits(['changeCollapsed'])

const { collapsed } = toRefs(props)

const userStore = useUserStoreWithOut()

const { isMobile } = useBasicLayout()

const avatar = computed(() => (userStore.getGender === Gender.Man ? manImage : womanImage))

const userName = computed(() => {
  return userStore.getUsername || '未登录'
})

const email = computed(() => {
  return userStore.getEmail || '未设置邮箱'
})

function goHome() {
  router.push('/')
}

function clickLogout() {
  userStore.logout()
  router.push('/login')
}

function changeCollapsed(value: boolean) {
  emit('changeCollapsed', value)
}

const navigation = ref([
  {
    name: 'AI 创作',
    icon: 'hugeicons:quill-write-02',
    current: false,
    expanded: true,
    ref: 'ai-creation',
    children: [
      { name: '大模型基础', key: 'gpt-3.5-turbo', type: 'key', icon: 'hugeicons:group-items', current: false },
      { name: '大模型高级', key: 'gpt-4o', type: 'key', icon: 'hugeicons:group-layers', current: false },
      {
        name: '历史记录',
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

const chatStore = useChatStoreWithOut()

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
      spendCount: res.spend_count,
      state: res.state,
      userId: res.user_id,
      startMessageId: res.start_message_id,
      createdAt: res.created_at,
      updatedAt: res.updated_at,
    }

    chatStore.insertConversation(conversation)

    // 导航到新创建的对话
    router.push({ path: `/chat/${res.id}`, query: { id: res.id, model: res.model } })
  } catch (err) {
    console.error(err)
  }
}

function updateCollapsed(value: boolean) {
  changeCollapsed(value)
}

const durationList = ['150', '300', '500', '700', '1000']
</script>

<template>
  <TransitionRoot
    as="template"
    :show="true"
    appear
    enter="transition ease-in-out duration-300 transform"
    enter-from="translate-x-full"
    enter-to="translate-x-0"
    leave="transition ease-in-out duration-300 transform"
    leave-from="translate-x-0"
    leave-to="translate-x-full"
  >
    <NLayoutSider
      class="!z-50"
      collapse-mode="transform"
      :collapsed-width="isMobile ? 0 : 80"
      :width="288"
      bordered
      :collapsed="collapsed"
      position="absolute"
      show-trigger="bar"
      @update:collapsed="updateCollapsed"
    >
      <TransitionChild
        as="template"
        enter="transition ease-in-out duration-300 transform"
        enter-from="translate-x-full"
        enter-to="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leave-from="translate-x-0"
        leave-to="translate-x-full"
      >
        <div
          v-show="collapsed"
          :class="{
            'lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:bg-white border-r border-hight-class-gray-1/5 shadow-sm shadow-hight-class-gray/5 lg:pb-4':
              collapsed,
          }"
          class="hidden"
        >
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="translate-x-full"
          >
            <div
              class="flex items-center justify-center h-16 gap-2 cursor-pointer shrink-0 backdrop-filter backdrop-blur-2x"
              @click="goHome"
            >
              <div class="flex items-center gap-x-2">
                <IconLogo class="w-auto h-8 text-teal-600 sm:h-8 sm:w-8" />
              </div>
            </div>
          </TransitionChild>

          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <nav class="mt-8">
              <ul role="list" class="flex flex-col items-center space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <div
                    v-if="!item.children"
                    class="flex flex-col items-center p-3 text-xs font-semibold leading-6 rounded-xl group gap-x-3"
                    :class="[
                      item.current
                        ? 'bg-primary/10 text-primary'
                        : 'text-hight-class-gray hover:bg-primary/10 hover:text-hight-class-gray-1 hover:scale-95 transition duration-300 ease-in-out',
                    ]"
                    @click="clickDisclosureButton(item, false, 1)"
                  >
                    <SvgIcon :icon="item.icon" class="w-6 h-6 shrink-0" aria-hidden="true" />
                    <span class="mt-1">{{ item.name }}</span>
                  </div>
                  <Popover
                    v-if="item.children"
                    v-slot="{ open }"
                    class="relative z-50 transition-all duration-700 ease-in-out hover:duration-700 hover:ease-in-out hover:transition-all group"
                  >
                    <PopoverButton
                      class="z-50 flex flex-col items-center p-3 text-xs font-semibold leading-6 group rounded-xl gap-x-3 focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:ring-transparent"
                      :class="[
                        item.current
                          ? 'bg-primary/10 text-primary'
                          : 'text-hight-class-gray hover:bg-primary/10 hover:text-hight-class-gray-1 hover:scale-95 transition-all duration-700 ease-in-out hover:transition-all hover:duration-700 hover:ease-in-out',
                      ]"
                      @click="clickDisclosureButton(item, open)"
                    >
                      <SvgIcon :icon="item.icon" class="w-6 h-6 shrink-0" aria-hidden="true" />
                      <span class="mt-1">{{ item.name }}</span>
                    </PopoverButton>

                    <TransitionChild
                      as="template"
                      enter="transition ease-in-out duration-300 transform"
                      enter-from="-translate-x-full"
                      enter-to="translate-x-0"
                      leave="transition ease-in-out duration-300 transform"
                      leave-from="translate-x-0"
                      leave-to="-translate-x-full"
                    >
                      <PopoverPanel
                        static
                        class="absolute hidden w-48 max-w-sm px-4 mt-3 group-hover:block focus-visible:block -top-2 left-[4rem] sm:px-0 group-hover:transition-all group-hover:duration-700 group-hover:ease-in-out"
                      >
                        <div class="relative overflow-hidden rounded-xl">
                          <div class="absolute w-8 h-8 bg-green-500 rounded-full right-6 -top-3"></div>
                          <div class="absolute w-12 h-12 rounded-full bg-rose-500 -bottom-6 left-6"></div>
                          <div
                            class="relative grid gap-4 p-4 mx-4 transition-all duration-700 ease-in-out transform border shadow-sm border-hight-class-gray-1/5 rounded-xl bg-white/80 backdrop-blur-xl from:translate-y-1 to:translate-y-0"
                          >
                            <div
                              v-for="subItem in item.children"
                              :key="subItem.name"
                              :class="[subItem.current ? ' text-primary bg-primary-3/10 ' : 'text-hight-class-gray']"
                              class="flex items-center -m-2 transition duration-150 ease-in-out rounded-lg cursor-pointer text- hover:text-hight-class-gray/80 hover:bg-grey-400/20 focus:outline-none"
                              @click="clickSubDisclosureButton(subItem)"
                            >
                              <div class="flex items-center justify-center w-10 h-10 shrink-0 sm:w-12">
                                <SvgIcon
                                  :class="[subItem.current ? ' text-primary/60 ' : '']"
                                  :icon="subItem.icon"
                                  class="w-6 h-6 shrink-0"
                                  aria-hidden="true"
                                />
                              </div>
                              <div>
                                <p class="text-sm font-medium">
                                  {{ subItem.name }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel></TransitionChild
                    >
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
          </TransitionChild>
        </div>
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="transition ease-in-out duration-300 transform"
        enter-from="-translate-x-full"
        enter-to="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leave-from="translate-x-0"
        leave-to="-translate-x-full"
      >
        <div v-show="!collapsed" class="flex flex-col overflow-y-auto bg-white border-r border-gray-200 grow gap-y-5">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <div
              class="flex items-center justify-between h-16 gap-2 cursor-pointer bg-primary/5 shrink-0"
              @click="goHome"
            >
              <div class="flex items-center pl-4 gap-x-2">
                <img :src="logoSvg" alt="" class="w-8 h-8" />
                <p
                  class="text-xl font-black text-transparent font-jinbu sm:text-xl bg-gradient-to-r from-primary to-primary-2 bg-clip-text"
                >
                  一粟科研AI平台
                </p>
              </div>
            </div>
          </TransitionChild>

          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
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
                      <Disclosure v-else v-slot="{ open }" :default-open="true" as="div">
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
                          <SvgIcon
                            icon="hugeicons:arrow-right-01"
                            class="w-5 h-5 ml-auto shrink-0"
                            :class="[item.expanded ? 'rotate-90 text-gray-500' : 'text-gray-400']"
                            aria-hidden="true"
                          />
                        </DisclosureButton>
                        <TransitionRoot as="div" :show="item.expanded">
                          <DisclosurePanel as="ul" class="px-2 mt-1" static>
                            <li v-for="(subItem, index) in item.children" :key="subItem.name">
                              <TransitionChild
                                :enter="
                                  [`duration-${durationList[index]}`, 'transition ease-in-out transform'].join(' ')
                                "
                                enter-from="-translate-x-1/2"
                                enter-to="translate-x-0"
                                :leave="[`duration-300`, 'transition ease-in-out transform'].join(' ')"
                                leave-from="translate-x-0"
                                leave-to="-translate-x-1/2"
                              >
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
                                </DisclosureButton></TransitionChild
                              >
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
          </TransitionChild>
        </div>
      </TransitionChild>
    </NLayoutSider>
  </TransitionRoot>
</template>
