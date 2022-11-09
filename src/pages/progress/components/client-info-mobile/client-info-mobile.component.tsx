import React, { useState } from 'react'
import { useParams } from 'react-router'

import {
  CaretDownIcon,
  ChatIcon,
  GroupIcon
} from '../../../../assets/media/icons'
import Button from '../../../../components/buttons/button/button.component'
import IconButton from '../../../../components/buttons/icon-button/icon-button.component'
import UserBadge from '../../../../components/user-badge/user-badge.component'
import { Routes } from '../../../../enums/routes.enum'
import useClientAccount from '../../../../hooks/api/accounts/useClientAccount'
import useChatOnline from '../../../../hooks/api/chat/useChatOnline'
import useLastActivity from '../../../../hooks/api/progress/useLastActivity'
import { useChats } from '../../../../modules/chat/contexts/chats.context'
import SwitchClient from '../switch-client/switch-client.component'
import { Styles } from './client-info-mobile.styles'

export default function ClientInfoMobile() {
  const params = useParams<any>()
  const { user } = useClientAccount(params.clientId)
  const [opened, setOpened] = useState(false)
  const [switchClient, setSwitchClient] = useState(false)
  const { lastSeen } = useChatOnline()
  const { findRoomByUserId } = useChats()

  const room = findRoomByUserId(params.clientId)

  const { activityValue, activityLabel } = useLastActivity()

  return (
    <>
      <Styles className="progress__client-card">
        <div className="progress__client-card-head">
          <div className="progress__client-card-badge">
            <UserBadge
              key={params.clientId}
              avatar={user.avatar?.url}
              firstName={user.first_name}
              lastName={user.last_name}
              text="semi-bold"
              size="lg"
            />

            {opened && (
              <IconButton
                size="sm"
                className="progress__client-card-link"
                to={`${Routes.CHAT}/${room?.room.roomId}`}
              >
                <ChatIcon />
              </IconButton>
            )}
          </div>

          <IconButton
            size="sm"
            className="progress__client-card-expand"
            onClick={() => setOpened(!opened)}
          >
            <CaretDownIcon />
          </IconButton>
        </div>

        {opened && (
          <div className="progress__client-card-info">
            <p className="progress__client-card-text">
              Last Active:
              <span> {lastSeen(user.uuid, room?.room.meta?.lastSeenAt)}</span>
            </p>
            <p className="progress__client-card-text">
              {activityLabel} <span>{activityValue}</span>
            </p>
          </div>
        )}

        <div className="progress__client-card-actions">
          <Button
            variant="text"
            size="sm"
            className="progress__client-card-switch"
            onClick={() => setSwitchClient(true)}
          >
            <GroupIcon />
            Switch Client
          </Button>

          <Button
            variant="secondary"
            size="sm"
            to={Routes.CLIENTS + `/${params.clientId}/profile`}
          >
            Open Profile
          </Button>
        </div>
      </Styles>

      <SwitchClient
        open={switchClient}
        onClose={() => setSwitchClient(false)}
      />
    </>
  )
}
