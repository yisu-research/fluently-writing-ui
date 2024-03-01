import { defineStore } from 'pinia'
import type { Gender, UserState } from './helper'
import { getLocalSetting, setLocalSetting } from './helper'
import { store } from '@/store'
import api from '@/api'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalSetting(),
  getters: {
    getId: (state) => state.id,
    getUsername: (state) => state.username,
    getEmail: (state) => state.email,
    getBalance: (state) => state.balance,
    getCredit: (state) => state.credit,
    getInviteCode: (state) => state.invite_code,
    getFirstPurchase: (state) => state.first_purchase,
    getCreatedAt: (state) => state.created_at,
    getUpdatedAt: (state) => state.updated_at,
    getInvitationCount: (state) => state.invitation_count,
    getAvatar: (state) => state.avatar,
    getGender: (state) => state.gender,
    getInviteeCount: (state) => state.invitation_count.invitee_count ?? 0,
    getWithdraw: (state) => (state.invitation_count.total_income ?? 0) / 100,
    getCallCount: (state) => state.invitation_count.call_count ?? 0,
  },
  actions: {
    async fetchProfile() {
      try {
        const res: any = await api.getProfileApi()
        this.setProfile(res)
      } catch (error) {
        console.error(error)
      }
    },

    // 设置头像
    setAvatar(avatar: string) {
      this.avatar = avatar
      this.recordState()
    },

    //
    setProfile(profile: UserState) {
      this.id = profile.id
      this.username = profile.username
      this.email = profile.email
      this.balance = profile.balance
      this.credit = profile.credit
      this.invite_code = profile.invite_code
      this.first_purchase = profile.first_purchase
      this.created_at = profile.created_at
      this.updated_at = profile.updated_at
      this.invitation_count = profile.invitation_count

      this.recordState()
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

export function useUserStoreWithOut() {
  return useUserStore(store)
}
