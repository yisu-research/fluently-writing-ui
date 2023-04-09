/* eslint-disable prefer-promise-reject-errors */
import { resolveResError } from './helper'
import { useAuthStore } from '@/store'

export function reqResolve(config: any) {
  // 处理不需要token的请求
  if (config.noNeedToken) {
    return config
  }

  const token = useAuthStore().token
  if (!token) {
    return Promise.reject({ code: 401, message: '登录已过期，请重新登录！' })
  }

  /**
   * * 加上 token
   * ! 认证方案: JWT Bearer
   */
  config.headers.Authorization = `Bearer ${token}`
  config.headers.Accept = 'application/json'

  return config
}

export function reqReject(error: any) {
  return Promise.reject(error)
}

export function resResolve(response: any) {
  const { data, status, config, statusText } = response
  if (status >= 400) {
    const code = status

    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, data?.message ?? statusText)

    /** 需要错误提醒 */
    !config.noNeedTip && window.$message?.error(message)
    return Promise.reject({ status, message, error: data || response })
  }
  return Promise.resolve(data)
}

export function resReject(error: any) {
  if (!error || !error.response) {
    const code = error?.code
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, error.message)
    window.$message?.error(message)
    return Promise.reject({ code, message, error })
  }
  const { data, status, config } = error.response
  const code = data?.code ?? status
  const message = resolveResError(code, data?.message ?? error.message)
  /** 需要错误提醒 */
  !config?.noNeedTip && window.$message?.error(message)
  return Promise.reject({ code, message, error: error.response?.data || error.response })
}
