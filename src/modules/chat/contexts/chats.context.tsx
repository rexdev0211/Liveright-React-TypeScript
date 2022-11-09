import moment from 'moment'
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { useHistory } from 'react-router-dom'

import { Routes } from '../../../enums/routes.enum'
import { useAccountBasedState } from '../../../hooks/account-based-state'
import { useAuth } from '../../../hooks/auth.hook'
import { useConnection } from '../../../hooks/connection.hook'
import logger from '../../../managers/logger.manager'
import { serverError } from '../../../pipes/server-error.pipe'
import { chatMessageState } from '../enums/chat-message-state.enum'
import { chatMessageTypes } from '../enums/chat-message-types.enum'
import {
  getChatUsers,
  getRoomMessages,
  uploadChatFile
} from '../managers/chat.manager'
import socketManager from '../managers/socket.manager'
import { emptyMessage } from '../pipes/msg-base'
import { ChatMessageType } from '../types/chat-message.type'
import { ChatMessageInvoiceMetaType } from '../types/chat-message-invoice-meta.type'
import { ChatMessageSessionMetaType } from '../types/chat-message-session-meta.type'
import { ChatQueueItemType } from '../types/chat-queue-item.type'
import { ChatRoomType } from '../types/chat-room.type'

interface RoomResponse {
  room: ChatRoomType
  messages: ChatMessageType[]
}

type ContextRoomType = {
  [roomId: string]: RoomResponse
}

export type ChatsContextType = {
  rooms: ContextRoomType
  popups: string[]
  expand: (roomID: string) => void
  collapse: (roomID: string) => void
  close: (roomID: string) => void
  getRoom: (roomId: string) => void
  updateRoom: (roomId: string, msg: ChatMessageType) => void
  seeRoom: (roomId: string) => void
  sendInvoice: (uuid: string, meta: ChatMessageInvoiceMetaType) => void
  sendSession: (meta: ChatMessageSessionMetaType) => void
  sendSessionReschedule: (meta: ChatMessageSessionMetaType) => void
  removeMessage: (room: string, id: string) => void
  findRoomByUserId: (userId?: number) => RoomResponse | null
}

const ChatsContext = createContext<ChatsContextType | null>(null)
export const useChats = () => useContext(ChatsContext) as ChatsContextType

export const ChatsProvider: FC<unknown> = ({ children }) => {
  const [rooms, setRooms] = useAccountBasedState<ContextRoomType>({}, 'rooms')
  const { uuid } = useAuth()
  const roomsRef = useRef<ContextRoomType>({})
  const [popups, setPopups] = useState<string[]>([])
  const history = useHistory()
  const queue = useRef<ChatQueueItemType[]>([])
  const isOnline = useConnection()

  useEffect(() => {
    if (!isOnline) return

    const retry = async () => {
      for await (const item of queue.current) {
        const room = roomsRef.current[item.message.chat_room_id]
        if (!room) return
        for await (const [i, file] of [...item.files].entries()) {
          await uploadChatFile(file).then(
            (res) => (item.message.content.files[i] = res)
          )
        }
        socketManager.sendMessage(item.message)
        queue.current = queue.current.filter((t) => t !== item)
        item.message.state = chatMessageState.SENT
        room.messages = [
          ...room.messages.filter((t) => t._id !== item.message._id),
          item.message
        ]
        setRooms({ ...roomsRef.current })
      }
    }

    retry()
  }, [isOnline])
  // const addToQueue = (queueItem: ChatQueueItemType) => {
  //   queue.current.push(queueItem)
  // }

  const close = (roomId: string) => {
    setPopups(popups.filter((p) => p !== roomId))
  }

  const expand = (roomId: string) => {
    close(roomId)
    history.push(Routes.CHAT + `/${roomId}`)
  }

  socketManager.useDelivered()(({ roomId }) => {
    logger.success('message seen handle', roomId)
    roomsRef.current[roomId].messages.forEach((message) => {
      if (!message.meta.delivered_at) {
        message.meta.delivered_at = moment().format()
      }
    })
    setRooms({ ...roomsRef.current })
  })

  const seeRoom = (roomId: string) => {
    roomsRef.current[roomId].room.unReadMessagesCount = 0
    setRooms({ ...roomsRef.current })
  }

  socketManager.useSeen()(({ roomId }) => {
    logger.success('message seen handle', roomId)
    roomsRef.current[roomId].messages.forEach((message) => {
      if (!message.meta.read_at) {
        message.meta.read_at = moment().format()
      }
    })
    setRooms({ ...roomsRef.current })
  })

  socketManager.useMessageReceived()((msg: ChatMessageType) => {
    console.log('NEW MESSAGE', msg)
    roomsRef.current[msg.chat_room_id].messages = [
      ...roomsRef.current[msg.chat_room_id].messages,
      msg
    ]
    roomsRef.current[msg.chat_room_id].room.lastMessage = msg
    roomsRef.current[msg.chat_room_id].room.unReadMessagesCount += 1
    setRooms({ ...roomsRef.current })
    socketManager.delivered(msg.chat_room_id)
  })

  const fetchRooms = () => {
    getChatUsers()
      .then((res) => {
        res.forEach((room) => {
          socketManager.join(room.roomId)
        })
        roomsRef.current = res.reduce(
          (rooms: ContextRoomType, room: ChatRoomType) => {
            rooms[room.roomId] = {
              room,
              messages: []
            }
            return rooms
          },
          {}
        )
        setRooms(roomsRef.current)
      })
      .catch((err) => logger.error('Fail to load chat users', serverError(err)))
  }

  useEffect(() => {
    socketManager.init(uuid)
    fetchRooms()
  }, [uuid])

  useEffect(() => {
    setTimeout(() => {
      socketManager.on('room:created:receive', () => {
        fetchRooms()
      })
    }, 1000)
  }, [])

  const collapse = (roomId: string) => {
    setPopups([...new Set([roomId, ...popups])])
    history.push(Routes.HOME)
  }
  const getRoom = (roomId: string) => {
    getRoomMessages(roomId).then((res) => {
      roomsRef.current[roomId] = {
        ...roomsRef.current[roomId],
        room: {
          ...roomsRef.current[roomId]?.room,
          unReadMessagesCount: 0
        },
        messages: res
      }
      setRooms({
        ...roomsRef.current
      })
    })
  }

  const updateRoom = (roomId: string, msg: ChatMessageType) => {
    roomsRef.current[roomId].messages = [
      ...roomsRef.current[roomId].messages,
      msg
    ]
    roomsRef.current[roomId].room.lastMessage = msg
    setRooms({
      ...roomsRef.current
    })
  }

  const sendSession = useCallback((meta: ChatMessageSessionMetaType) => {
    const room = Object.values(roomsRef.current)[0]
    if (!room) return

    const msg = emptyMessage(room.room.roomId, uuid)
    msg.session_meta_data = meta
    msg.types = [chatMessageTypes.TEXT, chatMessageTypes.REQUEST_SESSION]
    msg.content.text = 'I would like to schedule a PT Session'
    console.log('Session message payload', msg)
    socketManager.sendMessage(msg)
  }, [])

  const sendSessionReschedule = useCallback(
    (meta: ChatMessageSessionMetaType) => {
      const room = Object.values(roomsRef.current)[0]
      if (!room) return

      const msg = emptyMessage(room.room.roomId, uuid)
      msg.session_meta_data = meta
      msg.types = [chatMessageTypes.TEXT, chatMessageTypes.SESSION_RESCHDULE]
      msg.content.text = 'I would like to reschedule a PT Session'
      console.log('Session message payload', msg)
      socketManager.sendMessage(msg)
    },
    []
  )

  const sendInvoice = useCallback(
    (clientUuid: string, meta: ChatMessageInvoiceMetaType) => {
      const room = Object.values(roomsRef.current).find(
        (room) => room.room.account_uuid === clientUuid
      )
      if (!room) return
      const msg = emptyMessage(room.room.roomId, uuid)
      msg.invoice_meta_data = meta
      msg.types = [chatMessageTypes.TEXT, chatMessageTypes.INVOICE]
      msg.content.text = 'Reminder for your payment!'
      // msg.content.invoice_meta_data = meta
      console.log('Invoice message payload', msg)
      socketManager.sendMessage(msg)
    },
    []
  )

  const removeMessage = useCallback(
    (room: string, id: string) => {
      console.log('removing', id, roomsRef.current[room].messages)
      roomsRef.current[room].messages = roomsRef.current[room].messages.filter(
        ({ _id }) => _id !== id
      )
      setRooms({ ...roomsRef.current })
    },
    [rooms]
  )

  const findRoomByUserId = useCallback(
    (userId?: number): RoomResponse | null => {
      if (!userId) {
        return null
      }

      let room = null

      Object.keys(rooms).forEach((roomId) => {
        if (rooms[roomId].room.user_id === Number(userId)) {
          room = rooms[roomId]
        }
      })

      return room
    },
    [rooms]
  )

  return (
    <ChatsContext.Provider
      value={{
        rooms,
        popups,
        expand,
        close,
        collapse,
        getRoom,
        updateRoom,
        seeRoom,
        sendInvoice,
        removeMessage,
        sendSession,
        sendSessionReschedule,
        findRoomByUserId
      }}
    >
      {children}
    </ChatsContext.Provider>
  )
}
