<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { NButton, NDrawer, NDrawerContent } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import LogoName from '@/components/common/LogoName/index.vue'
// import SwitchLanguage from '@/components/common/switch-language/index.vue'
import { SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useUserStoreWithOut } from '@/store'
import { router } from '@/router'

// Comment: 移动端菜单是否打开
const mobileMenuOpen = ref(false)

// Comment: header 的 ref
const header = ref(null)

// Comment: 是否滚动
const scrolled = ref(false)

// Comment: 屏幕宽度
const { width } = useWindowSize()

// 抽屉的宽度
const drawerWidth = ref(500)

const { isMobile } = useBasicLayout()

const userStore = useUserStoreWithOut()

const isLogin = computed(() => userStore.getUsername)

// Comment: 监听屏幕宽度，当屏幕宽度小于 768 时，抽屉的宽度为屏幕宽度
watchEffect(() => {
  newFunc()
})

// q: 解释一下 watchEffect 函数
// a: watchEffect 函数会在组件渲染时执行一次，然后在依赖项发生变化时再次执行
// q: 哪个是依赖项？
// a: 这里的依赖项是 scrolled，当 scrolled 的值发生变化时，watchEffect 函数会再次执行
watchEffect(() => {
  window.addEventListener('scroll', handleScroll)
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
})

function newFunc() {
  if (isMobile) {
    drawerWidth.value = (width.value * 5) / 6
  } else {
    drawerWidth.value = 360
  }
}

// q: 解释一下这个 handleScroll 函数
// a: 这里是监听滚动事件，当滚动距离大于 10 时，将 scrolled 的值设置为 true，否则设置为 false
function handleScroll() {
  if (window.scrollY > 0) {
    scrolled.value = true
  } else {
    scrolled.value = false
  }
}

function clickUsername() {
  router.push('/user-center')
}

// Comment: 这里是导航栏的配置
// Note: 这里的 path 是路由的 path，当点击导航栏时，会跳转到对应的路由
const barOptions: { title: string; icon: string; path: string }[] = [
  {
    title: '登录',
    icon: 'solar:login-3-line-duotone',
    path: '/login',
  },
]
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 backdrop-filter backdrop-blur-2xl">
    <div
      ref="header"
      :class="{
        ' dark:bg-slate-600 opacity-60  border-b bg-white  dark:border-zinc-700 border-slate-200': scrolled,
      }"
      class="absolute top-0 bottom-0 left-0 right-0"
    ></div>
    <!-- PC 端 -->
    <nav class="flex items-center justify-between p-4 mx-auto max-w-7xl lg:px-8" aria-label="Global">
      <div class="flex flex-1 lg:flex-none">
        <div class="flex lg:hidden">
          <NButton
            text
            size="large"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = true"
          >
            <span class="sr-only">Open main menu</span>
            <SvgIcon icon="uim:bars" class="text-xl" />
          </NButton>
        </div>
      </div>
      <LogoName name="一粟科研" />
      <div class="flex items-center justify-end flex-1">
        <!-- 主题切换按钮 -->
        <!-- <SwitchTheme /> -->
        <!-- 多语言按钮 -->
        <!-- <SwitchLanguage /> -->

        <!-- 垂直分割线 -->
        <!-- <div class="hidden mx-4 lg:block">
          <div class="flex items-center h-4 py-2">
            <div class="w-px h-5 bg-slate-300 dark:bg-gray-700" aria-hidden="true"></div>
          </div>
        </div> -->

        <div v-if="!isMobile" class="hidden lg:flex lg:gap-x-12">
          <template v-for="item in barOptions" :key="item.title">
            <div v-if="!isLogin">
              <NButton text size="large" class="leading-6">
                <SvgIcon :icon="item.icon" class="mr-1" />
                <RouterLink :to="item.path" class="font-bold">{{ item.title }}</RouterLink>
              </NButton>
            </div>
            <div
              v-else
              class="font-bold z-10 cursor-pointer text-teal-600 flex items-center gap-2 border border-teal-600/20 rounded-lg px-2 py-0.5 shadow-sm hover:shadow-md"
              @click="clickUsername"
            >
              <SvgIcon icon="ph:user-circle-duotone" class="h-5 w-5" />
              <p>{{ userStore.getUsername }}</p>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <!-- 移动端抽屉 -->
    <NDrawer v-model:show="mobileMenuOpen" :width="drawerWidth" placement="left" @close="mobileMenuOpen = false">
      <NDrawerContent class="w-full p-0 m-0 bg-slate-50 dark:bg-gray-900">
        <div class="flex items-center justify-between">
          <LogoName name="一粟科研" />
          <NButton text size="large" class="-m-2.5 rounded-md p-2.5" @click="mobileMenuOpen = false">
            <span class="sr-only">Close menu</span>
            <SvgIcon icon="uim:multiply" class="text-xl" />
          </NButton>
        </div>
        <div
          class="mt-6 overflow-hidden bg-white rounded-lg shadow-sm dark:bg-slate-700 dark:bg-opacity-80 ring-1 ring-slate-100 dark:ring-teal-800"
        >
          <div class="px-2 sm:px-2">
            <div class="space-y-2">
              <span v-for="(item, index) in barOptions" :key="item.title" text size="large" class="w-full mx-auto">
                <RouterLink :to="item.path">
                  <div
                    class="flex items-center justify-between w-full px-2 py-2 my-2 rounded-lg hover:bg-gray-50 hover:dark:bg-slate-600"
                  >
                    <div
                      class="flex items-center justify-start gap-2 text-base font-semibold leading-7 dark:text-white text-slate-700"
                    >
                      <SvgIcon :icon="item.icon" class="text-teal-600 dark:text-teal-300" />
                      {{ item.title }}
                    </div>
                    <SvgIcon icon="uil:angle-right-b" class="" /></div
                ></RouterLink>

                <!-- 分割线 -->
                <span
                  v-if="index !== barOptions.length - 1"
                  class="flex mx-2 border-b border-gray-200 dark:border-teal-800"
                />
              </span>
            </div>
          </div>
        </div>
      </NDrawerContent>
    </NDrawer>
  </header>
</template>
