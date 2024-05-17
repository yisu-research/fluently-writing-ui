import { useChatStoreWithOut } from '@/store'
import type { ContentType, IdType, MessageType, chatRole, modelType } from '@/store/modules/chat/helper'

export function useChatView() {
  const chatStore = useChatStoreWithOut()

  const addMessage = (
    id: IdType,
    conversationId: number,
    model: modelType,
    role: chatRole,
    contents: ContentType[],
  ) => {
    if (contents.length === 0) {
      return
    }
    const message: MessageType = {
      id,
      conversationId,
      model,
      role,
      content: contents,
      dateTime: new Date().toISOString(),
      error: false,
      loading: false,
      spendCount: 0,
      credit: '',
      questionTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      contextMessagesCount: 0,
    }
    chatStore.addChatByConversationId(conversationId, message)
  }

  // 更新消息
  const updateMessage = (
    id: IdType,
    conversationId: number,
    model: modelType,
    role: chatRole,
    contents: ContentType[],
  ) => {
    if (contents.length === 0) {
      return
    }
    const message: MessageType = {
      id,
      conversationId,
      model,
      role,
      content: contents,
      dateTime: new Date().toISOString(),
      error: false,
      loading: true,
      spendCount: 0,
      credit: '',
      questionTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      contextMessagesCount: 0,
    }
    chatStore.updateChatByConversationId(conversationId, message)
  }
  return {
    addMessage,
    updateMessage,
  }
}
