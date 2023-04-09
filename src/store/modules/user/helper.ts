import { eStorage } from '@/utils/storage'

const LOCAL_NAME = 'userState'

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

// 获取用户信息
export function getUserInfo() {
  return eStorage.get(LOCAL_NAME)
}

// 设置用户信息
export function setUserInfo(userInfo: UserState) {
  eStorage.set(LOCAL_NAME, userInfo)
}
