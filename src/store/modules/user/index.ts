import { defineStore } from 'pinia'
import type { UserState } from './helper'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => ({
    id: undefined,
    username: undefined,
    email: undefined,
    balance: undefined,
    invite_code: undefined,
    first_purchase: undefined,
    created_at: undefined,
    updated_at: undefined,
    invitation_count: {
      invitee_count: undefined,
      total_income: undefined,
      call_count: undefined,
      withdraw: undefined,
      balance: undefined,
    },
  }),
  getters: {},
  actions: {},
})
