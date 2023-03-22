import { useOsTheme } from 'naive-ui'
import { computed, watch } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useAppStore } from '@/store'

export function useTheme() {
  const appStore = useAppStore()

  const osTheme = useOsTheme()

  const isDark = computed(() => {
    if (appStore.theme === 'auto') {
      return osTheme.value === 'dark'
    }
    return appStore.theme === 'dark'
  })

  const theme = computed(() => {
    return isDark.value ? 'dark' : 'light'
  })

  const daisyDark = useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light',
  })

  const tailWindDark = useDark()

  const toggleDaisyDark = useToggle(daisyDark)
  const toggleTailWindDark = useToggle(tailWindDark)

  const toggleDark = () => {
    toggleDaisyDark()
    toggleTailWindDark()
  }

  watch(
    () => isDark.value,
    (dark) => {
      if (dark === daisyDark.value) {
        return
      }
      toggleDark()
    },
    { immediate: true },
  )

  return { theme }
}

export function setupTheme() {
  useTheme()
}
