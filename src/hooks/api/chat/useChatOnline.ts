import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { setInterval } from 'timers'

import socketManager from '../../../modules/chat/managers/socket.manager'

interface UseChatOnlineProps {
  usersSeen: Record<string, any>
  isOnline: (uuid: string, lastSeenAt?: string) => boolean
  lastSeen: (uuid: string, lastSeenAt?: string, prefix?: boolean) => string
}

export default function useChatOnline(): UseChatOnlineProps {
  const [usersSeen, setUsersSeen] = useState<Record<string, any>>({})
  usePingChatOnline()

  const onlineListener = useCallback((e) => {
    setUsersSeen((prevState) => ({
      ...prevState,
      [e.uuid]: e.lastSeenAt
    }))
  }, [])

  useEffect(() => {
    setTimeout(() => {
      socketManager.on('event:lastSeen:receive', onlineListener)
    }, 1000)
    return () => {
      socketManager.off('event:lastSeen:receive', onlineListener)
    }
  }, [onlineListener])

  const isOnline = (uuid: string, lastSeenAt?: string) => {
    const userLastSeen = usersSeen[uuid] || lastSeenAt
    const minuteAgo = moment().subtract(2, 'minute')
    return userLastSeen ? moment(userLastSeen).isAfter(minuteAgo) : false
  }

  const lastSeen = (uuid: string, lastSeenAt?: string, prefix?: boolean) => {
    const userLastSeen = usersSeen[uuid] || lastSeenAt
    return userLastSeen
      ? isOnline(uuid, userLastSeen)
        ? 'Online'
        : `${prefix ? 'Last seen' : ''} ${moment(userLastSeen).fromNow()}`
      : 'Offline'
  }

  return {
    usersSeen,
    isOnline,
    lastSeen
  }
}

export function usePingChatOnline() {
  useEffect(() => {
    const interval = setInterval(() => {
      socketManager.pingLogin()
    }, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [])
}
