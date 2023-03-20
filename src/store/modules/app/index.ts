import { defineStore } from 'pinia'
import type { AppState, Language, Theme } from './helper'
import { getLocalSetting, setLocalSetting } from './helper'
import { store } from '@/store'

export const useAppStore = defineStore('app-store', {
  state: (): AppState => getLocalSetting(),
  actions: {
    // 侧边栏折叠状态
    setSideCollapsed(collapsed: boolean) {
      this.sideCollapsed = collapsed
      this.recordState()
    },

    // 主题
    setTheme(theme: Theme) {
      this.theme = theme
      this.recordState()
    },

    // 语言
    setLanguage(language: Language) {
      if (this.language !== language) {
        this.language = language
        this.recordState()
      }
    },

    // 记录状态
    recordState() {
      setLocalSetting(this.$state)
    },
  },
})

export function useAppStoreWithOut() {
  return useAppStore(store)
}
