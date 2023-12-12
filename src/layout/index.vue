<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LayoutHeader from '@/layout/layout-header/index.vue'
import LayoutMain from '@/layout/layout-main/index.vue'
import LayoutSidebar from '@/layout/layout-sidebar/index.vue'
import { useUserStoreWithOut } from '@/store'

const sidebarOpen = ref(false)

const userStore = useUserStoreWithOut()

onMounted(() => {
  initData()
})

async function initData() {
  await userStore.fetchProfile()
  console.log(userStore.getUsername)
}
</script>

<template>
  <div>
    <LayoutSidebar v-model:sidebar-open="sidebarOpen" />
    <div class="lg:pl-72">
      <LayoutHeader v-model:sidebar-open="sidebarOpen" />
      <LayoutMain />
    </div>
  </div>
</template>
