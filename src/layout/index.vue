<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LayoutHeader from '@/layout/layout-header/index.vue'
import LayoutMain from '@/layout/layout-main/index.vue'
import LayoutSidebar from '@/layout/layout-sidebar/index.vue'
import api from '@/api'

const sidebarOpen = ref(false)

onMounted(() => {
  initData()
})

async function initData() {
  try {
    const res = await api.getProfileApi()
    console.log(res)
    
  } catch (error) {
    console.error(error)
  }
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
