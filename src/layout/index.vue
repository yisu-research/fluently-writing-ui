<script setup lang="ts">
import { ref } from 'vue'
import LayoutHeader from '@/layout/layout-header/index.vue'
import LayoutMain from '@/layout/layout-main/index.vue'
import LayoutSidebar from '@/layout/layout-sidebar/index.vue'

const sidebarOpen = ref(false)
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
