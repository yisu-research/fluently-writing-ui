export interface ChatState {
  active: number | null
  total: number
  page: number
  limit: number | null
  conversations: conversationType[]
  chat: any[]
}

export enum conversationState {
  active = 'active',
  inactive = 'inactive',
}

export enum modelType {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4-1106-preview',
  GPT4_VISION = 'gpt-4-vision-preview',
}

export interface conversationType {
  id: number
  name: string
  model: modelType
  pattern: string
  spendCount: number
  state: conversationState
  userId: number
}

export function defaultState(): ChatState {
  return {
    active: null,
    total: 0,
    page: 1,
    limit: 20,
    conversations: [],
    chat: [],
  }
}
