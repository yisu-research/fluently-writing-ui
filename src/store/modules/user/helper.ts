import { eStorage } from '@/utils/storage'

const LOCAL_NAME = 'userSetting'

/**
 * 用户信息
  {
    "id": 2,
    "username": "一粟科研",
    "email": null,
    "balance": 99844,
    "invite_code": "LDPrdJ",
    "first_purchase": true,
    "created_at": "2023-03-19T07:44:33.715+08:00",
    "updated_at": "2023-03-26T00:30:02.324+08:00",
    "invitation_count": {
        "invitee_count": 1,
        "total_income": 0,
        "call_count": 0,
        "withdraw": 0,
        "balance": 0
    }
}
 */
export interface UserState {
  id: number | undefined
  username: string | undefined
  email: string | null | undefined
  balance: number | undefined
  invite_code: string | null | undefined
  first_purchase: boolean | undefined
  created_at: string | undefined
  updated_at: string | undefined
  invitation_count: {
    invitee_count: number | undefined
    total_income: number | undefined
    call_count: number | undefined
    withdraw: number | undefined
    balance: number | undefined
  }
}

// 用户的默认设置
export function defaultSetting(): UserState {
  return {
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
  }
}

// 从本地存储中获取应用设置
export function getLocalSetting(): UserState {
  const localSetting: UserState | undefined = eStorage.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

// 将应用设置保存到本地存储
export function setLocalSetting(setting: UserState): void {
  eStorage.set(LOCAL_NAME, setting)
}
