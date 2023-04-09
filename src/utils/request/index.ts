import type { CreateAxiosDefaults } from 'axios'
import axios from 'axios'
import { reqReject, reqResolve, resReject, resResolve } from './interceptors'

export function createAxios(options: CreateAxiosDefaults<any> | undefined) {
  const defaultOptions = {
    timeout: 60000,
  }
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })

  // 设置跨域请求携带cookie
  service.defaults.withCredentials = true

  service.interceptors.request.use(reqResolve, reqReject)
  service.interceptors.response.use(resResolve, resReject)
  return service
}

export const request = createAxios({
  baseURL: import.meta.env.VITE_BASE_API,
})
