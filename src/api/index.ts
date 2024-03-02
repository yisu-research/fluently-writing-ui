import type { AxiosRequestConfig } from 'axios'
import { request } from '@/utils/request'

export default {
  // 发送验证码
  sendCodeApi: (data: any) =>
    request.post('/api/verifications', data, { noNeedTip: true, noNeedToken: true } as AxiosRequestConfig),

  // 注册
  signupApi: (data: any) =>
    request.post('/api/signup', data, { noNeedTip: true, noNeedToken: true } as AxiosRequestConfig),

  // 登录
  loginApi: (data: any) =>
    request.post('/api/login', data, { noNeedTip: true, noNeedToken: true } as AxiosRequestConfig),

  // 创建对话
  createChatApi: (data: any) => request.post('/api/conversations', data, { noNeedTip: true } as AxiosRequestConfig),

  // 获取对话列表
  getChatListApi: (data: any) =>
    request.get('/api/conversations', { noNeedTip: true, params: data } as AxiosRequestConfig),

  // 删除对话
  deleteChatApi: (id: number) =>
    request.put(`/api/conversations/${id}/inactive`, { noNeedTip: true } as AxiosRequestConfig),

  // 更新对话
  updateChatApi: (id: number, data: any) =>
    request.put(`/api/conversations/${id}`, data, { noNeedTip: true } as AxiosRequestConfig),

  // 清除上下文
  cleanChatApi: (id: number) =>
    request.put(`/api/conversations/${id}/clear`, { noNeedTip: true } as AxiosRequestConfig),

  // 消息流
  getMessageStreamApi: (data: any) =>
    request.get('/api/messages/stream', { noNeedTip: true, data, params: data } as AxiosRequestConfig),

  // 消息详情
  getMessageDetailApi: (id: number) => request.get(`/api/messages/${id}`, { noNeedTip: true } as AxiosRequestConfig),

  // 获取消息列表
  getMessageListApi: (data: any) =>
    request.get('/api/messages', { noNeedTip: true, params: data, data } as AxiosRequestConfig),

  // 用户详情
  getProfileApi: () => request.get('/api/users/current', { noNeedTip: true, noNeedToken: false } as AxiosRequestConfig),

  // 绑定邮箱
  bindEmailApi: (data: any) => request.post('/api/users/email', data, { noNeedTip: true } as AxiosRequestConfig),

  // 修改密码
  updatePasswordApi: (data: any) => request.put('/api/users/password', data, { noNeedTip: true } as AxiosRequestConfig),

  // 重置密码
  resetPasswordApi: (data: any) =>
    request.post('/api/password_resets', data, { noNeedTip: true } as AxiosRequestConfig),

  // 生成邀请码
  createInviteCodeApi: (data: any) =>
    request.post('/api/users/invite', data, { noNeedTip: true } as AxiosRequestConfig),

  // 产品列表
  getProductListApi: () => request.get('/api/products'),

  // 订单列表
  getOrderListApi: (data: any) => request.get('/api/orders', { noNeedTip: true, params: data } as AxiosRequestConfig),

  // 创建订单
  postOrderApi: (data: any) => request.post('/api/orders', data, { noNeedTip: true } as AxiosRequestConfig),

  // 取消未支付订单
  cancelOrderApi: (id: number) => request.post(`/api/orders/${id}/cancel`, { noNeedTip: true } as AxiosRequestConfig),

  // 订单详情
  getOrderDetailApi: (id: number) => request.get(`/api/orders/${id}`, { noNeedTip: true } as AxiosRequestConfig),

  // 邀请奖励
  getInviteIncomeApi: (data: any) =>
    request.get('/api/incomes', { noNeedTip: true, params: data } as AxiosRequestConfig),

  // 上传文件
  uploadFileApi: (data: any, config: AxiosRequestConfig) => request.post('/api/attachments', data, config),
}
