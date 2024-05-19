<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// import { useUpgradeLog } from './hooks/useUpgradeLog'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import LayoutHeader from '@/layout/layout-header/index.vue'
import LayoutMain from '@/layout/layout-main/index.vue'
import LayoutSidebar from '@/layout/layout-sidebar/index.vue'
import { useAppStoreWithOut, useUserStoreWithOut } from '@/store'
import { Gender } from '@/store/modules/user/helper'
import manImage from '@/assets/images/man.png'
import womanImage from '@/assets/images/woman.png'
import aiSvg from '@/assets/svg/ai.svg'

const sidebarOpen = ref(false)

const userStore = useUserStoreWithOut()

// const { markAsRead, upgradeLogNotification } = useUpgradeLog()

const appStore = useAppStoreWithOut()

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
}

function closeModal() {
  isOpen.value = false
}

function read() {
  appStore.setGpt4oNotice(false)
  isOpen.value = false
}

onMounted(() => {
  initData()
  if (markAsRead.value) {
    // upgradeLogNotification()
    isOpen.value = true
  }
})
</script>

<template>
  <div class="">
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
  </div>
</template>
