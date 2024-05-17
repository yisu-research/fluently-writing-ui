import { defineStore } from 'pinia'
import { type ChatState, type MessageType, type chatType, conversationState, type conversationType } from './helper'
import { defaultState } from './helper'
import { store } from '@/store'
import api from '@/api'

export const useChatStore = defineStore('chat-store', {
  state: (): ChatState => defaultState(),
  getters: {
    getCurrent(): number | null {
      return this.current
    },
    getConversation(): conversationType[] {
      return this.conversations
    },
    getCleaned(): boolean {
      return this.cleaned
    },
    getCurrentConversation(): conversationType | undefined {
      return this.conversations.find((item) => item.id === this.current)
    },
    // 当前聊天内容
    getCurrentMessages(): MessageType[] {
      return this.chats.find((item) => item.id === this.current)?.messages || []
    },
    // 获取当前聊天的最后一条消息
    getLastMessage(): MessageType | undefined {
      return this.chats.find((item) => item.id === this.current)?.messages.slice(-1)[0]
    },
    // 当前聊天内容的同步状态
    getCurrentSync(): boolean {
      return this.chats.find((item) => item.id === this.current)?.sync || false
    },
    // 目前已有的聊天内容
    getAllChats(): chatType[] {
      return this.chats
    },
    // 是否还有更多会话
    hasMoreConversation(): boolean {
      return Boolean(this.total) && this.conversations.length < this.total
    },
  },
  actions: {
    setCurrent(active: number | null) {
      this.current = active
    },
    setCleaned(cleaned: boolean) {
      this.cleaned = cleaned
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
          spendCount: item.spend_count,
          state: item.state,
          userId: item.user_id,
          startMessageId: item.start_message_id,
        }
      })
    },
    // 修改当前对话的 startMessageId
    updateStartMessageId(startMessageId: number) {
      this.conversations.forEach((item) => {
        if (item.id === this.current) {
          item.startMessageId = startMessageId
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
    // 在会话列表插入新的会话
    insertConversation(conversation: conversationType) {
      this.conversations.unshift(conversation)
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
        this.pageIncrement()
        this.setTotal(res.total_count)
        this.updateConversation(conversations)
        // 为每个会话初始化聊天内容
        conversations.forEach((item) => {
          this.chats.push({
            id: item.id,
            sync: false,
            messages: [],
          })
        })
      } catch (error) {
        console.error(error)
      }
    },
    // 编辑会话通过id
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
        // 判断是否当前对话
        if (this.current === id && this.conversations.length) {
          this.setCurrent(this.conversations[0].id)
        }
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },

    findChatById(id: number) {
      const chat = this.chats.find((item) => item.id === id)
      if (!chat) {
        this.chats.push({
          id,
          sync: false,
          messages: [],
        })
        return this.chats[this.chats.length - 1]
      }
      return chat
    },

    // 初始化对话通过id
    async initConversationById(id: number) {
      try {
        // 与服务端同步
        const res: any = await api.getMessageListApi({ conversation_id: id })
        const chat = this.findChatById(id)
        chat.sync = true
        if (res.length) {
          res.forEach((item: any) => {
            chat?.messages.push({
              id: item.id,
              conversationId: item.conversation_id,
              model: item.model,
              role: item.role,
              content: item.content,
              dateTime: item.created_at,
              error: false,
              loading: false,
              spendCount: item.spend_count,
              credit: item.credit,
              questionTokens: item.question_tokens,
              promptTokens: item.prompt_tokens,
              completionTokens: item.completion_tokens,
              totalTokens: item.total_tokens,
              contextMessagesCount: item.context_messages_count,
            })
          })
        }
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },

    // 更新对话通过id
    async updateMessagesById(id: number) {
      const chat = this.findChatById(id)

      try {
        // 与服务端同步
        const res: any = await api.getMessageListApi({ conversation_id: id })

        if (res.length) {
          chat.messages = []
          res.forEach((item: any) => {
            chat.messages.push({
              id: item.id,
              conversationId: item.conversation_id,
              model: item.model,
              role: item.role,
              content: item.content,
              dateTime: item.created_at,
              error: false,
              loading: false,
              spendCount: item.spend_count,
              credit: item.credit,
              questionTokens: item.question_tokens,
              promptTokens: item.prompt_tokens,
              completionTokens: item.completion_tokens,
              totalTokens: item.total_tokens,
              contextMessagesCount: item.context_messages_count,
            })
          })
        }
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },

    // 添加聊天
    addChatByConversationId(id: number, message: MessageType) {
      const index = this.chats.findIndex((item) => item.id === id)

      if (index !== -1) {
        this.chats[index].messages.push(message)
      }
    },
    // 更新聊天
    updateChatByConversationId(id: number, message: MessageType) {
      const index = this.chats.findIndex((item) => item.id === id)

      if (index !== -1) {
        const messageIndex = this.chats[index].messages.findIndex((item) => item.id === message.id)
        if (messageIndex !== -1) {
          this.chats[index].messages[messageIndex] = message
        }
      }
    },
  },
})

export function useChatStoreWithOut() {
  return useChatStore(store)
}
