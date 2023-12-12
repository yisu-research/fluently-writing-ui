import { defineStore } from 'pinia'
import type { AppState, Gender, Language, Theme } from './helper'
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
    getGender(): Gender {
      return this.gender
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

    // 性别
    setGender(gender: Gender) {
      this.gender = gender
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
