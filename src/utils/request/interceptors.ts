import { resolveResError } from './helper'
import type { RequestError } from './types'
import { useAuthStore } from '@/store'

export function reqResolve(config: any) {
  if (config.noNeedToken) {
    return config
  }

  const token = useAuthStore().token
  if (!token) {
    const error: RequestError = new Error('登录已过期，请重新登录！')
    error.code = 401
    return Promise.reject(error)
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
    const error: RequestError = new Error(message)
    error.code = code
    return Promise.reject(error)
  }
  return Promise.resolve(data)
}

export function resReject(error: any) {
  if (!error || !error.response) {
    const code = error?.code
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, error.message)
    window.$message?.error(message)
    const customError: RequestError = new Error(message)
    customError.code = code
    return Promise.reject(customError)
  }
  const { data, status, config } = error.response
  const code = data?.code ?? status
  const message = resolveResError(code, data?.message ?? error.message)
  /** 需要错误提醒 */
  !config?.noNeedTip && window.$message?.error(message)
  const customError: RequestError = new Error(message)
  customError.code = code
  return Promise.reject(customError)
}
