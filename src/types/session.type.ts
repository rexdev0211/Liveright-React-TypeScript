export type PersonType = {
  id: number
  type: 'client' | 'trainer'
  user: {
    first_name: string
    last_name: string
    avatar: { url: string } | null
  }
}

export type ClientRequest = {
  date: string
  duration: string
  time: string
}

export type SessionType = {
  id: number
  starts_at: string
  ends_at: string
  duration: string
  type: Session
  client?: PersonType
  trainer?: PersonType
  client_request?: ClientRequest
  notes?: string | null
  is_awaiting_scheduling?: boolean
  is_awaiting_rescheduling?: boolean
}

export type Session = 'Paid PT' | 'Complimentary' | 'Consulting' | 'Coaching'

export type SessionStatus = 'upcoming' | 'past' | 'awaiting_scheduling'

export type SessionFilter = {
  id?: number
  trainer_id?: number
  client_id?: number
  client_name?: string
  type?: string
  status?: SessionStatus
  date?: string
}

export type SessionEdit = {
  id: number
  date: string
  time: string
  duration: string
  notes: string
}
