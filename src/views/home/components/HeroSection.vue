<script setup lang="ts">
import { computed, ref } from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import HeroSvg from '@/assets/svg/hero.svg'
import { useAuthStore, useUserStore } from '@/store'
import { IconLogo } from '@/components/icons'
import { SvgIcon } from '@/components/common'

const authStore = useAuthStore()

const userStore = useUserStore()

const auth = computed(() => authStore)

const user = computed(() => userStore)

// const navigation = [
//   // { name: 'Product', href: '#' },
//   // { name: 'Features', href: '#' },
//   // { name: 'Marketplace', href: '#' },
//   // { name: 'Company', href: '#' },
// ]

// title
const title = '一粟创作助手'

// slogan
const slogan = '激发灵感，提高效率'

// 现在开始
const start = '现在开始'

// footnote
const footnote = 'Powered by'

const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="relative overflow-hidden bg-white isolate">
    <svg
      class="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
          width="200"
          height="200"
          x="50%"
          y="-1"
          patternUnits="userSpaceOnUse"
        >
          <path d="M100 200V.5M.5 .5H200" fill="none" />
        </pattern>
      </defs>
      <svg x="50%" y="-1" class="overflow-visible fill-gray-50">
        <path
          d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
          stroke-width="0"
        />
      </svg>
      <rect width="100%" height="100%" stroke-width="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
    </svg>

    <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
      <svg
        class="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/3 rotate-[20deg] sm:left-[calc(50%-20rem)] sm:h-[62.375rem]"
        viewBox="0 0 1155 678"
      >
        <path
          fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
          fill-opacity=".3"
          d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
        />
        <defs>
          <linearGradient
            id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
            x1="1155.49"
            x2="-78.208"
            y1=".177"
            y2="474.645"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#2DD4BF" />
            <stop offset="1" stop-color="#F9F871" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div class="px-6 pt-6 lg:px-8">
      <nav class="flex items-center justify-between" aria-label="Global">
        <div class="flex lg:flex-1">
          <a href="https://yisukeyan.com/" class="-m-1.5 p-1.5 flex items-center">
            <span class="sr-only">一粟科研</span>
            <IconLogo class="text-xl text-teal-500" />
            <span
              class="ml-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500"
            >
              一粟科研
            </span>
          </a>
        </div>
        <div class="flex lg:hidden">
          <div
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = true"
          >
            <span class="sr-only">Open main menu</span>
            <SvgIcon class="text-2xl" icon="uil:align" />
          </div>
        </div>
        <!-- <div class="hidden lg:flex lg:gap-x-12">
          <a
            v-for="item in navigation"
            :key="item.name"
            :href="item.href"
            class="text-sm font-semibold leading-6 text-gray-900"
            >{{ item.name }}</a
          >
        </div> -->
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <RouterLink v-if="auth.isLogin" to="/chat" class="text-sm font-semibold leading-6 text-gray-900">
            <div class="flex items-center justify-center">
              <div>
                <img class="inline-block w-8 h-8 rounded-full" src="@/assets/avatar.jpg" alt="" />
              </div>

              <p class="ml-2 text-lg">{{ user.username }}</p>
            </div>
          </RouterLink>

          <RouterLink v-else to="Login" class="text-sm font-semibold leading-6 text-gray-900"> 登录 </RouterLink>
        </div>
      </nav>
      <Dialog as="div" :open="mobileMenuOpen" @close="mobileMenuOpen = false">
        <DialogPanel class="fixed inset-0 z-10 px-6 py-6 overflow-y-auto bg-white lg:hidden">
          <div class="flex items-center justify-between">
            <a href="https://yisukeyan.com/" class="-m-1.5 p-1.5 flex justify-start items-center">
              <span class="sr-only">一粟科研</span>
              <IconLogo class="text-xl text-teal-500" />
              <span
                class="ml-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500"
              >
                一粟科研
              </span>
            </a>
            <div class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
              <span class="sr-only">Close menu</span>
              <SvgIcon class="text-2xl" icon="uil:times" />
            </div>
          </div>
          <div class="flow-root mt-6">
            <div class="-my-6 divide-y divide-gray-500/10">
              <!-- <div class="py-6 space-y-2">
                <a
                  v-for="item in navigation"
                  :key="item.name"
                  :href="item.href"
                  class="block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-gray-900 rounded-lg hover:bg-gray-400/10"
                  >{{ item.name }}</a
                >
              </div> -->
              <div class="py-6">
                <RouterLink v-if="auth.isLogin" to="/chat" class="text-sm font-semibold leading-6 text-gray-900">
                  <div class="flex items-center justify-start">
                    <div>
                      <img class="inline-block w-8 h-8 rounded-full" src="@/assets/avatar.jpg" alt="" />
                    </div>

                    <p class="ml-2 text-lg">{{ user.username }}</p>
                  </div>
                </RouterLink>
                <RouterLink
                  v-else
                  to="Login"
                  class="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10"
                  >登录
                </RouterLink>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
    <div class="px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
      <div class="max-w-2xl mx-auto lg:mx-0 lg:flex-auto">
        <!-- 渐变色标题 -->
        <h1
          class="max-w-lg mt-10 text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-400 sm:text-7xl"
        >
          {{ title }}
        </h1>

        <p class="mt-6 text-2xl leading-8 text-gray-600">{{ slogan }}</p>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          {{ footnote }}
          <a href="https://chat.openai.com" class="text-teal-500 hover:text-teal-400">ChatGPT</a>
        </p>
        <div class="flex items-center mt-10 gap-x-6">
          <div
            class="px-4 py-3 text-lg font-semibold tracking-wider text-white bg-teal-500 rounded-md shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <router-link to="/chat">{{ start }}</router-link>
          </div>
        </div>
      </div>

      <div class="mx-auto mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
        <img :src="HeroSvg" alt="" class="mx-auto w-[45rem] max-w-full drop-shadow-xl" />
      </div>
    </div>
  </div>
</template>
