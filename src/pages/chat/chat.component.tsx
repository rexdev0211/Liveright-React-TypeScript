import React from 'react'
import { useParams } from 'react-router'
import { Redirect } from 'react-router-dom'

import { Routes } from '../../enums/routes.enum'
import userTypes from '../../enums/user-types.enum'
import useTrainerAccount from '../../hooks/api/accounts/useTrainerAccount'
import { useAuth } from '../../hooks/auth.hook'
import { useIsMobile } from '../../hooks/is-mobile.hook'
import MobilePage from '../../layouts/mobile-page/mobile-page.component'
import { useChats } from '../../modules/chat/contexts/chats.context'
import Styles from './chat.styles'
import ChatMessages from './layouts/chat-messages/chat-messages.component'
import ChatRooms from './layouts/chat-rooms/chat-rooms.component'
import ChatTrainer from './layouts/chat-trainer/chat-trainer.component'

const Chat = () => {
  const { type } = useAuth()
  const isMobile = useIsMobile()
  const { rooms } = useChats()
  const { room } = useParams<{ room?: string }>()
  const trainer = useTrainerAccount()

  if (trainer.noTrainer) {
    return <Redirect to={Routes.HOME} />
  }

  if (type !== userTypes.CLIENT && room && !rooms[room])
    return <Redirect to={Routes.CHAT} />
  if (type === userTypes.CLIENT && !room) {
    const trainerRoom = Object.keys(rooms)?.find(
      (key) => rooms[key]?.room?.user_uuid === trainer.user?.uuid
    )

    if (trainerRoom && rooms[trainerRoom]) {
      return <Redirect to={Routes.CHAT + `/${trainerRoom}`} />
    } else {
      return null
    }
  }

  if (isMobile) {
    if (!room) {
      return (
        <MobilePage
          color="secondary"
          title="Chat"
          headerNavChat
          headerSpacing={10}
        >
          <ChatRooms />
        </MobilePage>
      )
    }
    return <ChatMessages room={room} />
  }

  return (
    <Styles>
      {type === userTypes.CLIENT ? <ChatTrainer /> : <ChatRooms />}
      <ChatMessages room={room || ''} />
    </Styles>
  )
}

export default Chat
