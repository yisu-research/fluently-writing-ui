<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ref, watchEffect } from 'vue'
import { NSwitch } from 'naive-ui'
import { useAppStore } from '@/store'
import { SvgIcon } from '@/components/common'

const appStore = useAppStore()

// 激活深色主题
const activeDark = ref(appStore.isDarkTheme)

// 监听深色主题变化
watchEffect(() => {
  activeDark.value ? appStore.setTheme('dark') : appStore.setTheme('light')
})

// 自定义主题滑块样式
const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const style: CSSProperties = {}
  if (checked) {
    style.background = '#f0fdfa'
    if (focused) {
      style.boxShadow = '0 0 0 2px #15DBC740'
    }
  } else {
    style.background = '#e2e8f0'
    if (focused) {
      style.boxShadow = '0 0 0 2px #FEFFFF40'
    }
  }
  return style
}
</script>

<template>
  <NSwitch
    v-model:value="activeDark"
    :default-value="activeDark"
    size="medium"
    rubber-band
    :rail-style="railStyle"
    class="mr-4"
  >
    <template #checked-icon>
      <SvgIcon icon="solar:moon-fog-bold-duotone" class="text-teal-500" />
    </template>
    <template #unchecked-icon>
      <SvgIcon icon="solar:sun-fog-bold-duotone" class="text-slate-400" />
    </template>
  </NSwitch>
</template>
