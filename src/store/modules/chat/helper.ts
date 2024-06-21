export interface ChatState {
  current: number | null
  total: number
  page: number
  limit: number | null
  conversations: conversationType[]
  chats: chatType[]
  cleaned: boolean
}

// {
//   "model": "gpt-4-vision-preview",
//   "id": 330247,
//   "conversation_id": 30076,
//   "user_content": null,
//   "assistant_content": null,
//   "completion_content": null,
//   "role": "user",
//   "content": [
//     {
//       "type": "image_url",
//       "image_url": {
//         "url": "https://ai.yisukeyan.com/api/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzIsInB1ciI6ImJsb2JfaWQifX0=--fb97d20cf2a0ee41cb0c0a8708b0a1499e0bec2c/1703127039.jpg"
//       }
//     },
//     {
//       "text": "描述这张图片",
//       "type": "text"
//     }
//   ],
//   "spend_count": 0,
//   "pattern": "multi",
//   "created_at": "2023-12-21T10:50:53.205+08:00",
//   "updated_at": "2023-12-21T10:50:53.205+08:00"
// }
export interface chatType {
  id: number
  sync: boolean
  messages: MessageType[]
}

export interface ContentType {
  type: 'text' | 'image_url'
  text?: string
  image_url?: {
    url: string
  }
}

export type IdType = number | string
export interface MessageType {
  id: IdType
  conversationId: number
  model: modelType
  role: chatRole
  content: ContentType[]
  dateTime: string
  error: boolean
  loading: boolean
  spendCount: number
  credit: string
  questionTokens: number
  promptTokens: number
  completionTokens: number
  totalTokens: number
  contextMessagesCount: number
}

export enum chatRole {
  user = 'user',
  assistant = 'assistant',
}

export enum conversationState {
  active = 'active',
  inactive = 'inactive',
}

export enum modelType {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT4o = 'gpt-4o',
  // GPT4 = 'gpt-4-1106-preview',
  // GPT4_VISION = 'gpt-4-vision-preview',
}

export interface conversationType {
  id: number
  name: string
  model: modelType
  // pattern: string
  spendCount: number
  startMessageId: number
  state: conversationState
  userId: number
  updatedAt: string
  createdAt: string
}

export function defaultState(): ChatState {
  return {
    current: null,
    total: 0,
    page: 1,
    limit: 30,
    conversations: [],
    chats: [],
    cleaned: false,
  }
}
