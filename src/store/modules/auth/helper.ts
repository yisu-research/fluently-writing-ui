import { eStorage } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN'

// 获取Token
export function getToken() {
  return eStorage.get(LOCAL_NAME)
}

// 设置Token
export function setToken(token: string) {
  eStorage.set(LOCAL_NAME, token)
}

// 移除Token
export function removeToken() {
  eStorage.remove(LOCAL_NAME)
}
