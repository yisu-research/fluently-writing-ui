<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUpgradeLog } from './hooks/useUpgradeLog'
import LayoutHeader from '@/layout/layout-header/index.vue'
import LayoutMain from '@/layout/layout-main/index.vue'
import LayoutSidebar from '@/layout/layout-sidebar/index.vue'
import { useUserStoreWithOut } from '@/store'
import { Gender } from '@/store/modules/user/helper'
import manImage from '@/assets/images/man.png'
import womanImage from '@/assets/images/woman.png'

const sidebarOpen = ref(false)

const userStore = useUserStoreWithOut()

const { markAsRead, upgradeLogNotification } = useUpgradeLog()

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

onMounted(() => {
  initData()
  if (markAsRead.value) {
    upgradeLogNotification()
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
  </div>
</template>
