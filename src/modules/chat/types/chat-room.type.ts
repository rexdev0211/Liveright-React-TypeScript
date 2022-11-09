import { ChatMessageType } from './chat-message.type'

export type ChatRoomType = {
  id: number
  firstName: string
  lastName: string
  avatar: { url: string; thumb_url: string }
  lastMessage: null | ChatMessageType
  unReadMessagesCount: number
  roomId: string
  user_id: number
  user_uuid: string
  account_uuid: string
  meta?: {
    lastSeenAt: string
  }
}
