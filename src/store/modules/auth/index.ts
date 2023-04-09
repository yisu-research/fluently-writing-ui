import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'

interface AuthState {
  token: string | undefined
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
  }),
  getters: {
    isLogin(): boolean {
      return !!this.token
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token
      setToken(token)
    },
    removeToken() {
      this.token = undefined
      removeToken()
    },
  },
})
