import type { GlobalThemeOverrides } from 'naive-ui'
import { computed, ref, watch } from 'vue'
import { darkTheme } from 'naive-ui'
import { useDark, useToggle } from '@vueuse/core'
// import { useAppStore } from '@/store'
import { customTheme } from '@/settings'

export function useTheme() {
  // const appStore = useAppStore()

  // const isDark = computed(() => {
  //   return appStore.theme === 'dark'
  // })
  const isDark = ref(false)

  const theme = computed(() => {
    return isDark.value ? darkTheme : undefined
  })

  const themeOverrides = computed<GlobalThemeOverrides>(() => {
    if (isDark.value) {
      return customTheme.naiveThemeOverridesDark
    }
    return customTheme.naiveThemeOverridesLight
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

  return { theme, themeOverrides }
}

export function setupTheme() {
  useTheme()
}
