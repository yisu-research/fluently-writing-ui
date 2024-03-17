import { eStorage } from '@/utils/storage'

const LOCAL_NAME = 'appSetting'

export type Theme = 'light' | 'dark'

export type Language = 'zh-CN' | 'en-US'

export interface AppState {
  sideCollapsed: boolean
  theme: Theme
  language: Language
  v4Notice: boolean
}

// 应用的默认设置
export function defaultSetting(): AppState {
  return { sideCollapsed: false, theme: 'light', language: 'zh-CN', v4Notice: true }
}

// 从本地存储中获取应用设置
export function getLocalSetting(): AppState {
  const localSetting: AppState | undefined = eStorage.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

// 将应用设置保存到本地存储
export function setLocalSetting(setting: AppState): void {
  eStorage.set(LOCAL_NAME, setting)
}
