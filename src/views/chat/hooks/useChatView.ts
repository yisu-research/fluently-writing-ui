import { useChatStoreWithOut } from '@/store'
import type { ContentType, IdType, MessageType, chatRole, modelType } from '@/store/modules/chat/helper'

export function useChatView() {
  const chatStore = useChatStoreWithOut()

  const addMessage = (
    id: IdType,
    conversationId: number,
    model: modelType,
    pattern: string,
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
      pattern,
      role,
      content: contents,
      dateTime: new Date().toISOString(),
      error: false,
      loading: false,
    }
    chatStore.addChatByConversationId(conversationId, message)
  }

  // 更新消息
  const updateMessage = (
    id: IdType,
    conversationId: number,
    model: modelType,
    pattern: string,
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
      pattern,
      role,
      content: contents,
      dateTime: new Date().toISOString(),
      error: false,
      loading: true,
    }
    chatStore.updateChatByConversationId(conversationId, message)
  }
  return {
    addMessage,
    updateMessage,
  }
}
