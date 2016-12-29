interface User {
  id: string
  title: string
  email: string
  phone: string
  skype: string
  handler: string
  lastName: string
  firstName: string
  fullName: string
  teamId: string
  deleted: boolean
  status: null
  color: string
  tz: string
  tzLabel: string
  tzOffset: number
  isAdmin: boolean
  isOwner: boolean
  isPrimaryOwner: boolean
  isRestricted: boolean
  isUltraRestricted: boolean
  isBot: boolean
}

export interface PartialUser {
  id?: string
  title?: string
  email?: string
  phone?: string
  skype?: string
  handler?: string
  lastName?: string
  firstName?: string
  fullName?: string
  teamId?: string
  deleted?: boolean
  status?: null
  color?: string
  tz?: string
  tzLabel?: string
  tzOffset?: number
  isAdmin?: boolean
  isOwner?: boolean
  isPrimaryOwner?: boolean
  isRestricted?: boolean
  isUltraRestricted?: boolean
  isBot?: boolean
}

export default User
