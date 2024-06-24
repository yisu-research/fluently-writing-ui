<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import LayoutMain from '@/layout/layout-main/index.vue'
import LayoutHeader from '@/layout/layout-header/index.vue'
import { useAppStoreWithOut, useChatStoreWithOut, useUserStoreWithOut } from '@/store'
import { Gender } from '@/store/modules/user/helper'
import manImage from '@/assets/images/man.png'
import womanImage from '@/assets/images/woman.png'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import LayoutSidebar from '@/layout/layout-sidebar/index.vue'

const userStore = useUserStoreWithOut()

const chatStore = useChatStoreWithOut()

const { isMobile } = useBasicLayout()

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

  // 对话列表
  await chatStore.fetchConversation()
}

onMounted(() => {
  initData()
  if (markAsRead.value) {
    // upgradeLogNotification()
    isOpen.value = true
  }
})

// 是否展开
const collapsed = ref(true)

// 改变侧边栏展开状态
function changeCollapsed(value: boolean) {
  collapsed.value = value
}
</script>

<template>
  <div>
    <NLayout has-sider class="h-screen">
      <LayoutSidebar v-model:collapsed="collapsed" @change-collapsed="changeCollapsed" />
      <NLayoutContent>
        <main class="relative">
          <div
            :class="{
              'lg:ml-20': collapsed,
              'lg:ml-72': !collapsed,
            }"
            class="py-10 sm:px-6 lg:px-8 lg:py-6"
          >
            <LayoutHeader v-model:collapsed="collapsed" />
            <LayoutMain />
          </div>
          <div
            v-show="!collapsed && isMobile"
            class="absolute top-0 left-0 right-0 w-full h-screen bg-hight-class-gray/40"
          ></div>
        </main>
      </NLayoutContent>
    </NLayout>
  </div>
</template>
