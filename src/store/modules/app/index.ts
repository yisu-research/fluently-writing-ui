import { defineStore } from 'pinia'
import type { AppState, Language, Theme } from './helper'
import { getLocalSetting, setLocalSetting } from './helper'
import { store } from '@/store'

export const useAppStore = defineStore('app-store', {
  state: (): AppState => getLocalSetting(),
  getters: {
    isDarkTheme(): boolean {
      return this.theme === 'dark'
    },
    getLanguage(): Language {
      return this.language
    },
    getV4Notice(): boolean {
      return this.v4Notice
    },
    getGpt4oNotice(): boolean {
      return this.gpt4oNotice
    },
  },
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
    // v4 notice
    setV4Notice(v4Notice: boolean) {
      this.v4Notice = v4Notice
      this.recordState()
    },

    // gpt4o notice
    setGpt4oNotice(gpt4oNotice: boolean) {
      this.gpt4oNotice = gpt4oNotice
      this.recordState()
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
