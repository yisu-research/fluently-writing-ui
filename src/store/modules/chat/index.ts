import { defineStore } from 'pinia'
import { type ChatState, conversationState, type conversationType } from './helper'
import { defaultState } from './helper'
import { store } from '@/store'
import api from '@/api'

export const useChatStore = defineStore('chat-store', {
  state: (): ChatState => defaultState(),
  getters: {
    getActive(): number | null {
      return this.active
    },
    getConversation(): conversationType[] {
      return this.conversations
    },
    getChat(): any[] {
      return this.chat
    },
    // 是否还有更多会话
    hasMoreConversation(): boolean {
      return Boolean(this.total) && this.conversations.length < this.total
    },
  },
  actions: {
    setActive(active: number) {
      this.active = active
    },
    setChat(chat: any[]) {
      this.chat = chat
    },
    // 设置会话总数
    setTotal(total: number) {
      this.total = total
    },
    // 序列化会话列表
    serializeConversation(conversations: any[]) {
      return conversations.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          model: item.model,
          pattern: item.pattern,
          spendCount: item.spend_count,
          state: item.state,
          userId: item.user_id,
        }
      })
    },
    // 会话列表页数加一
    pageIncrement() {
      this.page = this.page + 1
    },
    // 更新会话列表
    updateConversation(conversations: conversationType[]) {
      // 将 conversations 中的数据添加到 this.conversations 中
      this.conversations = [...this.conversations, ...conversations]
    },
    // 获取会话列表
    async fetchConversation() {
      if (this.total && this.conversations.length >= this.total) {
        return
      }
      try {
        const res: any = await api.getChatListApi({
          state: conversationState.active,
          page: this.page,
          limit: this.limit,
        })

        const conversations = this.serializeConversation(res.conversations)
        // 初始化active
        if (this.active === null) {
          this.setActive(conversations[0].id)
        }
        this.pageIncrement()
        this.setTotal(res.total_count)
        this.updateConversation(conversations)
      } catch (error) {
        console.error(error)
      }
    },
    // 更新会话通过id
    async updateConversationById(id: number, data: any) {
      try {
        // 与服务端同步
        await api.updateChatApi(id, data)
        // 与本地同步
        const index = this.conversations.findIndex((item) => item.id === id)
        this.conversations[index] = { ...this.conversations[index], ...data }
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },

    // 删除会话通过id
    async deleteConversationById(id: number) {
      try {
        // 与服务端同步
        await api.deleteChatApi(id)
        // 与本地同步
        const index = this.conversations.findIndex((item) => item.id === id)
        this.conversations.splice(index, 1)
        // 判断当前对话是否 active
        if (this.active === id && this.conversations.length) {
          this.setActive(this.conversations[0].id)
        }
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
  },
})

export function useChatStoreWithOut() {
  return useChatStore(store)
}
